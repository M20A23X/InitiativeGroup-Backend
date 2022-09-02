export class PasswordError extends Error {
    constructor() {
        super('Incorrect password!');
    }
}
