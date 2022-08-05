const { App } = require('@slack/bolt');
const { registerListeners } = require('./listeners');

// Create App instance
const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

// Register all listeners
registerListeners(app);

// Method to start the App
const startApp = async () => {
  try {
    await app.start(process.env.PORT);

    console.log('⚡️ The App is running ⚡️');
  } catch (error) {
    console.error('🔪 Unable to start App: ', error);
  }
};

// Run the app
startApp();
