const { LinkedinScraper, relevanceFilter, remoteFilter, events } = require('linkedin-jobs-scraper');

const scraper = new LinkedinScraper({
  headless: true,
  slowMo: 1000,
});

module.exports.run = async (queries, { onEnd, onData, onInvalidSession }) => {
  // Add listeners for scraper events
  scraper.on(events.scraper.end, onEnd);

  scraper.on(events.scraper.data, onData);

  scraper.on(events.scraper.invalidSession, onInvalidSession);

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
};
