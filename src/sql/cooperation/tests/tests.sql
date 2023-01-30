USE `ig`;

# Common data for test
DROP TABLE IF EXISTS `tbl_Tests`;
CREATE TABLE `tbl_Tests`
(
    `test_id`          INT AUTO_INCREMENT,
    `name`             VARCHAR(20) NOT NULL,
    `time_limit`       INT         NOT NULL,
    `questions_amount` INT         NOT NULL,
    CONSTRAINT `Tests_PK_test_id` PRIMARY KEY (`test_id`),
    CONSTRAINT `Tests_UQ_name` UNIQUE (`name`),
    CONSTRAINT `Tests_CHK_time_limit` CHECK (`time_limit` > 0),
    CONSTRAINT `Tests_CHK_questions_amount` CHECK (`questions_amount` > 0)
);

# Questions for test
DROP TABLE IF EXISTS `tbl_Questions`;
CREATE TABLE `tbl_Questions`
(
    `question_id` INT AUTO_INCREMENT,
    `test_id`     INT          NOT NULL,
    `prog_lang`   VARCHAR(15)  NULL,
    `type`        VARCHAR(15)  NOT NULL,
    `options`     VARCHAR(300) NOT NULL,
    `result`      VARCHAR(75)  NOT NULL,
    `text`        VARCHAR(50)  NOT NULL,
    `args`        VARCHAR(75)  NULL,
    `init_value`  VARCHAR(300) NULL,
    `regex_group` VARCHAR(20)  NULL,
    `regex`       VARCHAR(50)  NULL,
    CONSTRAINT `Questions_PK_question_id` PRIMARY KEY (`question_id`),
    CONSTRAINT `Questions_FK_Tests_test_id` FOREIGN KEY (`test_id`) REFERENCES `tbl_Tests` (`test_id`) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `Questions_FK_Prog_langs_language` FOREIGN KEY (`prog_lang`) REFERENCES `tbl_Prog_langs` (`language`) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `Questions_FK_Quest_types_type` FOREIGN KEY (`type`) REFERENCES `tbl_Question_types` (`type`) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `Questions_UQ_text` UNIQUE (`text`)
);

