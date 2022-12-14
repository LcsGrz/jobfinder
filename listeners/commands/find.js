const { google, linkedinScrapper, indeedScrapper } = require('../../services');
const { getQueries, msToSeconds } = require('../../utils');

const GSHEET_URL = `https://docs.google.com/spreadsheets/d/${process.env.G_SHEET_ID}`;

const SHEETS_ID = {
  LINKEDIN: `${GSHEET_URL}#gid=0`,
  INDEED: `${GSHEET_URL}#gid=1759432713`,
};

module.exports = async ({ command: { text, user_name }, ack, respond }) => {
  try {
    if (!text) {
      // Incorrect recognition command request
      ack({
        response_type: 'ephemeral',
        text: `El comando no puede funcionar sin keywords.`,
      });
    } else {
      // Correct recognition command request
      ack();

      await respond(`Empezare con la busqueda, los publicare en el chat...`);

      const queries = getQueries(text);
      const scrappersData = await Promise.all([linkedinScrapper.run(queries), indeedScrapper.run(queries)]);
      const searchTime = new Date().toLocaleString();

      await respond({
        response_type: 'in_channel',
        text: `Se buscaron puestos de trabajo con el siguiente predicado '${text}'`,
      });

      scrappersData.forEach(({ source, data, total, runTime, error }) => {
        try {
          if (error) {
            respond({
              response_type: 'in_channel',
              text: `🚫 ${source}: A ocurrido un error, porfavor intentelo de nuevo. ( ${error} )`,
            });
          } else if (total) {
            google.writeFile({ source, username: user_name, data, searchTime });

            respond({
              response_type: 'in_channel',
              text:
                `✅ ${source}: se encontraron ${total} resultados en ${msToSeconds(runTime)}s. ` +
                `<${SHEETS_ID[source]}|Click para ver>`,
            });
          } else {
            respond({
              response_type: 'in_channel',
              text: `🚫 ${source}: no se encontraron resultados, intente con otras palabras claves.`,
            });
          }
        } catch (e) {
          respond({
            response_type: 'in_channel',
            text: `🚫 ${source}: A ocurrido un error, porfavor intentelo de nuevo. ( ${e.message || 'desconocido'} )`,
          });
        }
      });

      const totalRunTime = scrappersData.reduce((acc, cur) => acc + cur.runTime, 0);
      const totalResults = scrappersData.reduce((acc, cur) => acc + cur.total, 0);

      await respond({
        response_type: 'in_channel',
        text: `La tarea se completo en ${msToSeconds(totalRunTime)}s con ${totalResults} resultados`,
      });
    }
  } catch (error) {
    respond({
      response_type: 'in_channel',
      text: `🏴‍☠️ A ocurrido un error, porfavor intentelo de nuevo. ( ${error.message || 'desconocido'} )`,
    });
  }
};
