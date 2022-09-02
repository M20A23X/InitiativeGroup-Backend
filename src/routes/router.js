import { Router } from 'express';

import { userRouter } from '#routes/user.js';
import { infoRouter } from '#routes/info.js';
import { cooperationRouter } from '#routes/cooperation.js';

const router = Router();

router.use('/user', userRouter);
router.use('/info', infoRouter);
router.use('/cooperation', cooperationRouter);

export const appRouter = router;
