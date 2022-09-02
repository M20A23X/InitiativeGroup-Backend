import { UPLOAD, UPLOAD_HANDLERS, UPLOADS } from '#config/storage.js';

export const setupUpload = (
    type = 'single',
    event = '',
    path = 'storage/',
    extensions = []
) => {
    UPLOADS[event] = {
        event,
        path,
        extensions
    };
    UPLOAD_HANDLERS[event] = UPLOAD[type](event);
    return UPLOAD_HANDLERS[event];
};
