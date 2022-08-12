const find = require('./find');
const clutch = require('./clutch');

module.exports.register = (app) => {
  app.command('/find', find);
  app.command('/tclutch', clutch);
};
