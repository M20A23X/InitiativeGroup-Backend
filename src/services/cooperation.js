import { ArgError } from '#exceptions/ArgError.js';
import { DBEmptyResponseError } from '#exceptions/DBEmptyResponseError.js';
import { TestAddingError } from '#exceptions/cooperation/TestAddingError.js';
import { TestUpdatingError } from '#exceptions/cooperation/TestUpdatingError.js';

import { log } from '#helpers/logger.js';
import { sqlPool } from '#config/mySql.js';
import { FIELDS_REDUCE_DELIM } from '#config/cooperation/cooperation.js';

import { concat } from '#helpers/concat.js';

class CooperationService {
    ///----- PRIVATE -----///
    //----- Check test data -----//
    #checkTestData(test, isAllRequired = false) {
        log.info(`Checking test data, is all fields required: '${isAllRequired}'...`);
        const { name, timeLimit, questionsAmount, questions } = test;

        const testErrorMsg = [
            // Check 'undefined' and 'is all fields are required':
            //   if 'false' -> check constraints:
            //    if 'false' -> add error message
            // then filter non strings (keep only messages)
            // Required (on test adding)
            !(timeLimit ?? isAllRequired) || timeLimit > 0 || `timeLimit: '${timeLimit}'`,
            !(name ?? isAllRequired) || (typeof name === 'string' && name.length > 0) || `test name: '${name}'`,
            !(questionsAmount ?? isAllRequired) || questionsAmount > 0 || `questions amount: '${questionsAmount}'`,
            !(questions ?? isAllRequired)
                || (questions instanceof Array && questions.length > 0)
                || `questions: [${questions}]`
        ].filter((err) => typeof err === 'string');
        if (testErrorMsg.length) {
            throw new ArgError(...testErrorMsg);
        }

        questions
            && questions.forEach((question) => {
                const { progLang, type, options, result, text, args, initValue, regexGroup, regex } = question;
                const questionErrorMsg = [
                    // Required (on test adding)
                    !(result ?? isAllRequired) || typeof result === 'string' || `result: '${result}'`,
                    !(text ?? isAllRequired) || (typeof text === 'string' && text.length > 0) || `text: '${text}'`,
                    !(type ?? isAllRequired) || (typeof type === 'string' && type.length > 0) || `type: '${type}'`,
                    !(options ?? isAllRequired)
                        || (options instanceof Array && options.every((opt) => typeof opt === 'string'))
                        || `options: '${options}'`,
                    // Nullable (on test adding)
                    args === undefined || typeof args === 'string' || `args: '${args}'`,
                    regex === undefined || typeof regex === 'string' || `regex: '${regex}'`,
                    progLang === undefined || typeof progLang === 'string' || `progLang: '${progLang}'`,
                    initValue === undefined || typeof initValue === 'string' || `initValue: '${initValue}'`,
                    regexGroup === undefined || typeof regexGroup === 'string' || `regexGroup: '${regexGroup}'`
                ].filter((msg) => typeof msg === 'string');
                if (questionErrorMsg.length) {
                    throw new ArgError(...questionErrorMsg);
                }
            });
    }

    ///----- PUBLIC -----///
    //----- Add new test -----//
    async addTest(test) {
        const { name, timeLimit, questionsAmount, questions } = test;
        log.info(`Adding new test, name: '${name}'...`);

        this.#checkTestData(test, true);

        log.info(`Querying database: inserting new test...`);
        let newTestId;
        const connection = await sqlPool.getConnection();
        try {
            await connection.beginTransaction();
            await connection.query(
                `INSERT INTO tbl_tests(name, time_limit, questions_amount)
                 VALUES (?, ?, ?)`,
                [name, timeLimit, questionsAmount]
            );

            [[{ newTestId }]] = await connection.query(`SElECT LAST_INSERT_ID() AS newTestId`);
            const questionsWrapped = questions.map((question) => {
                const argsReduced = question.args && concat(question.args, FIELDS_REDUCE_DELIM);
                const optionsReduced = concat(question.options, FIELDS_REDUCE_DELIM);
                return [
                    newTestId,
                    question.progLang,
                    question.type,
                    optionsReduced,
                    argsReduced,
                    question.initValue,
                    question.regexGroup,
                    question.regex,
                    question.result,
                    question.text
                ];
            });
            await connection.query(
                `INSERT INTO tbl_questions(test_id, prog_lang, type, options, args,
                                           init_value, regex_group, regex, result, text)
                 VALUES ?`,
                [questionsWrapped]
            );

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw new TestAddingError(error);
        } finally {
            connection.release();
        }

        return {
            message: `Added new test: '${name}', id: ${newTestId}`
        };
    }

    //----- Complete test for user -----//
    async completeTest(userId, testId) {
        log.info(`Completing test, id: ${testId} for user, id: ${userId}...`);

        const errorMsg = [userId >= 1 || `userId: '${userId}'`, testId >= 1 || `testId: '${testId}'`].filter(
            (msg) => typeof msg === 'string'
        );
        if (errorMsg.length) {
            throw new ArgError(...errorMsg);
        }

        log.info(`Querying database: deleting test, id: ${testId} for user, id: ${userId}...`);
        const sql = {
            sql: `DELETE
                  FROM tbl_user_tests
                  WHERE user_id = ?
                    AND test_id = ?`,
            values: [userId, testId]
        };

        const [{ affectedRows }] = await sqlPool.query(sql.sql, sql.values);
        if (affectedRows <= 0) {
            throw new DBEmptyResponseError(`User or test are not exists, user id: '${userId}', test id: '${testId}'`);
        }
        return {
            message: `Test, id: ${testId} completed for user, id: ${userId}`
        };
    }

    //----- Get test -----//
    async getTest(testId) {
        log.info(`Getting test, id: ${testId}...`);
        if (testId <= 0) {
            throw new ArgError(`testId: '${testId}'`);
        }

        const sql = {
            test: `SELECT name, time_limit AS timeLimit, questions_amount AS questionsAmount
                   FROM tbl_Tests
                   WHERE test_id = ${testId}`,
            types: `SELECT *
                    FROM tbl_question_types`
        };

        log.info(`Querying database: getting test, id: ${testId}...`);
        const [[test]] = await sqlPool.query(sql.test);
        const { questionsAmount } = test;
        if (!questionsAmount) {
            throw new DBEmptyResponseError(`Cant find test, id: ${testId}`);
        }

        log.info(`Querying database: getting questions, test id: ${testId}...`);
        sql.questions = `SELECT prog_lang   AS progLang,
                                type,
                                args,
                                init_value  AS initValue,
                                options,
                                regex_group AS regexGroup,
                                regex,
                                result,
                                text
                         FROM tbl_Questions
                         WHERE test_id = ${testId}
                         ORDER BY RAND()
                         LIMIT ${questionsAmount}`;
        const [questions] = await sqlPool.query(sql.questions);

        log.info(`Querying database: getting question types...`);
        const [dbQuestTypes] = await sqlPool.query(sql.types);
        const questionTypes = dbQuestTypes.map((type) => type.type);

        return {
            test: { ...test, questions },
            questionTypes,
            fieldsDelim: FIELDS_REDUCE_DELIM
        };
    }

    //----- Update existing test -----//
    async updateTest(testId, testDiff) {
        log.info(`Updating test, id: '${testId}'...`);

        this.#checkTestData(testDiff);
        const { name, timeLimit, questionsAmount, questions } = testDiff;

        const connection = await sqlPool.getConnection();
        try {
            await connection.beginTransaction();

            const sql = `UPDATE tbl_tests
                         SET ${concat([
                             name && `name='${name}'`,
                             timeLimit && `time_limit=${timeLimit}`,
                             questionsAmount && `questions_amount=${questionsAmount}`
                         ])}
                         WHERE test_id = ${testId}`;

            log.info(`Querying database: updating test...`);
            await connection.query(sql);

            const questionQueries = questions.map((question) => {
                const { questionId, progLang, type, options, args, initValue, regexGroup, regex, result, text }
                    = question;
                const argsReduced = args && concat(args, FIELDS_REDUCE_DELIM);
                const optionsReduced = options && concat(options, FIELDS_REDUCE_DELIM);

                const sql = `UPDATE tbl_questions
                             SET ${concat([
                                 text && `text='${text}'`,
                                 type && `type='${type}'`,
                                 regex && `regex='${regex}'`,
                                 result && `result='${result}'`,
                                 args && `args='${argsReduced}'`,
                                 progLang && `name='${progLang}'`,
                                 initValue && `init_value='${initValue}'`,
                                 regexGroup && `regex_group='${regexGroup}'`,
                                 optionsReduced && `options='${optionsReduced}'`
                             ])}
                             WHERE question_id = ${questionId}
                               AND test_id = ${testId}`;
                return connection.query(sql);
            });

            log.info(`Querying database: updating questions...`);
            await Promise.all(questionQueries);

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw new TestUpdatingError(error);
        } finally {
            connection.release();
        }
        return {
            message: `Updated test, id: ${testId}`
        };
    }
}

export const cooperationService = new CooperationService();
