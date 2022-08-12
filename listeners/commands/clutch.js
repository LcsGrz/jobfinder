const { google, linkedinScrapper, indeedScrapper } = require('../../services');
const { getQueries, msToSeconds } = require('../../utils');

const GSHEET_URL = `https://docs.google.com/spreadsheets/d/${process.env.G_SHEET_ID}`;

const SHEETS_ID = {
  CLUTCH: `${GSHEET_URL}#gid=0`,
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

      // ACA SE GUARDA

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
