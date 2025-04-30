const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');

const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(201).json({ message: 'File uploaded successfully', filename: req.file.filename });
};

const listFiles = (req, res) => {
  if (!fs.existsSync(uploadDir)) {
    return res.json([]);
  }
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to list files' });
    }
    res.json(files);
  });
};

module.exports = {
  uploadFile,
  listFiles,
};
