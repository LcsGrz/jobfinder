const fetch = require('node-fetch');

module.exports.run = async (url) => {
  const formData = new URLSearchParams({
    url_to_scrap: url,
  });
  const start = Date.now();
  try {
    const data = await fetch(process.env.CLUTCH_SCRAPER_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: '*/*',
      },
      body: formData,
    });

    console.log('\n\n', '# data', data, '\n\n');

    const end = Date.now();

    return {
      source: 'CLUTCH',
      data,
      total: data.length,
      runTime: end - start,
    };
  } catch (error) {
    const end = Date.now();

    return {
      source: 'CLUTCH',
      error: error.message || 'desconocido',
      data: [],
      total: 0,
      runTime: end - start,
    };
  }
};
