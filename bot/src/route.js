const express = require('express');
const router = express.Router();
const {database} = require('./database.js');
const jwt  = require('jsonwebtoken');
const { bot } = require('./bot/bot.route.js');
const { login } = require('./authenication/admin_login.js');
const { user } = require('./user/user.route.js');
router.post('/v1/login', (req, res) => {
    const moredetails = {
        access_picture :  "https://chat.bimash.com.np/assets/images/default4.jpg ",
        source : "google",
        status : 1,
        code : 0,
        access_password : 'default',

    }
    database.query(`SELECT * FROM users
    WHERE access_email = '${req.body.access_email}' AND uid = '${req.body.user_id}'`, function (err, result) {
        console.log(result);
        if (err) throw err;
        if(result.length > 0){
            var token = createJWT(req.body);
            res.json({
                status  : "success",
                token: token
            });
        }else{
            database.query(`
            INSERT INTO users 
            (uid, access_email, access_name , access_picture , source ,  code , access_password , status ) VALUES 
            ('${req.body.user_id}', '${req.body.access_email}', '${req.body.access_name}' , '${moredetails.access_picture}' , '${moredetails.source}' , '${moredetails.code}' , '${moredetails.access_password}' , '${moredetails.status}')`
            , function (err, result) {
                if (err) throw err;
                var token = createJWT(req.body);
                res.json({
                    status  : "success",
                    token: token
                });
            });
        }
    });
});

router.get('/v1/overal' , (req , res) => {
    let overal = {
        "user" : 0,
        "domains" : 0,
        "intents" : 0,
        "utterances" : 0,
        "answers" : 0,
        "messages" : 0,
    }

    const user = `SELECT COUNT(*) AS user FROM users`;
    const domains = `SELECT COUNT(*) AS domains FROM domains`;
    const intents = `SELECT COUNT(*) AS intents FROM intent`;
    const utterances = `SELECT COUNT(*) AS utterances FROM utterances`;
    const answers = `SELECT COUNT(*) AS answers FROM answers`;
    const messages = `SELECT COUNT(*) AS messages FROM chatbot_message`;

    database.query(user, function (err, result) {
        if (err) throw err;
        overal.user = result[0].user;
        database.query(domains, function (err, result) {
            if (err) throw err;
            overal.domains = result[0].domains;
            database.query(intents, function (err, result) {
                if (err) throw err;
                overal.intents = result[0].intents;
                database.query(utterances, function (err, result) {
                    if (err) throw err;
                    overal.utterances = result[0].utterances;
                    database.query(answers, function (err, result) {
                        if (err) throw err;
                        overal.answers = result[0].answers;
                        database.query(messages, function (err, result) {
                            if (err) throw err;
                            overal.messages = result[0].messages;
                            res.json(overal);
                        });
                    });
                });
            });
        });
    });
}
)

router.post('/v1/adminlogin', login );

router.use('/v1/bot' , bot );
router.use('/v1/user', user );

function createJWT(data){
    var token = jwt.sign(data, process.env.JWT_SECRET);
    return token;
}


module.exports = router;