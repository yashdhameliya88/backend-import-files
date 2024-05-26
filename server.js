const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;
const CSV_DIRECTORY = 'E:/MyData/A/';

app.use(cors());
app.use(express.json());
app.use('/csv-files', express.static(CSV_DIRECTORY));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
