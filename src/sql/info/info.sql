USE `ig`;

DROP TABLE IF EXISTS `tbl_News`;
CREATE TABLE `tbl_News`
(
    `news_id` INT          NOT NULL AUTO_INCREMENT,
    `text`    VARCHAR(300) NOT NULL,
    `image`   BLOB         NOT NULL,
    CONSTRAINT `News_PK_news_id` PRIMARY KEY (`news_id`),
    CONSTRAINT `News_UQ_text` UNIQUE (`text`)
);

DROP TABLE IF EXISTS `tbl_Projects`;
CREATE TABLE `tbl_Projects`
(
    `project_id` INT           NOT NULL AUTO_INCREMENT,
    `text`       VARCHAR(1000) NOT NULL,
    `image`      BLOB          NOT NULL,
    CONSTRAINT `Projects_PK_project_id` PRIMARY KEY (`project_id`),
    CONSTRAINT `Projects_UQ_Text` UNIQUE (`text`)
);

DROP TABLE IF EXISTS `tbl_Study`;
CREATE TABLE `tbl_Study`
(
    `study_id` INT           NOT NULL AUTO_INCREMENT,
    `text`     VARCHAR(1000) NOT NULL,
    `image`    BLOB          NOT NULL,
    CONSTRAINT `Study_PK_study_id` PRIMARY KEY (`study_id`),
    CONSTRAINT `Study_UQ_text` UNIQUE (`text`)
);