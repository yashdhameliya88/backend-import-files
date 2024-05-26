// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const Papa = require('papaparse');

const app = express();
const PORT = 3001;
let CSV_DIRECTORY = 'E:/MyData/';

app.use(cors());
app.use(express.json());

app.post('/set-directory', (req, res) => {
  const { directory } = req.body;
  CSV_DIRECTORY = directory;
  res.send('Directory set successfully');
  console.log(`Directory set successfully: ${CSV_DIRECTORY}`);
});

app.get('/get-directory', (req, res) => {
  res.json({ csvDirectory: CSV_DIRECTORY });
});

app.get('/csv-data/:id', (req, res) => {
  const id = req.params.id;
  const filePath = `${CSV_DIRECTORY}${id}.csv`;

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsedData = Papa.parse(fileContent, { header: true }).data;
    res.json({ fileName: id, data: parsedData });
  } catch (err) {
    console.error('Error reading or parsing file:', filePath, err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/csv-data', (req, res) => {
  console.log('Working 1')
  const csvFiles = [];
  console.log('Working 2')
  fs.readdir(CSV_DIRECTORY, (err, files) => {
    console.log('Working 3')
    if (err) {
      console.log('Workingerr', err)
      return res.status(500).send({ error: 'Error reading directory', err });
    }

    files.forEach((file) => {
      console.log('Working 4')
      const fileNameWithoutExtension = file.split('.').slice(0, -1).join('.');
      const fileNameLower = file.toLowerCase();
      if (fileNameLower.endsWith('.csv')) {
        console.log('Working 5')
        const filePath = CSV_DIRECTORY + file;
        try {
          console.log('Working 6')
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
