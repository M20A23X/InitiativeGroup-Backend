import { infoService } from '#services/info.js';

export class InfoController {
    async getNews(req, res) {
        try {
            res.status(200).send(await infoService.getNews());
        } catch (error) {
            res.status(500).json(error.code);
        }
    }

    async postNews(req, res) {
        try {
            const { text, image } = req.body;
            res.status(200).json(await infoService.addNews(text, image));
        } catch (error) {
            res.status(500).json(error.code);
        }
    }

    async getProjects(req, res) {
        try {
            res.status(200).send(await infoService.getProjects());
        } catch (error) {
            res.status(500).json(error.code);
        }
    }

    async postProject(req, res) {
        try {
            const { text, image } = req.body;
            res.status(200).json(await infoService.addProject(text, image));
        } catch (error) {
            res.status(500).json(error.code);
        }
    }

    async getStudy(req, res) {
        try {
            res.status(200).send(await infoService.getStudy());
        } catch (error) {
            res.status(500).json(error.code);
        }
    }

    async postStudy(req, res) {
        try {
            const { text, image } = req.body;
            res.status(200).json(await infoService.addStudy(text, image));
        } catch (error) {
            res.status(500).json(error.code);
        }
    }
}

export const infoController = new InfoController();
