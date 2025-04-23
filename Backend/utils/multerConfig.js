import multer from 'multer';
import path from 'path';

// Set up storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Specify the folder to store uploaded files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`); // Unique file name
    },
});

// Set up file filter to accept images only
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and JPG files are allowed.'));
    }
};

// Multer middleware
const upload = multer({
    storage: storage,
    limits: {fileSize: 2 * 1024 * 1024}, // Limit file size to 2MB
    fileFilter: fileFilter,
});

export default upload;
