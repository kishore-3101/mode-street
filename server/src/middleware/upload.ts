import multer from 'multer';
const storage = multer.memoryStorage();
const fileFilter = (_req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed'));
    }
};
export const uploadImages = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
        files: 5, // up to 5 files
    },
    fileFilter,
});
