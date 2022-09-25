import { createChildRouter } from '#helpers/router.js';
import { infoController } from '#controllers/info.js';

const infoRouter = createChildRouter();
const newsRouter = createChildRouter();
const studyRouter = createChildRouter();
const projectsRouter = createChildRouter();

newsRouter.get('/', infoController.getNews);
newsRouter.post('/add', infoController.postNews);

studyRouter.get('/', infoController.getStudy);
studyRouter.post('/add', infoController.postStudy);

projectsRouter.get('/', infoController.getProjects);
projectsRouter.post('/add', infoController.postProject);

infoRouter.use('/news', newsRouter);
infoRouter.use('/study', studyRouter);
infoRouter.use('/projects', projectsRouter);

export { infoRouter };
