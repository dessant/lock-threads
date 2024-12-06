import core from '@actions/core';
import github from '@actions/github';
import {retry} from '@octokit/plugin-retry';
import {throttling} from '@octokit/plugin-throttling';

import {schema} from './schema.js';

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

function getClient(token) {
  const requestRetries = 30;

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

export {getConfig, getClient};
