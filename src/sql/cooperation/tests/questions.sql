USE `ig`;

# Question types
DROP TABLE IF EXISTS `tbl_Question_types`;
CREATE TABLE `tbl_Question_types`
(
    `type` VARCHAR(15),
    CONSTRAINT `question_types_PK_type` PRIMARY KEY (`type`),
    CONSTRAINT `question_types_CHK_type` CHECK (REGEXP_LIKE(`type`, '^[a-z]+$', 'c'))
);

# Programming language names
DROP TABLE IF EXISTS `tbl_Prog_langs`;
CREATE TABLE `tbl_Prog_langs`
(
    `language` VARCHAR(15),
    CONSTRAINT `prog_langs_PK_language` PRIMARY KEY (`language`),
    CONSTRAINT `prog_langs_CHK_language` CHECK (REGEXP_LIKE(`language`, '^[a-z+#]+$', 'c'))
);
