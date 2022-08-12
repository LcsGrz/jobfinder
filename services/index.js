// Services
const google = require('./google');
// Scrapers
const linkedinScrapper = require('./scraper/linkedin');
const indeedScrapper = require('./scraper/indeed');
const clutchScrapper = require('./scraper/clutch');

module.exports = {
  google,
  linkedinScrapper,
  indeedScrapper,
  clutchScrapper,
};
