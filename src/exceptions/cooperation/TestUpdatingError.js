import { concat } from '#helpers/concat.js';

export class TestUpdatingError extends Error {
    constructor(...message) {
        super(`Test updating error!${concat(message, ', ')}`);
    }
}
