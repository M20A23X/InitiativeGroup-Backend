USE `ig`;

DROP TABLE IF EXISTS `tbl_User_roles`;
CREATE TABLE `tbl_User_roles`
(
    `user_role` VARCHAR(10),
    CONSTRAINT `User_roles_PK_user_id` PRIMARY KEY (`user_role`)
);
