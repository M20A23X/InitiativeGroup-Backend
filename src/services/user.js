import bcrypt from 'bcrypt';

import { ArgError } from '#exceptions/ArgError.js';
import { DBEmptyResponseError } from '#exceptions/DBEmptyResponseError.js';
import { PasswordError } from '#exceptions/PasswordError.js';

import { log } from '#helpers/logger.js';
import { querySql } from '#helpers/sql.js';

import fs from 'fs';

class UserService {
    //----- Log in user -----//
    async loginUser(email, password) {
        console.log(`Logging in user, email: ${email}...`);

        if (!email || !password) {
            throw new ArgError(
                (!email || `email: ${email}`)
                    + (!email || `password: ${password}`)
            );
        }

        const sql = `SELECT password,
                            HEX(uuid)  AS uuid,
                            email,
                            full_name  AS fullName,
                            has_resume AS hasResume,
                            is_tested  AS isTested,
                            telephone,
                            username
                     FROM tbl_Users
                     WHERE email = '${email}'`;

        console.log(
            `Querying database: getting data for user, email: ${email}...`
        );
        const dbResponse = await querySql(sql);
        const { password: dbPassword, ...user } = dbResponse[0];
        if (!user) {
            throw new DBEmptyResponseError(`Undefined user: ${email}`);
        }

        console.log('Checking password...');
        const validPassword = bcrypt.compareSync(password, dbPassword);
        if (validPassword) {
            throw new PasswordError();
        }

        await userService.setOnlineStatus(email, true);

        return {
            ...user,
            hasResume: !!user.hasResume,
            isTested: !!user.isTested
        };
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
        const sql = `INSERT INTO tbl_Users (email, username, full_name, password, telephone)
                     VALUES ('${email}', '${username}', '${fullName}', '${passwordHash}', '${telephone}');`;
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
                     SET is_online = ${status}
                     WHERE email = '${email}';`;
        await querySql(sql);
    }

    //----- Update resume -----//
    async updateResume(email, file) {
        log.info(`Updating resume for user email: ${email}...`);

        if (!email || email < 0 || file === undefined) {
            throw new ArgError(
                (!email ? `email: '${email}'` : '')
                    + (!file ? `resumeFile: '${file}'` : '')
            );
        }

        log.info(`Resume saved in '${file.path}'`);
        log.info(`Querying database: updating user resume...`);
        const sql = {
            oldResume: `SELECT resume_url AS oldResumeUrl
                        FROM tbl_users
                        WHERE email = '${email}'`,
            update: `UPDATE tbl_Users
                     SET resume_url = '${file.path.replaceAll(/\\/g, '\\\\')}'
                     WHERE email = '${email}'`
        };

        const dbResponse = await querySql(sql.oldResume);
        const { oldResumeUrl } = dbResponse[0];
        if (fs.existsSync(oldResumeUrl)) {
            log.info(`Deleting old resume file: ${oldResumeUrl}...`);
            fs.unlinkSync(oldResumeUrl);
        }

        await querySql(sql.update);
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
