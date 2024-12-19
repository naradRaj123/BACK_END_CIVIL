const multer = require('multer');

// Define storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './user-img/'); // Directory to save the files
    },
    filename: (req, file, cb) => {
        const suffix = Date.now();
        cb(null, suffix + '-'+file.originalname);
    },
});



const singleUpload = multer({ storage});

module.exports = singleUpload;