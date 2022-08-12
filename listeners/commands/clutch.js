const { clutchScrapper } = require('../../services');
const { msToSeconds } = require('../../utils');

const GSHEET_URL = `https://docs.google.com/spreadsheets/d/${process.env.G_SHEET_ID}`;

const SHEETS_ID = {
  CLUTCH: `${GSHEET_URL}#gid=0`,
};

module.exports = async ({ command: { text: clutchURL }, ack, respond }) => {
  try {
    if (!clutchURL) {
      console.log('No input');
      // Incorrect recognition command request
      ack({
        response_type: 'ephemeral',
        text: `El comando no puede funcionar sin keywords.`,
      });
    } else {
      // Correct recognition command request
      ack();

      await respond(`Empezare con la busqueda, los publicare en el chat...`);

      const data = await clutchScrapper.run(clutchURL);
      const searchTime = new Date().toLocaleString();

      await respond({
        response_type: 'in_channel',
        text: `Se buscaron las siguientes empresas: `,
      });

      // ACA SE GUARDA
      /* await respond({
        response_type: 'in_channel',
        text: `La tarea se completo en ${msToSeconds(totalRunTime)}s con ${totalResults} resultados`,
      }); */
    }
  } catch (error) {
    respond({
      response_type: 'in_channel',
      text: `🏴‍☠️ A ocurrido un error, porfavor intentelo de nuevo. ( ${error.message || 'desconocido'} )`,
    });
  }
};
