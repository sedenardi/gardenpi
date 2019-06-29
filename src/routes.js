const Router = require('@koa/router');
const io = require('./io');

module.exports = function(app) {
  const router = new Router();

  router.get('/pumps', async (ctx) => {
    ctx.body = io.getStatus();
  });

  router.use(async (ctx, next) => {
    const params = ctx.request.body;
    if (typeof params !== 'object' || !params.pumpName) {
      throw new Error('Must specify parameter "pumpName"');
    }
    ctx.state.pumpName = params.pumpName;
    await next();
  });

  router.post('/pump/on', async (ctx) => {
    io.turnOn(ctx.state.pumpName);
    ctx.body = {};
  });

  router.post('/pump/off', async (ctx) => {
    io.turnOff(ctx.state.pumpName);
    ctx.body = {};
  });
  
  app.use(router.routes());
};
