const { LinkedinScraper, relevanceFilter, remoteFilter, events } = require('linkedin-jobs-scraper');

const scraper = new LinkedinScraper({
  headless: true,
  slowMo: 1000,
});

module.exports.run = (queries) =>
  new Promise((resolve) => {
    const start = Date.now();
    const data = [];

    // Add listeners for scraper events
    scraper.on(events.scraper.end, () => {
      const end = Date.now();

      resolve({
        source: 'LINKEDIN',
        data,
        total: data.length,
        runTime: end - start,
      });
    });

    scraper.on(events.scraper.data, (job) =>
      data.push({ ...job, description: job.description.replace('Show more', '…') }),
    );

    scraper.on(events.scraper.invalidSession, () => {
      const end = Date.now();

      resolve({
        source: 'LINKEDIN',
        error: 'InvalidSession',
        data: [],
        total: 0,
        runTime: end - start,
      });
    });

    // Run the scraper and then close the browser
    scraper
      .run(
        // Run queries serially
        queries.map((q) => ({
          query: q,
          options: {
            filters: {
              relevance: relevanceFilter.RECENT,
              remote: remoteFilter.REMOTE,
            },
          },
        })),
        // Global options, will be merged individually with each query options
        {
          optimize: true,
          locations: ['United States'],
          limit: 20,
        },
      )
      .then(scraper.close);
  });
