const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Init upload
const upload = multer({ storage: storage });

// POST /upload - upload a file
router.post('/', upload.single('file'), uploadController.uploadFile);

// GET /upload - list uploaded files
router.get('/', uploadController.listFiles);

module.exports = router;
