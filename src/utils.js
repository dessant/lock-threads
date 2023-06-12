const core = require('@actions/core');
const github = require('@actions/github');
const {retry} = require('@octokit/plugin-retry');
const {throttling} = require('@octokit/plugin-throttling');

function getClient(token) {
  const rateLimitRetries = 3;

  const rateLimitCallback = function (
    retryAfter,
    options,
    octokit,
    retryCount
  ) {
    core.info(
      `Request quota exhausted for request ${options.method} ${options.url}`
    );

    if (retryCount < rateLimitRetries) {
      core.info(`Retrying after ${retryAfter} seconds`);

      return true;
    }
  };

  const options = {
    throttle: {
      onSecondaryRateLimit: rateLimitCallback,
      onRateLimit: rateLimitCallback
    }
  };

  return github.getOctokit(token, options, retry, throttling);
}

module.exports = {getClient};
