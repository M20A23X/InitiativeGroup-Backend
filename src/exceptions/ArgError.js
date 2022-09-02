import { concat } from '#helpers/concat.js';

export class ArgError extends Error {
    constructor(...message) {
        super(`Incorrect arg!${concat(message, ', ')}`);
    }
}
