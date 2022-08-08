const { getJobsList, config } = require('indeed-job-scraper');

config['max-pages'] = 1; // this is a multiplier of the 'maxPerPage'

module.exports.run = (queries) => {
  return Promise.all(
    queries.map(async (query) => {
      const data = await getJobsList({
        queryAll: query,
        hireType: 'directhire',
        location: 'remote',
        sort: 'date',
        fromDays: 15,
        duplicated: 'unique',
        maxPerPage: 20, // the total amount will be 'maxPerPage x max-pages' from config
      });
      return {
        source: 'INDEED',
        data,
        total: data.length,
        runTime: 0,
      };
    }),
  );
};
