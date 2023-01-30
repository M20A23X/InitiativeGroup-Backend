USE `ig`;

# Common data for test
DROP TABLE IF EXISTS `tbl_tests`;
CREATE TABLE `tbl_tests`
(
    `test_id`          INT AUTO_INCREMENT,
    `name`             VARCHAR(20) NOT NULL,
    `time_limit`       INT         NOT NULL,
    `questions_amount` INT         NOT NULL,
    CONSTRAINT `tests_common_PK_test_id` PRIMARY KEY (`test_id`),
    CONSTRAINT `tests_common_UQ_name` UNIQUE (`name`),
    CONSTRAINT `tests_common_CHK_time_limit` CHECK (`time_limit` > 0),
    CONSTRAINT `tests_common_CHK_questions_amount` CHECK (`questions_amount` > 0)
);

# Questions for test
DROP TABLE IF EXISTS `tbl_questions`;
CREATE TABLE `tbl_questions`
(
    `question_id`   INT AUTO_INCREMENT,
    `test_id`       INT          NOT NULL,
    `prog_lang_id`  INT          NULL,
    `quest_type_id` INT          NOT NULL,
    `args`          VARCHAR(75)  NULL,
    `init_value`    VARCHAR(300) NULL,
    `options`       VARCHAR(300) NOT NULL,
    `regex_group`   VARCHAR(20)  NULL,
    `regex`         VARCHAR(50)  NULL,
    `result`        VARCHAR(75)  NOT NULL,
    `text`          VARCHAR(50)  NOT NULL,
    CONSTRAINT `questions_PK_question_id` PRIMARY KEY (`question_id`),
    CONSTRAINT `questions_FK_test_id` FOREIGN KEY (`test_id`) REFERENCES `tbl_tests` (`test_id`) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `questions_FK_prog_langs_id` FOREIGN KEY (`prog_lang_id`) REFERENCES `tbl_Prog_langs` (`lang_id`) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `questions_FK_quest_types_id` FOREIGN KEY (`quest_type_id`) REFERENCES `tbl_Question_types` (`type_id`) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `questions_UQ_text` UNIQUE (`text`)
);

