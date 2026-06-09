const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crée le dossier s’il n’existe pas
const uploadDir = path.join(process.cwd(), 'imageUploads/');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuration multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// Utilisation de module.exports pour exposer le middleware
const upload = multer({ storage });

module.exports = upload; // Exporter directement l'objet `upload`
