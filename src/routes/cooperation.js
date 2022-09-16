import { createChildRouter } from '#helpers/router.js';
import { cooperationController } from '#controllers/cooperation.js';

const router = createChildRouter();

router.get('/test', cooperationController.getTest);
router.post('/test/add', cooperationController.postAddTest);
router.put('/test/update', cooperationController.putUpdateTest);
router.put('/test/complete', cooperationController.putCompleteTest);

export { router as cooperationRouter };
