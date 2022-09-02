import { sqlPool } from '#config/mySql.js';

// Returns:  Promise<DB_TABLE>
// Params:
//     sql          <string>    sql query
export const querySql = (sql = '') =>
    new Promise((fulfill, reject) => {
        sqlPool.query(sql, (error, result) => {
            if (error) {
                reject(error);
            }
            fulfill(result);
        });
    });
