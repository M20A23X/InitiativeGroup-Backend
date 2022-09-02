import bcrypt from 'bcrypt';

import { ArgError } from '#exceptions/ArgError.js';
import { DBEmptyResponseError } from '#exceptions/DBEmptyResponseError.js';
import { PasswordError } from '#exceptions/PasswordError.js';

import { querySql } from '#helpers/sql.js';

class UserService {
    //----- Log in user -----//
    async loginUser(email, password) {
        console.log(`Logging in user: ${email}...`);

        if (!email || !password) {
            throw new ArgError(
                (!email || `email: ${email}`)
                    + (!email || `password: ${password}`)
            );
        }

        const sql = {
            userCredentials: `SELECT user_id, password
                              FROM tbl_Users
                              WHERE email = '${email}'`,
            user: `SELECT *
                   FROM tbl_Users
                   WHERE email = '${email}'`
        };

        console.log(
            `Querying database: getting id, password for user: ${email}...`
        );
        const dbResponse = await querySql(sql.userCredentials);
        const user = dbResponse[0];
        if (!user) {
            throw new DBEmptyResponseError(`Undefined user: ${email}`);
        }

        console.log('Checking password...');
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            throw new PasswordError();
        }

        await userService.setOnlineStatus(email, true);

        console.log(`Querying database: getting data for user: ${email}...`);
        return await querySql(sql.user);
    }

    //----- Register user -----//
    async registerUser(email, username, fullName, password, telephone) {
        console.log(`Registering new user: ${email}...`);

        if (!email || !username || !fullName || !password || !telephone) {
            throw new ArgError(
                `email:' ${email}', username: '${username}', fullName: '${fullName}'`
                    + `, password: '${password}', telephone: '${telephone}'`
            );
        }

        console.log('Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        console.log(`Querying database: adding new user...`);
        const sql = `INSERT INTO tbl_Users (online_status, email, username, full_name, password, telephone)
                     VALUES (FALSE, '${email}', '${username}', '${fullName}', '${passwordHash}', '${telephone}');`;
        await querySql(sql);
    }

    //----- Set user online status -----//
    async setOnlineStatus(email, status) {
        console.log(`Updating online status for user: ${email}...`);

        if (!email || status === undefined) {
            throw new ArgError(
                (!email ? `userId: '${email}'` : '')
                    + (!status ? `status: '${status}'` : '')
            );
        }

        console.log(`Querying database: updating user online status...`);
        const sql = `UPDATE tbl_Users
                     SET online_status = ${status}
                     WHERE email = '${email}';`;
        await querySql(sql);
    }

    //----- Get user data -----//
    async getUser(userId) {
        console.log(`Updating vote for user id: ${userId}...`);

        if (!userId || userId < 0) {
            throw new ArgError(`userId: '${userId}'`);
        }

        console.log(
            `Querying database: getting data for user id: ${userId}...`
        );
        const sql = `SELECT *
                     FROM tbl_Users
                     WHERE user_id = '${userId}';`;
        return await querySql(sql);
    }

    //----- Update user vote -----//
    async vote(userId, unity, front, back) {
        console.log(`Updating vote for user id: ${userId}...`);

        if (
            !userId
            || userId < 0
            || unity === undefined
            || front === undefined
            || back === undefined
        ) {
            throw new ArgError(
                `userId:' ${userId}', unity: '${unity}', front: '${front}', back: '${back}'`
            );
        }

        console.log(`Querying database: updating user vote...`);
        const sql = `CALL sp_postVote(${userId}, ${unity}, ${front}, ${back});`;
        await querySql(sql);
    }
}

export const userService = new UserService();
