export class ArgError extends Error {
    constructor(message) {
        super(`Incorrect arg! ${message || ''}`);
    }
}
