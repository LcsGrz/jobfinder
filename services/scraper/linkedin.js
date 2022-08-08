const { LinkedinScraper, relevanceFilter, remoteFilter, events } = require('linkedin-jobs-scraper');

const scraper = new LinkedinScraper({
  headless: true,
  slowMo: 1000,
});

module.exports.run = async (queries) => {
   return new Promise( async (resolve) => {
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
  
    scraper.on(events.scraper.data, (d) => data.push(d));
  
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
  
    // Run the scraper
    await scraper.run(
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
    );
  
    // Close browser
    await scraper.close();

  })
  
};
