import core from '@actions/core';
import github from '@actions/github';
import {retry} from '@octokit/plugin-retry';
import {throttling} from '@octokit/plugin-throttling';

function getClient(token) {
  const requestRetries = 3;

  const rateLimitCallback = function (
    retryAfter,
    options,
    octokit,
    retryCount
  ) {
    core.info(
      `Request quota exhausted for request ${options.method} ${options.url}`
    );

    if (retryCount < requestRetries) {
      core.info(`Retrying after ${retryAfter} seconds`);

      return true;
    }
  };

  const options = {
    request: {retries: requestRetries},
    throttle: {
      onSecondaryRateLimit: rateLimitCallback,
      onRateLimit: rateLimitCallback
    }
  };

  return github.getOctokit(token, options, retry, throttling);
}

export {getClient};
