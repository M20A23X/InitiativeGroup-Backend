USE `ig`;

CREATE PROCEDURE `sp_add_news`(`text_arg` VARCHAR(300), `image_arg` BLOB)
BEGIN
    INSERT INTO `tbl_News`(`text`, `image`)
    VALUES (`text_arg`, `image_arg`);
END;


CREATE PROCEDURE `sp_add_project`(`text_arg` VARCHAR(1000), `image_arg` BLOB)
BEGIN
    INSERT INTO `tbl_Projects`(`text`, `image`)
    VALUES (`text_arg`, `image_arg`);
END;

CREATE PROCEDURE `sp_add_study`(`text_arg` VARCHAR(1000), `image_arg` BLOB)
BEGIN
    INSERT INTO `tbl_Study`(`text`, `image`)
    VALUES (`text_arg`, `image_arg`);
END;
