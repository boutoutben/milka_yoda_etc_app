const multer = require('multer');
const path = require('path');

const destination = (req, file, cb) => {
  cb(null, 'uploads/');
};

const filename = (req, file, cb) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
};

const storage = multer.diskStorage({ destination, filename });

const upload = multer({ storage });

module.exports = { upload, storage, destination, filename };