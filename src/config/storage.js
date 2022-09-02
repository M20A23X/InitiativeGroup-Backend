import multer from 'multer';
import * as path from 'path';
import { FileUploadError } from '#exceptions/FileUploadError.js';

const STORAGE_ROOT = 'storage/';
const UPLOADS = {
    userResume: {
        event: 'userResume',
        path: 'user-resume/',
        extensions: ['.doc', '.docx']
    }
};

const DISK_STORAGE = multer.diskStorage({
    destination: (req, file, cb) => {
        const path = STORAGE_ROOT.concat(UPLOADS[req.body.event].path);
        cb(null, path);
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

const UPLOAD = multer({
    storage: DISK_STORAGE,
    fileFilter: FILE_FILTER
});

export const UPLOAD_HANDLERS = {
    userResume: UPLOAD.single(UPLOADS.userResume.event)
};
