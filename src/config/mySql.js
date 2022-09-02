import mysql2 from 'mysql2';
import { sep } from 'path';
import { readFileSync } from 'fs';

const KEYS_FILE = 'keys.json';
const readCertFile = (file) =>
    readFileSync(`${process.env.HOME}${sep}certs${sep}${file}`, 'utf8');
const certsJson = JSON.parse(readCertFile(KEYS_FILE));

export const sqlPool = mysql2.createPool({
    connectionLimit: 7,
    host: '127.0.0.1',
    port: 3306,
    user: 'mysql_user',
    ssl: {
        cert: readCertFile(certsJson.cert),
        key: readCertFile(certsJson.key),
        ca: readCertFile(certsJson.ca)
    },
    password: `${readCertFile(certsJson.password).slice(0, -1)}`,
    database: 'IG'
});
