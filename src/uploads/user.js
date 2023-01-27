import { setupUpload } from '#helpers/storage.js';

export const handleResumeUpload = setupUpload(
    'single',
    'userResume',
    'resume/',
    ['.doc', '.docx']
);
