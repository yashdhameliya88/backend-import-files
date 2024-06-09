const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const chokidar = require('chokidar');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Add this line to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Add this line to parse URL-encoded bodies

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/dbcsv', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Define a Mongoose schema based on the provided fields
const csvSchema = new mongoose.Schema({
  No: { type: String, required: false },
  R_Ct: { type: String, required: false },
  T_Po_Ct: { type: String, required: false },
  T_Po_Percent: { type: String, required: false },
  R_P_Ct: { type: String, required: false },
  P_Po_Ct: { type: String, required: false },
  Dia: { type: String, required: false },
  Shape: { type: String, required: false },
  Co: { type: String, required: false },
  Clarity: { type: String, required: false }
});

const CsvModel = mongoose.model('CsvModel', csvSchema);

// Endpoint to receive the directory path
app.post('/set-directory', async (req, res) => {
  const dirPath = req.body.path;
  
  if (!dirPath || !fs.existsSync(dirPath)) {
    return res.status(400).json({ error: 'Invalid directory path' });
  }

  // Get list of all CSV files in the directory
  const csvFiles = fs.readdirSync(dirPath).filter(file => path.extname(file) === '.csv');

  // Process each CSV file
  for (const file of csvFiles) {
    const filePath = path.join(dirPath, file);
    await processCsvFile(filePath);
  }

  res.json({ message: 'Directory set and CSV files processed' });
});

const processCsvFile = async (filePath) => {
  const dataRows = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      // Remove "%" sign from "T. Po. %" field
      if (row['T. Po. %']) {
        row['T. Po. %'] = row['T. Po. %'].replace('%', '');
      }
      
      // Create a new object with formatted keys
      const formattedRow = {
        No: row['No.'] || '',
        R_Ct: row['R. Ct.'] || '',
        T_Po_Ct: row['T. Po. Ct.'] || '',
        T_Po_Percent: row['T. Po. %'] || '',
        R_P_Ct: row['R. P. Ct.'] || '',
        P_Po_Ct: row['P. Po. Ct.'] || '',
        Dia: row['Dia.'] || '',
        Shape: row['Shape'] || '',
        Co: row['Co.'] || '',
        Clarity: row['Clarity'] || ''
      };

      // Add only non-blank rows
      if (Object.values(formattedRow).some(value => value !== '')) {
        dataRows.push(formattedRow);
      }
    })
    .on('end', async () => {
      try {
        // Check if any data from the CSV file already exists in the database
        const existingData = await CsvModel.find({ No: dataRows[0].No });

        if (existingData.length === 0) {
          // Insert new document
          const newDocument = new CsvModel(dataRows[0]);
          await newDocument.save();
          console.log('New data successfully inserted:', dataRows[0]);
        }
      } catch (err) {
        console.error('Error processing CSV file:', err);
      }
    });
};

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
