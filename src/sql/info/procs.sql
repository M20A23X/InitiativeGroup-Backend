/*
delimiter $$

CREATE PROCEDURE sp_postVote(id INT, Unity1 BOOL, Front1 BOOL, Back1 BOOL)
BEGIN
    UPDATE `Votes` SET `Unity`=Unity1 `Front`=Front1 `Back`=Back1 WHERE 'UserId' = id;
END $$
/*
delimiter ;

INSERT INTO `Votes` (`Front`, `Back`, `UserId`)
VALUES (1, 1, 1);
*/













