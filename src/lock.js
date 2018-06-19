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

    const results = await this.getLockableIssues(type);
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
      await this.context.github.issues.lock({
        ...issue,
        lock_reason: 'resolved',
        headers: {
          accept: 'application/vnd.github.sailor-v-preview+json'
        }
      });
    }
  }

  search(type) {
    const {owner, repo} = this.context.repo();
    const daysUntilLock = this.getConfigValue(type, 'daysUntilLock');
    const exemptLabels = this.getConfigValue(type, 'exemptLabels');

    const timestamp = this.getUpdatedTimestamp(daysUntilLock);

    let query = `repo:${owner}/${repo} is:closed updated:<${timestamp}`;
    if (exemptLabels.length) {
      const queryPart = exemptLabels
        .map(label => `-label:"${label}"`)
        .join(' ');
      query += ` ${queryPart}`;
    }
    if (type === 'issues') {
      query += ' is:issue';
    } else {
      query += ' is:pr';
    }

    this.log.info({repo: {owner, repo}}, `Searching ${type}`);
    return this.context.github.search.issues({
      q: query,
      sort: 'updated',
      order: 'desc',
      per_page: 30
    });
  }

  async getLockableIssues(type) {
    const results = await this.search(type);
    return results.data.items.filter(issue => !issue.locked);
  }

  getUpdatedTimestamp(days) {
    const ttl = days * 24 * 60 * 60 * 1000;
    const date = new Date(new Date() - ttl);
    return date.toISOString().replace(/\.\d{3}\w$/, '');
  }

  getConfigValue(type, key) {
    if (this.config[type] && typeof this.config[type][key] !== 'undefined') {
      return this.config[type][key];
    }
    return this.config[key];
  }
};
