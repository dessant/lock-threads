const core = require('@actions/core');
const github = require('@actions/github');

const schema = require('./schema');

async function run() {
  try {
    const config = getConfig();
    const client = github.getOctokit(config['github-token']);

    const app = new App(config, client);
    await app.lockThreads();
  } catch (err) {
    core.setFailed(err.message);
  }
}

class App {
  constructor(config, client) {
    this.config = config;
    this.client = client;
  }

  async lockThreads() {
    const type = this.config['process-only'];
    const logOutput = this.config['log-output'];

    const threadTypes = type ? [type] : ['issue', 'pr'];
    for (const item of threadTypes) {
      const threads = await this.lock(item);

      core.debug(`Setting output (${item}s)`);
      if (threads.length) {
        core.setOutput(`${item}s`, JSON.stringify(threads));

        if (logOutput) {
          core.info(`Output (${item}s):`);
          core.info(JSON.stringify(threads, null, 2));
        }
      } else {
        core.setOutput(`${item}s`, '');
      }
    }
  }

  async lock(type) {
    const repo = github.context.repo;
    const addLabels = this.config[`add-${type}-labels`];
    const removeLabels = this.config[`remove-${type}-labels`];
    const comment = this.config[`${type}-comment`];
    const lockReason = this.config[`${type}-lock-reason`];

    const threads = [];

    const results = await this.search(type);
    for (const result of results) {
      const issue = {...repo, issue_number: result.number};

      if (comment) {
        core.debug(`Commenting (${type}: ${issue.issue_number})`);
        try {
          await this.client.rest.issues.createComment({
            ...issue,
            body: comment
          });
        } catch (err) {
          if (!/cannot be modified.*discussion/i.test(err.message)) {
            throw err;
          }
        }
      }

      if (addLabels || removeLabels) {
        const {data: issueData} = await this.client.rest.issues.get({...issue});

        if (addLabels) {
          const currentLabels = issueData.labels.map(label => label.name);
          const newLabels = addLabels.filter(
            label => !currentLabels.includes(label)
          );

          if (newLabels.length) {
            core.debug(`Labeling (${type}: ${issue.issue_number})`);
            await this.client.rest.issues.addLabels({
              ...issue,
              labels: newLabels
            });
          }
        }

        if (removeLabels) {
          const currentLabels = issueData.labels.map(label => label.name);
          const matchingLabels = currentLabels.filter(label =>
            removeLabels.includes(label)
          );
          if (matchingLabels.length) {
            core.debug(`Unlabeling (${type}: ${issue.issue_number})`);
            for (const label of matchingLabels) {
              await this.client.rest.issues.removeLabel({
                ...issue,
                name: label
              });
            }
          }
        }
      }

      core.debug(`Locking (${type}: ${issue.issue_number})`);
      let params;
      if (lockReason) {
        params = {
          ...issue,
          lock_reason: lockReason,
          headers: {
            accept: 'application/vnd.github.sailor-v-preview+json'
          }
        };
      } else {
        params = issue;
      }
      await this.client.rest.issues.lock(params);

      threads.push(issue);
    }

    return threads;
  }

  async search(type) {
    const {owner, repo} = github.context.repo;
    const updatedTime = this.getUpdatedTimestamp(
      this.config[`${type}-inactive-days`]
    );
    let query = `repo:${owner}/${repo} updated:<${updatedTime} is:closed is:unlocked`;

    const includeAnyLabels = this.config[`include-any-${type}-labels`];
    const includeAllLabels = this.config[`include-all-${type}-labels`];

    if (includeAllLabels) {
      query += ` ${includeAllLabels
        .map(label => `label:"${label}"`)
        .join(' ')}`;
    } else if (includeAnyLabels) {
      query += ` label:${includeAnyLabels.join(',')}`;
    }

    const excludeAnyLabels = this.config[`exclude-any-${type}-labels`];
    if (excludeAnyLabels) {
      query += ` -label:${excludeAnyLabels.join(',')}`;
    }

    const excludeCreatedQuery = this.getFilterByDateQuery({
      type,
      qualifier: 'created'
    });
    if (excludeCreatedQuery) {
      query += ` ${excludeCreatedQuery}`;
    }

    const excludeClosedQuery = this.getFilterByDateQuery({
      type,
      qualifier: 'closed'
    });
    if (excludeClosedQuery) {
      query += ` ${excludeClosedQuery}`;
    }

    if (type === 'issue') {
      query += ' is:issue';
    } else {
      query += ' is:pr';
    }

    core.debug(`Searching (${type}s)`);
    const results = (
      await this.client.rest.search.issuesAndPullRequests({
        q: query,
        sort: 'updated',
        order: 'desc',
        per_page: 50
      })
    ).data.items;

    // results may include locked issues
    return results.filter(issue => !issue.locked);
  }

  getFilterByDateQuery({type, qualifier = 'created'} = {}) {
    const beforeDate = this.config[`exclude-${type}-${qualifier}-before`];
    const afterDate = this.config[`exclude-${type}-${qualifier}-after`];
    const betweenDates = this.config[`exclude-${type}-${qualifier}-between`];

    if (betweenDates) {
      return `-${qualifier}:${betweenDates
        .map(date => this.getISOTimestamp(date))
        .join('..')}`;
    } else if (beforeDate && afterDate) {
      return `${qualifier}:${this.getISOTimestamp(
        beforeDate
      )}..${this.getISOTimestamp(afterDate)}`;
    } else if (beforeDate) {
      return `${qualifier}:>${this.getISOTimestamp(beforeDate)}`;
    } else if (afterDate) {
      return `${qualifier}:<${this.getISOTimestamp(afterDate)}`;
    }
  }

  getUpdatedTimestamp(days) {
    const ttl = days * 24 * 60 * 60 * 1000;
    const date = new Date(new Date() - ttl);
    return this.getISOTimestamp(date);
  }

  getISOTimestamp(date) {
    return date.toISOString().split('.')[0] + 'Z';
  }
}

function getConfig() {
  const input = Object.fromEntries(
    Object.keys(schema.describe().keys).map(item => [item, core.getInput(item)])
  );

  const {error, value} = schema.validate(input, {abortEarly: false});
  if (error) {
    throw error;
  }

  return value;
}

run();
