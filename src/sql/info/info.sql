USE `ig`;

DROP TABLE IF EXISTS `tbl_Votes`;
CREATE TABLE `tbl_Votes`
(
    `vote_id` INT AUTO_INCREMENT,
    `user_id` INT                  NOT NULL,
    `unity`   BOOL DEFAULT (FALSE) NOT NULL,
    `front`   BOOL DEFAULT (FALSE) NOT NULL,
    `back`    BOOL DEFAULT (FALSE) NOT NULL,
    CONSTRAINT `Votes_PK_vote_id` PRIMARY KEY (`vote_id`),
    FOREIGN KEY (`user_id`) REFERENCES `tbl_Users` (`user_id`)

);

DROP TABLE IF EXISTS `tbl_Cases`;
CREATE TABLE `tbl_Cases`
(
    `case_id`      INT AUTO_INCREMENT,
    `img`          VARCHAR(100)  NOT NULL,
    `name`         VARCHAR(28)   NOT NULL,
    `text`         VARCHAR(1000) NOT NULL,
    `num_of_votes` INT           NOT NULL,
    CONSTRAINT `Cases_PK_case_id` PRIMARY KEY (`case_id`)
);


DROP TABLE IF EXISTS `tbl_Info`;
CREATE TABLE `tbl_Info`
(
    `info_id` INT AUTO_INCREMENT,
    `text`    VARCHAR(1000) NOT NULL,
    `img`     BLOB          NOT NULL,
    `type`    INT           NOT NULL, # TODO: 1 - News, 2 - Study, 3 - Projects
    CONSTRAINT `Info_PK_info_id` PRIMARY KEY (`info_id`)
);
