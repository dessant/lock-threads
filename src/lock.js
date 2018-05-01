const defaults = require('./defaults');

module.exports = class Lock {
  constructor(context, config, logger) {
    this.context = context;
    this.config = Object.assign({}, defaults, config);
    this.logger = logger;
  }

  async lock() {
    const {owner, repo} = this.context.repo();
    const {lockComment, lockLabel} = this.config;

    const issues = await this.getLockableIssues();
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

  async getLockableIssues() {
    const results = await this.search();
    return results.data.items.filter(issue => !issue.locked);
  }

  search() {
    const {owner, repo} = this.context.repo();
    const {exemptLabels, daysUntilLock, only} = this.config;
    const timestamp = this.since(daysUntilLock)
      .toISOString()
      .replace(/\.\d{3}\w$/, '');

    let query = `repo:${owner}/${repo} is:closed updated:<${timestamp}`;
    if (exemptLabels.length) {
      const queryPart = exemptLabels
        .map(label => `-label:"${label}"`)
        .join(' ');
      query += ` ${queryPart}`;
    }
    if (only === 'issues') {
      query += ' is:issue';
    } else if (only === 'pulls') {
      query += ' is:pr';
    }

    this.logger.info(`[${owner}/${repo}] Searching`);
    return this.context.github.search.issues({
      q: query,
      sort: 'updated',
      order: 'desc',
      per_page: 30
    });
  }

  since(days) {
    const ttl = days * 24 * 60 * 60 * 1000;
    return new Date(new Date() - ttl);
  }
};
