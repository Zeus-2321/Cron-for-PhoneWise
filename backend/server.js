const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const Attendance = require('./db');
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(fileUpload());
app.use(cors());

app.post('/api/upload', (req, res) => {
  if (!req.files || !req.files.attendanceFile) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { attendanceFile } = req.files;

  if (attendanceFile.mimetype !== 'text/plain') {
    return res.status(400).json({ error: 'Invalid file format' });
  }

  fs.readFile(attendanceFile.tempFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading file', err);
      return res.status(500).json({ error: 'Error reading file' });
    }

    const lines = data.split('\n');

    const attendanceData = lines.map((line) => line.trim().split(','));

    const attendanceRecords = attendanceData.map(([timestamp, studentId]) => ({
      timestamp,
      studentId,
    }));

    Attendance.insertMany(attendanceRecords)
      .then(() => {
        res.json({ message: 'Attendance data saved successfully' });
      })
      .catch((err) => {
        console.error('Error saving attendance data', err);
        res.status(500).json({ error: 'Error saving attendance data' });
      });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
