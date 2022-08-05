const {
  LinkedinScraper,
  relevanceFilter,
  typeFilter,
  remoteFilter,
  events,
} = require("linkedin-jobs-scraper");

const scraper = new LinkedinScraper({
  headless: true,
  slowMo: 300,
});

module.exports.run = async (
  queries,
  {  onEnd, onData, onInvalidSession }
) => {
  
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
      locations: ["United States"],
      limit: 1,
    }
  );

  // Close browser
  await scraper.close();
};