import {getInput, info} from '@actions/core';
import {getOctokit} from '@actions/github';
import {retry} from '@octokit/plugin-retry';
import {throttling} from '@octokit/plugin-throttling';

import {schema} from './schema.js';

function getConfig() {
  const input = Object.fromEntries(
    Object.keys(schema.describe().keys).map(item => [item, getInput(item)])
  );

  const {error, value} = schema.validate(input, {abortEarly: false});
  if (error) {
    throw error;
  }

  return value;
}

function getClient(token) {
  const requestRetries = 3;

  const rateLimitCallback = function (
    retryAfter,
    options,
    octokit,
    retryCount
  ) {
    info(
      `Request quota exhausted for request ${options.method} ${options.url}`
    );

    if (retryCount < requestRetries) {
      info(`Retrying after ${retryAfter} seconds`);

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

  const octokit = getOctokit(token, options, retry, throttling);

  octokit.request = octokit.request.defaults({
    headers: {'X-GitHub-Api-Version': '2026-03-10'}
  });

  return octokit;
}

export {getConfig, getClient};
