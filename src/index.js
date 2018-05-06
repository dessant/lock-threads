const createScheduler = require('probot-scheduler');

const App = require('./lock');
const schema = require('./schema');

module.exports = robot => {
  scheduler = createScheduler(robot);

  robot.on('schedule.repository', async context => {
    const app = await getApp(context);
    if (app) {
      const {only: type} = app.config;
      if (type) {
        await app.lock(type);
      } else {
        await app.lock('issues');
        await app.lock('pulls');
      }
    }
  });

  async function getApp(context) {
    const config = await getConfig(context);
    if (config) {
      return new App(context, config, robot.log);
    }
  }

  async function getConfig(context) {
    const {owner, repo} = context.issue();
    let config;
    try {
      const repoConfig = await context.config('lock.yml');
      if (repoConfig) {
        const {error, value} = schema.validate(repoConfig);
        if (error) {
          throw error;
        }
        config = value;
      }
    } catch (err) {
      robot.log.warn({err: new Error(err), owner, repo}, 'Invalid config');
    }

    return config;
  }
};
