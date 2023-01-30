USE `ig`;

# Add tests for newly registered student
DROP TRIGGER IF EXISTS `Users_TG_after_insert`;
CREATE TRIGGER `Users_TG_after_insert`
    AFTER INSERT
    ON `tbl_users`
    FOR EACH ROW
BEGIN
    IF `NEW`.`role` = 'student' THEN
        INSERT INTO `tbl_user_tests`(`user_id`, `test_id`)
            (SELECT `u`.`user_id`, `t`.`test_id`
             FROM `tbl_tests` `t`,
                  `tbl_users` `u`
             WHERE `u`.`user_id` = `NEW`.`user_id`);
    END IF;
END;
