import { querySql } from '#helpers/sql.js';

class InfoService {
    async getNews() {
        const sql = 'SELECT * FROM tbl_News;';
        return querySql(sql);
    }

    async addNews(text, image) {
        const sql = `call sp_PostNews('${text}', '${image}');`;
        return querySql(sql);
    }

    async getStudy(studyId) {
        const sql = `SELECT *
                     FROM tbl_Study
                     WHERE study_id = ${studyId};`;
        return querySql(sql);
    }

    async addStudy(text, imageUrl) {
        const sql = `call sp_PostStudy('${text}', '${imageUrl}');`;
        return querySql(sql);
    }

    async getProjects(projectId) {
        const sql = `SELECT *
                     FROM tbl_Projects
                     WHERE project_id = ${projectId};`;
        return querySql(sql);
    }

    async addProject(text, imageUrl) {
        const sql = `call sp_PostProjects('${text}', '${imageUrl}');`;
        return querySql(sql);
    }
}

export const infoService = new InfoService();
