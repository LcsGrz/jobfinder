const { getJobsList, config } = require('indeed-job-scraper');

config['max-pages'] = 1; // this is a multiplier of the 'maxPerPage'

module.exports.run = async (queries) => {
  const start = Date.now();

  try {
    const data = (
      await Promise.all(
        queries.map(async (query) => {
          const searchData = await getJobsList({
            queryAll: query,
            hireType: 'directhire',
            location: 'remote',
            sort: 'date',
            fromDays: 15,
            duplicated: 'unique',
            maxPerPage: 20, // Total amount will be 'maxPerPage x max-pages' from config
          });

          return searchData.map((job) => ({
            title: job['job-title'],
            company: job['job-title'],
            place: '-',
            description: job['job-snippet'],
            date: job['post-date'],
            link: job['job-link'],
            query,
          }));
        }),
      )
    ).flat();

    const end = Date.now();

    return {
      source: 'INDEED',
      data,
      total: data.length,
      runTime: end - start,
    };
  } catch (error) {
    const end = Date.now();

    return {
      source: 'INDEED',
      error,
      data: [],
      total: 0,
      runTime: end - start,
    };
  }
};
