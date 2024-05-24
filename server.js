// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const Papa = require('papaparse');

const app = express();
const PORT = 3001;
const CSV_DIRECTORY = 'E:/MyData/';

// Enable CORS for all routes
app.use(cors());


app.get('/csv-data', (req, res) => {
  const csvFiles = [];

  fs.readdir(CSV_DIRECTORY, (err, files) => {
    if (err) {
      return res.status(500).send({ error: 'Error reading directory' });
    }

    files.forEach((file) => {
      const fileNameWithoutExtension = file.split('.').slice(0, -1).join('.'); // Remove extension
      const fileNameLower = file.toLowerCase();
      if (fileNameLower.endsWith('.csv')) {
        const filePath = CSV_DIRECTORY + file;
        try {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const parsedData = Papa.parse(fileContent, { header: true }).data;
          csvFiles.push({ fileName: fileNameWithoutExtension, data: parsedData });
        } catch (err) {
          console.error('Error reading or parsing file:', filePath, err);
        }
      }
    });

    res.json(csvFiles);
  });
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
