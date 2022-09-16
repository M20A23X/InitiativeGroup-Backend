import { concat } from '#helpers/concat.js';

export class TestAddingError extends Error {
    constructor(...message) {
        super(`Test adding error!${concat(message, ', ')}`);
    }
}
