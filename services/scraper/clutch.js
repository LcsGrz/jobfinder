module.exports.run = async (url) => {
  const start = Date.now();

  try {
    const data = await fetch(process.env.CLUTCH_SCRAPER_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({ url_to_scrap: url }),
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
