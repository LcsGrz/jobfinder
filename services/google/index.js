const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: 'services/google/gkey.json',
  // Url to spreadsheets API
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

module.exports.writeFile = async ({ source, username, data, searchTime }) => {
  const authClientObject = await auth.getClient();

  const googleSheetsInstance = google.sheets({
    version: 'v4',
    auth: authClientObject,
  });

  // Write data into the google sheets
  googleSheetsInstance.spreadsheets.values.append({
    auth,
    spreadsheetId: process.env.G_SHEET_ID,
    range: `${source}!A:I`, // sheet name and range of cells
    valueInputOption: 'USER_ENTERED', // The information will be passed according to what the usere passes in as date, number or text
    resource: {
      values: data.map(({ query, link, title, company, place, description, date }) => [
        searchTime,
        username,
        query,
        title,
        company,
        place,
        description,
        date,
        `=HYPERLINK(${link}, NAVEGAR)`,
      ]),
    },
  });
};
