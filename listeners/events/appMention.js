module.exports = async ({ event, say }) => {
  if (event.user) {
    await say(
      `<@${event.user}> escribi el comando /find seguido de las keywords conectadas por 'and' y/o 'or' para usarme.`,
    );

    if (Math.floor(Math.random() * 100) <= 15) {
      await say('Se que solo soy una herramienta, pero soy la herramienta mas feliz del mundo 💖');
    }
  } else {
    await say('Error, no se encuentra autenticado.');
  }
};
