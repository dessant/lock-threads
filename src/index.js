const uuidV4 = require('uuid/v4');
const createScheduler = require('probot-scheduler');
const getMergedConfig = require('probot-config');

const App = require('./lock');
const schema = require('./schema');

module.exports = async robot => {
  const github = await robot.auth();
  const appName = (await github.apps.get({})).data.name;
  const scheduler = createScheduler(robot);

  robot.on('schedule.repository', async context => {
    const app = await getApp(context);
    if (app) {
      await app.lockThreads();
    }
  });

  async function getApp(context) {
    const logger = context.log.child({appName, session: uuidV4()});
    const config = await getConfig(context, logger);
    if (config && config.perform) {
      return new App(context, config, logger);
    }
  }

  async function getConfig(context, log, file = 'lock.yml') {
    let config;
    const repo = context.repo();
    try {
      let repoConfig = await getMergedConfig(context, file);
      if (!repoConfig) {
        log.warn({repo, file}, 'Missing config');
        repoConfig = {perform: false};
      }
      const {error, value} = schema.validate(repoConfig);
      if (error) {
        throw error;
      }
      config = value;
    } catch (err) {
      log.warn({err: new Error(err), repo, file}, 'Invalid config');
    }

    return config;
  }
};
