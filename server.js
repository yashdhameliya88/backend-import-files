const express = require('express');
const cors = require('cors');
const path = require('path'); // Include the 'path' module for file path manipulation

const app = express();
const PORT = 3001;
const CSV_DIRECTORY = 'E:/MyData/A/';

app.use(cors());
app.use(express.json());
app.use('/csv-files', express.static(CSV_DIRECTORY));

// Middleware to log when a CSV file is successfully retrieved
app.use('/csv-files', (req, res, next) => {
  console.log(`CSV file "${req.path}" was successfully retrieved.`);
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
