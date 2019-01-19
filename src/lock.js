module.exports = class Lock {
  constructor(context, config, logger) {
    this.context = context;
    this.config = config;
    this.log = logger;
  }

  async lockThreads() {
    const {only: type} = this.config;
    if (type) {
      await this.lock(type);
    } else {
      await this.lock('issues');
      await this.lock('pulls');
    }
  }

  async lock(type) {
    const repo = this.context.repo();
    const lockLabel = this.getConfigValue(type, 'lockLabel');
    const lockComment = this.getConfigValue(type, 'lockComment');
    const setLockReason = this.getConfigValue(type, 'setLockReason');

    const results = await this.search(type);
    for (const result of results) {
      const issue = {...repo, number: result.number};

      if (lockComment) {
        this.log.info({issue}, 'Commenting');
        await this.context.github.issues.createComment({
          ...issue,
          body: lockComment
        });
      }

      if (lockLabel) {
        this.log.info({issue}, 'Labeling');
        await this.context.github.issues.addLabels({
          ...issue,
          labels: [lockLabel]
        });
      }

      this.log.info({issue}, 'Locking');
      let params;
      if (setLockReason) {
        params = {
          ...issue,
          lock_reason: 'resolved',
          headers: {
            accept: 'application/vnd.github.sailor-v-preview+json'
          }
        };
      } else {
        params = issue;
      }
      await this.context.github.issues.lock(params);
    }
  }

  async search(type) {
    const {owner, repo} = this.context.repo();
    const daysUntilLock = this.getConfigValue(type, 'daysUntilLock');
    const exemptLabels = this.getConfigValue(type, 'exemptLabels');
    const skipCreatedBefore = this.getConfigValue(type, 'skipCreatedBefore');

    const timestamp = this.getUpdatedTimestamp(daysUntilLock);

    let query = `repo:${owner}/${repo} updated:<${timestamp} is:closed is:unlocked`;

    if (exemptLabels.length) {
      const queryPart = exemptLabels
        .map(label => `-label:"${label}"`)
        .join(' ');
      query += ` ${queryPart}`;
    }

    if (skipCreatedBefore) {
      query += ` created:>${this.getISOTimestamp(skipCreatedBefore)}`;
    }

    if (type === 'issues') {
      query += ' is:issue';
    } else {
      query += ' is:pr';
    }

    this.log.info({repo: {owner, repo}}, `Searching ${type}`);
    const results = (await this.context.github.search.issues({
      q: query,
      sort: 'updated',
      order: 'desc',
      per_page: 30
    })).data.items;

    // `is:unlocked` search qualifier is undocumented, skip locked issues
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

  getConfigValue(type, key) {
    if (this.config[type] && typeof this.config[type][key] !== 'undefined') {
      return this.config[type][key];
    }
    return this.config[key];
  }
};
