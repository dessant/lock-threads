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
    const threadTypes = type ? [type] : ['issue', 'pr'];

    for (const item of threadTypes) {
      const threads = await this.lock(item);
      core.debug(`Setting output (${item}s)`);
      core.setOutput(`${item}s`, threads.length ? JSON.stringify(threads) : '');
    }
  }

  async lock(type) {
    const repo = github.context.repo;
    const lockLabels = this.config[`${type}-lock-labels`];
    const lockComment = this.config[`${type}-lock-comment`];
    const lockReason = this.config[`${type}-lock-reason`];

    const threads = [];

    const results = await this.search(type);
    for (const result of results) {
      const issue = {...repo, issue_number: result.number};

      if (lockComment) {
        core.debug(`Commenting (${type}: ${issue.issue_number})`);
        await this.client.issues.createComment({
          ...issue,
          body: lockComment
        });
      }

      if (lockLabels) {
        core.debug(`Labeling (${type}: ${issue.issue_number})`);
        await this.client.issues.addLabels({
          ...issue,
          labels: lockLabels
        });
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
      await this.client.issues.lock(params);

      threads.push(issue);
    }

    return threads;
  }

  async search(type) {
    const {owner, repo} = github.context.repo;
    const timestamp = this.getUpdatedTimestamp(
      this.config[`${type}-lock-inactive-days`]
    );
    let query = `repo:${owner}/${repo} updated:<${timestamp} is:closed is:unlocked`;

    const excludeLabels = this.config[`${type}-exclude-labels`];
    if (excludeLabels) {
      const queryPart = excludeLabels
        .map(label => `-label:"${label}"`)
        .join(' ');
      query += ` ${queryPart}`;
    }

    const excludeCreatedBefore = this.config[`${type}-exclude-created-before`];
    if (excludeCreatedBefore) {
      query += ` created:>${this.getISOTimestamp(excludeCreatedBefore)}`;
    }

    if (type === 'issue') {
      query += ' is:issue';
    } else {
      query += ' is:pr';
    }

    core.debug(`Searching (${type}s)`);
    const results = (
      await this.client.search.issuesAndPullRequests({
        q: query,
        sort: 'updated',
        order: 'desc',
        per_page: 50
      })
    ).data.items;

    // results may include locked issues
    return results.filter(issue => !issue.locked);
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
