import { ArgError } from '#exceptions/ArgError.js';
import { DBEmptyResponseError } from '#exceptions/DBEmptyResponseError.js';
import { userService } from '#services/user.js';

class UserController {
    //----- POST - User registration -----//
    async postRegister(req, res) {
        try {
            const { email, username, fullName, password, telephone } = req.body;

            await userService.registerUser(
                email,
                username,
                fullName,
                password,
                telephone
            );

            console.log('Sending response...');
            res.status(200).json({ message: `registered new user: ${email}` });
        } catch (error) {
            if (error instanceof ArgError) {
                console.warn(error.message);
            } else {
                console.error(error.message);
            }
            res.status(500).json({ error: error.message, code: error.code });
        }
    }

    //----- POST - User logging in -----//
    async postLogin(req, res) {
        try {
            const { email, password } = req.body;
            const user = await userService.loginUser(email, password);

            console.log('Sending response...');
            res.status(200).json({ user });
        } catch (error) {
            if (
                error instanceof ArgError
                || error instanceof DBEmptyResponseError
            ) {
                console.warn(error.message);
            } else {
                console.error(error.message);
            }
            res.status(500).json({ error: error.message, code: error.code });
        }
    }

    //----- PUT - Update online status -----//
    async putSetOnlineStatus(req, res) {
        try {
            const { email, status } = req.body;
            await userService.setOnlineStatus(email, status);

            console.log('Sending response...');
            res.status(200).json({
                message: `changed online status for user: ${email}, online status: ${status}`
            });
        } catch (error) {
            if (error instanceof ArgError) {
                console.warn(error.message);
            } else {
                console.error(error.message);
            }
            res.status(500).json({ error: error.message, code: error.code });
        }
    }

    //----- PUT - Update user voting -----//
    async putVote(req, res) {
        try {
            const { userId, unity, front, back } = req.body;
            await userService.vote(userId, unity, front, back);

            console.log('Sending response...');
            res.status(200).json();
        } catch (e) {
            console.error(e.code);
            res.status(500).json({ error: e.code });
        }
    }

    //----- GET - Get user data -----//
    async getUser(req, res) {
        try {
            const { userId } = req.query;

            console.log(`Getting data for user id: ${userId}...`);
            const user = await userService.getUser(userId);

            console.log('Sending response...');
            res.status(200).json(user);
        } catch (e) {
            console.error(e.code);
            res.status(500).json({ error: e.code });
        }
    }
}

export const userController = new UserController();
