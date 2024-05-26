const fs = require('fs');
const csv = require('csv-parser');

// Define the CSV file path using an environment variable or a default path
const csvFilePath = process.env.CSV_FILE_PATH || '/default/path/to/your/csv/file.csv';

// Check if the file exists
fs.access(csvFilePath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error('File does not exist');
    return;
  }

  // File exists, start reading and parsing
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      // Process each row of the CSV file
      console.log(row);
      // Here you can perform actions with each row, like saving to a database, etc.
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    })
    .on('error', (err) => {
      console.error('Error occurred while processing CSV:', err);
    });
});
