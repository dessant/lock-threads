const createScheduler = require('probot-scheduler');

const App = require('./lock');

module.exports = robot => {
  scheduler = createScheduler(robot);

  robot.on('schedule.repository', async context => {
    const app = await getApp(context);
    if (app) {
      await app.lock();
    }
  });

  async function getApp(context) {
    let config = await context.config('lock.yml');
    if (config) {
      return new App(context, config, robot.log);
    }
  }
};
