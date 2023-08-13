const {database} = require('./database.js');

function getallmychat(callback , user_id ){
    database.query(`SELECT * FROM chatbot_message WHERE user_id = '${user_id}'`, function (err, result) {
        if (err) throw err;
        callback(result);
    });
}

function add_chatbotmsg(user_id, message, type , now_time) {
    let addQuery = "INSERT INTO chatbot_message (user_id , message , type , created_at) VALUES (?,? , ? , ?)";
    let values = [user_id , message , type , now_time]
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
  });
}
function train_to_db(domain_id , intent, utterance, answer) {

    
    // Prepare the INSERT statement for the intent table
     database.query(`SELECT * FROM intent where domain_id = ? AND name = ? `, 
     [domain_id , intent],
     function (error, results , fields) {
        if (error) throw error;
        if (results.length > 0) {
            var intent_id = results[0].id;
            console.log(intent_id);
            save_trained(domain_id , intent_id , utterance , answer);

        }else{
           const intentQuery = "INSERT INTO intent (domain_id, name) VALUES (?, ?)";
            const name = intent;
            database.query(intentQuery, [domain_id, name], function(error, results, fields) {
                if (error) throw error;
                const intent_id = results.insertId;
                // Prepare the INSERT statement for the utterances table
                save_trained(domain_id , intent_id , utterance , answer);
            });
        }
    });

     function save_trained(domain_id , intent_id , utterance , answer) {
        const utteranceQuery = "INSERT INTO utterances (domain_id, intent_id, utterance) VALUES (?, ?, ?)";
        database.query(utteranceQuery, [domain_id, intent_id, utterance], function(error, results, fields) {
            if (error) throw error;
            return results;
        });
        const answerQuery = "INSERT INTO answers (domain_id, intent_id, answer) VALUES (?, ?, ?)";
        database.query(answerQuery, [domain_id, intent_id, answer], function(error, results, fields) {
            if (error) throw error;
            return results;
        });
    }
}

module.exports = {getallmychat , add_chatbotmsg , get_trained , train_to_db};