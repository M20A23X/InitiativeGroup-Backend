import { createChildRouter } from '#helpers/router.js';
import { userController } from '#controllers/user.js';

const router = createChildRouter();

router.get('/', userController.getUser);
router.post('/login', userController.postLogin);
router.put('/online', userController.putSetOnlineStatus);
router.post('/registration', userController.postRegister);
router.put('/resume', userController.putUpdateResume);
router.put('/vote', userController.putVote);

export { router as userRouter };
