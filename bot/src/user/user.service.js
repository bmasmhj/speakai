const { database } = require("../database");

function getAllUsers(callback) {
    var sql = `SELECT * FROM users WHERE status = 1`;
    database.query(sql, function (err, result) {
        if (err) throw err;
        callback(result);
    }
    );
}
// Name	Type	Collation	Attributes	Null	Default	Comments	Extra	Action
// 	1	id Primary	int(11)			No	None		AUTO_INCREMENT	Change Change	Drop Drop	
// 	2	uid	varchar(255)	latin1_swedish_ci		No	None			Change Change	Drop Drop	
// 	3	access_name	varchar(255)	latin1_swedish_ci		No	None			Change Change	Drop Drop	
// 	4	access_email	varchar(255)	latin1_swedish_ci		No	None			Change Change	Drop Drop	
// 	5	access_picture	varchar(255)	latin1_swedish_ci		No	None			Change Change	Drop Drop	
// 	6	source	varchar(100)	latin1_swedish_ci		No	self			Change Change	Drop Drop	
// 	7	access_password	varchar(255)	latin1_swedish_ci		No	None			Change Change	Drop Drop	
// 	8	status	int(11)			No	None			Change Change	Drop Drop	
// 	9	code

function getOneUser(callback , user_id ) {
    var sql = `SELECT * FROM users WHERE uid = ?`;
    database.query(sql, [user_id], function (err, result) {
        if (err) throw err;
        callback(result);
    }
    );
}

// editUsers

function editUsers(callback , body , user_id ) {
    var sql = `UPDATE users SET 
    access_name = ? , 
    access_email = ? , 
    WHERE uid = ?`;
    database.query(sql, [body.access_name , body.access_email , body.access_picture , body.source , body.access_password , body.status , body.code , user_id], function (err, result) {
        if (err) throw err;
        callback(result);
    }
    );
}


// deleteUsers update status to 0

function deleteUsers(callback , user_id ) {
    var sql = `UPDATE users SET status = 0 WHERE id = ?`;
    database.query(sql, [user_id], function (err, result) {
        if (err) throw err;
        callback(result);
    }
    );
}


module.exports = {
    getAllUsers ,
    deleteUsers ,
    getOneUser ,
    editUsers ,
}
