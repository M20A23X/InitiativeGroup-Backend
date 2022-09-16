import { ArgError } from '#exceptions/ArgError.js';
import { DBEmptyResponseError } from '#exceptions/DBEmptyResponseError.js';

import { log } from '#helpers/logger.js';
import { cooperationService } from '#services/cooperation.js';
import { TestAddingError } from '#exceptions/cooperation/TestAddingError.js';
import { TestUpdatingError } from '#exceptions/cooperation/TestUpdatingError.js';

export class CooperationController {
    //----- POST - Test -----//
    async postAddTest(req, res) {
        try {
            const { test } = req.body;
            const serviceResponse = await cooperationService.addTest(test);

            log.info('Sending response...');
            res.status(200).json(serviceResponse);
        } catch (error) {
            if (error instanceof ArgError || error instanceof TestAddingError) {
                log.warn(error.message);
                res.status(500).json({
                    error: error.message
                });
            } else {
                log.err(error.stack);
                res.status(500).send();
            }
        }
    }

    //----- GET - Test -----//
    async getTest(req, res) {
        try {
            const { testId } = req.body;
            const testData = await cooperationService.getTest(testId);

            log.info('Sending response...');
            res.status(200).json(testData);
        } catch (error) {
            if (error instanceof ArgError || error instanceof DBEmptyResponseError) {
                log.warn(error.message);
                res.status(500).json({
                    error: error.message
                });
            } else {
                log.err(error.stack);
                res.status(500).send();
            }
        }
    }

    //----- PUT - Complete test for user -----//
    async putCompleteTest(req, res) {
        try {
            const { userId, testId } = req.body;
            const response = await cooperationService.completeTest(userId, testId);

            log.info('Sending response...');
            res.status(200).json(response);
        } catch (error) {
            if (error instanceof ArgError || error instanceof DBEmptyResponseError) {
                log.warn(error.message);
                res.status(500).json({
                    error: error.message
                });
            } else {
                log.err(error.stack);
                res.status(500).send();
            }
        }
    }

    //----- PUT - Update existing test -----//
    async putUpdateTest(req, res) {
        try {
            const { testId, testDiff } = req.body;
            const response = await cooperationService.updateTest(testId, testDiff);

            log.info('Sending response...');
            res.status(200).json(response);
        } catch (error) {
            if (error instanceof ArgError || error instanceof TestUpdatingError) {
                log.warn(error.message);
                res.status(500).json({
                    error: error.message
                });
            } else {
                log.err(error.stack);
                res.status(500).send();
            }
        }
    }
}

export const cooperationController = new CooperationController();
