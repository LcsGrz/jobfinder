const commands = require("./commands");
const events = require("./events");

module.exports.registerListeners = (app) => {
  events.register(app);
  commands.register(app);
};
