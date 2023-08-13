const { database } = require("../database");




function updateadmin(id , stat){
    try{
        if(stat == 'false'){
            var check = `SELECT * FROM admin WHERE id = '1'`;
            database.query(check, function (err, result) {
                if (err) throw err;
                if(result.length > 0){
                    if(result[0].socket_id == id){
                        var run = `UPDATE admin SET socket_id = '' , online = 'false' WHERE id = '1'`;
                        database.query(run, function (err, result) {
                            if (err) throw err;
                            console.log('updated admin');
                        }); 
                    }
                }
            });
        }
        if(stat == 'true'){
            var run = `UPDATE admin SET socket_id = '${id}' , online = 'true' WHERE id = '1'`;
            database.query(run, function (err, result) {
                if (err) throw err;
                console.log('updated admin');
            });
        }
       
    }
    catch(err){
        console.log(err);
    }
}

function checkadmin(callback){
    try{
        var check = `SELECT * FROM admin WHERE id = '1'`;
        database.query(check, function (err, result) {
            if (err) throw err;
            if(result.length > 0){
                if(result[0].online == 'true'){
                    callback(true)
                }else{
                    callback(false)
                }
            }
        });
    }
    catch(err){
        console.log(err);
    }
}

function add_chatbotmsg(uid, message, type , now_time) {
    let addQuery = "INSERT INTO chatbot_message (user_id , message , type , created_at) VALUES (?,? , ? , ?)";
    let values = [uid , message , type , now_time]
    database.query(addQuery, values,  function (error, results , fields) {
        if (error){ console.log(error);}
        return results
    });
}

function get_trained(callback){
    database.query(`
    SELECT
      CONCAT(d.name, '.', i.name) AS intent,
      GROUP_CONCAT(DISTINCT u.utterance SEPARATOR ', ') AS utterances,
      GROUP_CONCAT(DISTINCT a.answer SEPARATOR ', ') AS answers
    FROM
        domains d
      JOIN intent i ON i.domain_id = d.id
      LEFT JOIN utterances u ON u.domain_id = d.id AND u.intent_id = i.id
      LEFT JOIN answers a ON a.domain_id = d.id AND a.intent_id = i.id
    GROUP BY
    intent
  `, (err, results) => {
    if (err) {
      console.error('Query error: ' + err.stack);
      return;
    }

    const data = results.map(row => ({
      intent: row.intent,
        utterances: row.utterances ? row.utterances.split(', ') : [],
        answers: row.answers ? row.answers.split(', ') : []
    }));

    const json = JSON.stringify(data);
    callback(json);
    // Do whatever you want with the JSON data here
  });
}

function getAllMessage(callback){
    try {
        var run = `SELECT * FROM chatbot_message`;
        database.query(run, function (err, result) {
            if (err) {
                callback('err');
                return;
            }
            if (result.length > 0) {
                callback(result);
            } else {
                callback([]);
            }
        });
    } catch (err) {
        callback(err);
    }
}

function getMessage(callback , requests){
    try {
        var run = `SELECT * FROM chatbot_message WHERE user_id = '${requests.id}'`;
        database.query(run, function (err, result) {
            if (err) {
                callback('err');
                return;
            }
            if (result.length > 0) {
                callback(result);
            } else {
                callback([]);
            }
        });
    } catch (err) {
        callback(err);
    }
}


async function getTrainedData(callback , requests){
    var noerr = true;
   try{
    const utterancesPromise = new Promise((resolve, reject) => {
        database.query(`SELECT *  FROM utterances WHERE domain_id = ${requests.domain_id} and intent_id = ${requests.intent_id}`, function (error, results, fields) {
          if (error) reject(error);
          resolve(results);
        });
      });
  
      const answersPromise = new Promise((resolve, reject) => {
        database.query(`SELECT *  FROM answers WHERE domain_id = ${requests.domain_id} and intent_id = ${requests.intent_id}`, function (error, results, fields) {
          if (error) reject(error);
          resolve(results);
        });
      });
        const [utterances, answers] = await Promise.all([utterancesPromise, answersPromise]);
      if (noerr) {
        callback({ "utterances": utterances, "answers": answers });
      }    
   }
   catch(err){
    callback(err);
   }
}


function getDomain(callback){
    try{
        var run = `SELECT * FROM domains`;
        database.query(run, function (err, result) {
            if (err) {
                callback('err');
                return;
            }
            if (result.length > 0) {
                callback(result);
            } else {
                callback([]);
            }
        });
    }
    catch(err){
        callback(err);
    }
}

function getIntent(callback){
    try{
        var run = ` 
        SELECT
        d.id,
        d.name AS domain_name,
        CONCAT(
            '[',
            GROUP_CONCAT(
                CONCAT(
                    '{"id":', i.id, ',"name":"', d.name, '","domain_id":', i.domain_id, ',"intent":"', i.name, '"}'
                )
                SEPARATOR ','
            ),
            ']'
        ) AS intent
    FROM
        domains AS d
    JOIN
        intent AS i ON d.id = i.domain_id
    WHERE
        d.id != 0
    GROUP BY
        d.id, d.name;
    
        `;
        database.query(run, function (err, result) {
            if (err) {
                callback(err);
                return;
            }
            if (result.length > 0) {
                callback(result);
            } else {
                callback([]);
            }
        });
    }
    catch(err){
        callback(err);
    }
}

function getEntities(callback , requests){
    var sql = ` SELECT d.id as domain_id , d.name as domain_name , i.id as intent_id , i.name as intent_name FROM domains d LEFT JOIN intent i ON d.id = i.domain_id ORDER BY d.id, i.id`;
    database.query(sql, function (error, results, fields) {
        if (error) throw error;
        callback(results);
    }
    );
}

function addIntents(callback , requests){
    var sql = `INSERT INTO intent (name , domain_id) VALUES (? , ?)`;
    var values = [requests.intent_name , requests.domain_id];
    database.query(sql, values, function (error, results, fields) {
        if (error) throw error;
        callback({
            "status" : "success",
        })
    });
}

function addDomains(callback , requests){
    var sql = `INSERT INTO domains (name) VALUES (?)`;
    var values = [requests.name];
    database.query(sql, values, function (error, results, fields) {
        if (error) throw error;
        callback({
            "status" : "success",
        })
    }
    );
}

function addUtterances(callback , requests){
    var sql = `INSERT INTO utterances (utterance , domain_id , intent_id) VALUES ( ? , ? , ?)`;
    var values = [requests.utterance , requests.domain_id , requests.intent_id];
    database.query(sql, values, function (error, results, fields) {
        if (error) throw error;
        callback({
            "status" : "success",
        })
    }
    );
}


function addAnswers(callback , requests){
    // prevent sql injection and change special characters to html entities 
    var sql = `INSERT INTO answers (answer , domain_id , intent_id) VALUES (? , ? , ?)`;
    var values = [requests.answer , requests.domain_id , requests.intent_id];
    database.query(sql, values, function (error, results, fields) {
        if (error) throw error;
        callback({
            "status" : "success",
        })
    }
    );
    
}


function deletedomain(callback , requests){
    var sql = `DELETE FROM domains WHERE id = '${requests.id}'`;
    database.query(sql, function (error, results, fields) {
        if (error) throw error;
        var sql = `DELETE FROM intent WHERE domain_id = '${requests.id}'`;
        database.query(sql, function (error, results, fields) {
            if (error) throw error;
            var sql = `DELETE FROM utterances WHERE domain_id = '${requests.id}'`;
            database.query(sql, function (error, results, fields) {
                if (error) throw error;
                var sql = `DELETE FROM answers WHERE domain_id = '${requests.id}'`;
                database.query(sql, function (error, results, fields) {
                    if (error) throw error;
                    callback({
                        "status" : "success",
                    })
                }
                );
            }
            );
        }
        );
    }
    );
}

function deleteintent(callback , requests){
    var sql = `DELETE FROM intent WHERE id = '${requests.id}'`;
    database.query(sql, function (error, results, fields) {
        if (error) throw error;
        var sql = `DELETE FROM utterances WHERE intent_id = '${requests.id}'`;
        database.query(sql, function (error, results, fields) {
            if (error) throw error;
            var sql = `DELETE FROM answers WHERE intent_id = '${requests.id}'`;
            database.query(sql, function (error, results, fields) {
                if (error) throw error;
                callback({
                    "status" : "success",
                })
            }
            );
        }
        );
    }
    );
}

function deleteutterance(callback , requests){
    var sql = `DELETE FROM utterances WHERE id = '${requests.id}'`;
    database.query(sql, function (error, results, fields) {
        if (error) throw error;
        callback({
            "status" : "success",
        })
    }
    );
}

function deleteanswer(callback , requests){
    var sql = `DELETE FROM answers WHERE id = '${requests.id}'`;
    database.query(sql, function (error, results, fields) {
        if (error) throw error;
        callback({
            "status" : "success",
        })
    }
    );
}



module.exports = {
                    checkadmin , 
                    get_trained , 
                    add_chatbotmsg  , 
                    addAnswers ,addIntents, 
                    addDomains , 
                    addUtterances , 
                    updateadmin , 
                    getAllMessage , 
                    getTrainedData , 
                    getDomain , 
                    getIntent , 
                    getEntities ,
                    deletedomain ,
                    deleteintent ,
                    deleteutterance ,
                    deleteanswer,
                    getMessage
                };

