export class FileUploadError extends Error {
    constructor(message) {
        super(`File upload error! ${message || ''}`);
    }
}
