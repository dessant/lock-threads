module.exports = class Lock {
  constructor(context, config, logger) {
    this.context = context;
    this.config = config;
    this.logger = logger;
  }

  async lock(type) {
    const {owner, repo} = this.context.repo();
    const lockLabel = this.getConfigValue(type, 'lockLabel');
    const lockComment = this.getConfigValue(type, 'lockComment');

    const issues = await this.getLockableIssues(type);
    for (const issue of issues) {
      const issueUrl = `${owner}/${repo}/issues/${issue.number}`;
      if (lockComment) {
        this.logger.info(`[${issueUrl}] Commenting`);
        await this.context.github.issues.createComment({
          owner,
          repo,
          number: issue.number,
          body: lockComment
        });
      }

      if (lockLabel) {
        this.logger.info(`[${issueUrl}] Labeling`);
        await this.context.github.issues.addLabels({
          owner,
          repo,
          number: issue.number,
          labels: [lockLabel]
        });
      }

      this.logger.info(`[${issueUrl}] Locking`);
      await this.context.github.issues.lock({
        owner,
        repo,
        number: issue.number,
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

    this.logger.info(`[${owner}/${repo}] Searching ${type}`);
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
