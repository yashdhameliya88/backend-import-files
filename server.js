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
  const csvData = [];

  fs.readdir(CSV_DIRECTORY, (err, files) => {
    if (err) {
      return res.status(500).send({ error: 'Error reading directory' });
    }

    files.forEach((file) => {
      if (file.endsWith('.csv')) {
        const filePath = CSV_DIRECTORY + file;
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const parsedData = Papa.parse(fileContent, { header: true }).data;
        csvData.push(...parsedData);
      }
    });

    res.json(csvData);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
