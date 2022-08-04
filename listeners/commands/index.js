const find = require("./find");

module.exports.register = (app) => {
  app.command("/find", find);
};
