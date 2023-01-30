USE `ig`;

DROP TABLE IF EXISTS `tbl_Users`;
CREATE TABLE `tbl_Users`
(
    `user_id`    INT AUTO_INCREMENT,
    `uuid`       BINARY(16)   NOT NULL DEFAULT (UUID_TO_BIN(UUID())),
    `email`      VARCHAR(50)  NOT NULL,
    `full_name`  VARCHAR(50)  NOT NULL,
    `has_resume` BOOLEAN      NOT NULL DEFAULT (FALSE),
    `is_online`  BOOLEAN      NOT NULL DEFAULT (FALSE),
    `is_tested`  BOOLEAN      NOT NULL DEFAULT (FALSE),
    `is_testing` BOOLEAN      NOT NULL DEFAULT (FALSE),
    `last_login` DATETIME     NOT NULL DEFAULT (NOW()),
    `password`   VARCHAR(64)  NOT NULL,
    `resume_url` VARCHAR(100) NULL,
    `role`       VARCHAR(10)  NOT NULL,
    `telephone`  VARCHAR(13)  NOT NULL,
    `username`   VARCHAR(20)  NOT NULL,
    CONSTRAINT `Users_PK_user_id` PRIMARY KEY (`user_id`),
    CONSTRAINT `Users_FK_role_id` FOREIGN KEY (`role`) REFERENCES `tbl_user_roles` (`user_role`) ON UPDATE CASCADE,
    CONSTRAINT `Users_UQ_uuid` UNIQUE (`uuid`),
    CONSTRAINT `Users_UQ_email` UNIQUE (`email`),
    CONSTRAINT `Users_UQ_telephone` UNIQUE (`telephone`),
    CONSTRAINT `Users_UQ_resume_url` UNIQUE (`resume_url`)
);
