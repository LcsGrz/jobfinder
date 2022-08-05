const { google, linkedinScraper } = require('../../services');
const { getKeywords, combine } = require('../../utils');

const GSHEET = `https://docs.google.com/spreadsheets/d/${process.env.G_SHEET_ID}`;

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

    const start = Date.now();
    let totalJobs = 0;
    let queries = [];

    await respond(`<@${user_id}> empezare con la busqueda, los publicare en el chat...`);

    const keywords = getKeywords(text);
    const filteredOrs = keywords.filter(Array.isArray);

    if (filteredOrs.length) {
      const combinedResults = combine(filteredOrs);

      queries = combinedResults.map((cr) => {
        const splitedCR = cr.split('-');
        let cont = 0;

        return keywords.reduce((acc = '', x = '') => {
          if (!Array.isArray(x)) return `${acc} ${x}`;
          return `${acc} ${splitedCR[cont++]}`;
        }, []);
      });
    } else {
      queries = [keywords.join(' ')];
    }

    linkedinScraper.run(queries, {
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
          const end = Date.now();
          await respond({
            response_type: 'in_channel',
            text: `✅ Linkedin: se encontraron ${totalJobs} resultados en ${Math.floor((end - start / 1000) % 60)}s`,
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
