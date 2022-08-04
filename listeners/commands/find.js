const { google, linkedinScraper } = require('../../services');

const GSHEET = `https://docs.google.com/spreadsheets/d/${process.env.G_SHEET_ID}`;

// prettier-ignore
const formatToWrite = (text) => `[ ${text.map(x => Array.isArray(x) ? `[ ${x.join(", ")} ]` : x).join(", ")} ]`

module.exports = async ({
  command: { text, user_name, user_id },
  ack,
  respond,
}) => {
  if (!text)
    // Incorrect recognition command request
    return ack({
      response_type: 'ephemeral',
      text: `<@${user_id}> El comando no puede funcionar sin keywords.`,
    });

  // Correct recognition command request
  ack();

  await respond(
    `<@${user_id}> empezare con la busqueda, los publicare en el chat...`,
  );

  const keywords = text
    .toLowerCase()
    .split(/\band\b/)
    .map((x) => {
      if (x.match(/\bor\b/)) {
        const or = x
          .split(/\bor\b/)
          .map((z) => z.trim())
          .filter(Boolean);

        if (or.length <= 1) return or.pop();

        return or;
      }

      return x.trim();
    })
    .filter(Boolean);

  linkedinScraper.run(['react nodejs', 'mongodb graphql'], {
    onData: async (data) => {
      console.log('\n\n', '# data', data, '\n\n');
      await google.writeFile({
        username: user_name,
        ...data,
      });
    },
    onEnd: async () => {
      await respond({
        response_type: 'in_channel',
        text: `Se buscaron puestos de trabajo con el siguiente predicado '${text}'`,
      });

      await respond({
        response_type: 'in_channel',
        text: `✅ Linkedin: se encontraron resultados`,
      });

      await respond({
        response_type: 'in_channel',
        text: `Verifique los resultados desde este enlace: ${GSHEET}`,
      });
    },
  });
};
