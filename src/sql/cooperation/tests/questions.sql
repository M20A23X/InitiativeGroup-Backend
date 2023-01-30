USE `ig`;

# Question types
DROP TABLE IF EXISTS `tbl_question_types`;
CREATE TABLE `tbl_question_types`
(
    `type_id` INT AUTO_INCREMENT,
    `type`    VARCHAR(10) NOT NULL,
    CONSTRAINT `question_types_PK_type_id` PRIMARY KEY (`type_id`),
    CONSTRAINT `question_types_UQ_type` UNIQUE (`type`),
    CONSTRAINT `question_types_CHK_type` CHECK (REGEXP_LIKE(`type`, '^[a-z]+$', 'c'))
);

# Programming language names
DROP TABLE IF EXISTS `tbl_prog_langs`;
CREATE TABLE `tbl_prog_langs`
(
    `lang_id`  INT AUTO_INCREMENT,
    `language` VARCHAR(15) NOT NULL,
    CONSTRAINT `prog_langs_PK_lang_id` PRIMARY KEY (`lang_id`),
    CONSTRAINT `prog_langs_UQ_language` UNIQUE (`language`),
    CONSTRAINT `prog_langs_CHK_language` CHECK (REGEXP_LIKE(`language`, '^[a-z+#]+$', 'c'))
);
