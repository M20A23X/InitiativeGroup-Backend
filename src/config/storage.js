import path from 'path';
import multer from 'multer';
import { FileUploadError } from '#exceptions/FileUploadError.js';

const STORAGE_ROOT = path.join(process.cwd(), 'storage/');

export const UPLOADS = {};
export const UPLOAD_HANDLERS = {};

const DISK_STORAGE = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(STORAGE_ROOT, UPLOADS[req.body.event].path));
    },
    filename: (req, file, cb) => {
        const date = new Date().toISOString().replace(/:/g, '-');
        cb(null, `${date}-${file.originalname}`);
    }
});

const FILE_FILTER = (req, file, cb) => {
    if (!file) {
        cb(new FileUploadError('File was not provided!'), false);
    }

    const { event } = req.body;
    if (!event) {
        cb(new FileUploadError('Upload event was not defined!'));
        return;
    }

    const isCorrectExtension = UPLOADS[event].extensions.includes(
        path.extname(file.originalname)
    );
    if (!isCorrectExtension) {
        cb(
            new FileUploadError(
                `Incorrect file extension: '${file.originalname}'`
            ),
            false
        );
        return;
    }

    cb(null, true);
};

export const UPLOAD = multer({
    storage: DISK_STORAGE,
    fileFilter: FILE_FILTER
});
