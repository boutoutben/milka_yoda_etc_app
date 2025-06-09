const multer = require("multer");
const path = require("path");

// __filename et __dirname sont directement disponibles en CommonJS
// donc pas besoin de fileURLToPath ou import.meta.url

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // dossier de destination
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  }),
});

module.exports = upload;