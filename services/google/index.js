const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: 'services/google/gkey.json',
  // Url to spreadsheets API
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

module.exports.writeFile = async ({
  username,
  query,
  link,
  title,
  company,
  description,
  date,
}) => {
  const authClientObject = await auth.getClient();

  const googleSheetsInstance = google.sheets({
    version: 'v4',
    auth: authClientObject,
  });

  // Get metadata about spreadsheet
  /*
  const sheetInfo = await googleSheetsInstance.spreadsheets.get({
    auth,
    spreadsheetId,
  });
  */

  //Read from the spreadsheet
  /*
  const readData = await googleSheetsInstance.spreadsheets.values.get({
    auth, 
    spreadsheetId, 
    range: "Sheet1!A:A", //range of cells to read from.
  });
  */

  // Write data into the google sheets
  await googleSheetsInstance.spreadsheets.values.append({
    auth,
    spreadsheetId: process.env.G_SHEET_ID,
    range: 'Sheet1!A:H', //sheet name and range of cells
    valueInputOption: 'USER_ENTERED', // The information will be passed according to what the usere passes in as date, number or text
    resource: {
      values: [
        [
          new Date().toLocaleDateString(),
          username,
          query,
          company,
          title,
          description.replace('Show more','…'),
          date,
          link,
        ],
      ],
    },
  });
};
