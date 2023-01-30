USE `ig`;

# Available tests for user
DROP TABLE IF EXISTS `tbl_user_tests`;
CREATE TABLE `tbl_user_tests`
(
    `test_id` INT,
    `user_id` INT,
    CONSTRAINT `user_tests_PK_test_id_user_id` PRIMARY KEY (`test_id`, `user_id`),
    CONSTRAINT `user_tests_FK_tests_test_id` FOREIGN KEY (`test_id`) REFERENCES `tbl_tests` (`test_id`),
    CONSTRAINT `user_tests_FK_tests_user_id` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`user_id`)
);
