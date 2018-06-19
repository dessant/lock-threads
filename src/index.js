const uuidV4 = require('uuid/v4');
const createScheduler = require('probot-scheduler');

const App = require('./lock');
const schema = require('./schema');

module.exports = robot => {
  scheduler = createScheduler(robot);

  robot.on('schedule.repository', async context => {
    const logger = robot.log.child({task: uuidV4()});
    const app = await getApp(context, logger);
    if (app) {
      await app.lockThreads();
    }
  });

  async function getApp(context, logger = robot.log) {
    const config = await getConfig(context, logger);
    if (config && config.perform) {
      return new App(context, config, logger);
    }
  }

  async function getConfig(context, logger) {
    let config;
    const configFile = 'lock.yml';
    const repo = context.repo();
    try {
      const repoConfig = await context.config(configFile);
      if (!repoConfig) {
        logger.warn({repo, configFile}, 'Missing config');
        repoConfig = {perform: false};
      }
      const {error, value} = schema.validate(repoConfig);
      if (error) {
        throw error;
      }
      config = value;
    } catch (err) {
      logger.warn({err: new Error(err), repo, configFile}, 'Invalid config');
    }

    return config;
  }
};
