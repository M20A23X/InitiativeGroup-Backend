export class DBEmptyResponseError extends Error {
    constructor(message) {
        super(`Empty database response! ${message || ''}`);
    }
}
