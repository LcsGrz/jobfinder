const { google, linkedinScraper } = require('../../services');
const { getKeywords, formatToWrite } = require('../../utils');

const GSHEET = `https://docs.google.com/spreadsheets/d/${process.env.G_SHEET_ID}`;

const reformatQueries = (parsedArray) => {
  // [1,2,[3,4],5,[6,7]] => [1,2,3,5,6], [1,2,4,5,6] , [1,2,3,5,7], [1,2,4,5,7]
  // new array ex = [1,2,,5,,] (in between "," fill with "or" samples)
  // OrsArray = [,,[3,4],[6,7]]
  // query= [1,2,[OrsArray[thisArrayIndex(2)][i]]],5,[OrsArray[thisArrayIndex(6)][i]]]]
};

module.exports = async ({ command: { text, user_name, user_id }, ack, respond }) => {
  if (!text) {
    // Incorrect recognition command request
    ack({
      response_type: 'ephemeral',
      text: `<@${user_id}> El comando no puede funcionar sin keywords.`,
    });
  } else {
    // Correct recognition command request
    ack();

    let totalJobs = 0;

    await respond(`<@${user_id}> empezare con la busqueda, los publicare en el chat...`);

    linkedinScraper.run(['react nodejs', 'mongodb graphql'], {
      onData: async (data) => {
        totalJobs += 1;

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

        if (totalJobs) {
          await respond({
            response_type: 'in_channel',
            text: `✅ Linkedin: se encontraron ${totalJobs} resultados`,
          });

          await respond({
            response_type: 'in_channel',
            text: `Verifique los resultados desde este enlace: ${GSHEET}`,
          });
        } else {
          await respond({
            response_type: 'in_channel',
            text: `🚫 Linkedin: no se encontraron resultados`,
          });

          await respond({
            response_type: 'in_channel',
            text: `Intente con otras palabras claves`,
          });
        }
      },
      onInvalidSession: async () => {
        await respond({
          response_type: 'in_channel',
          text: `Sesion Invalida, porfavor intentelo de nuevo en unos minuto´s.`,
        });
      },
    });
  }
};
