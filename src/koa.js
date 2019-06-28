const config = require('../config.json');
const Koa = require('koa');
const kStatic = require('koa-static');
const bodyParser = require('koa-body');
const path = require('path');
const routes = require('./routes');

const staticPath = path.join(__dirname, './app');

const app = new Koa();
app.use(kStatic(staticPath));
app.use(bodyParser());
routes(app);

module.exports.start = function() {
  app.listen(config.app.port);
  console.log('Server started, listening on port: ' + config.app.port);
};
