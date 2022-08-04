const appMention = require("./appMention");

module.exports.register = (app) => {
  app.event("app_mention", appMention);
};
