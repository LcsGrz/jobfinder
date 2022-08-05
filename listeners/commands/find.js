const { google, linkedinScraper } = require('../../services');

const GSHEET = `https://docs.google.com/spreadsheets/d/${process.env.G_SHEET_ID}`;

// prettier-ignore
const formatToWrite = (text) => `[ ${text.map(x => Array.isArray(x) ? `[ ${x.join(", ")} ]` : x).join(", ")} ]`
const reformatQueries = (parsedArray) => {
  // [1,2,[3,4],5,[6,7]] => [1,2,3,5,6], [1,2,4,5,6] , [1,2,3,5,7], [1,2,4,5,7]
  // new array ex = [1,2,,5,,] (in between "," fill with "or" samples)
  // OrsArray = [,,[3,4],[6,7]]
  // query= [1,2,[OrsArray[thisArrayIndex(2)][i]]],5,[OrsArray[thisArrayIndex(6)][i]]]]
};

module.exports = async ({ command: { text, user_name, user_id }, ack, respond }) => {
  let tmp = 0;
  if (!text)
    // Incorrect recognition command request
    return ack({
      response_type: 'ephemeral',
      text: `<@${user_id}> El comando no puede funcionar sin keywords.`,
    });

  // Correct recognition command request
  ack();

  await respond(`<@${user_id}> empezare con la busqueda, los publicare en el chat...`);

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
      tmp = +1;
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
        text: `✅ Linkedin: se encontraron ${tmp} resultados`,
      });

      await respond({
        response_type: 'in_channel',
        text: `Verifique los resultados desde este enlace: ${GSHEET}`,
      });
    },
    onInvalidSession: async () => {
      await respond({
        response_type: 'in_channel',
        text: `Sesion Invalida, porfavor intentelo de nuevo en unos minutos.`,
      });
    },
  });
};
