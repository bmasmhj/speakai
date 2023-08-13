var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { database } = require('../database');
const env = require('dotenv').config();
const login = async (req, res, next) => {
    const requests = req.body;
    // console.log(requests);
    const pass= requests.password
    const username = requests.username;
    try {
        database.query(`SELECT * FROM admin WHERE username = ?`, [username], function (error, results , fields) {
            if (error){
                console.log(error);
                throw error;
            };
            if (results.length > 0) {
                bcrypt.compare(pass, results[0].password, function(err, verify) {
                    if (verify) {
                        if (results[0].code != 0 || results[0].status!=1 ) {
                            res.json({ 'status': 'email_unverified' });
                        }
                        
                        else if (results[0].status == 1 && results[0].code == 0) {
                            const send_res = get_final_res( 
                                results[0].username , 
                                results[0].fullname , 
                                results[0].email , 
                                results[0].image,
                                results[0].password
                                );
                            res.json(send_res);
                        } else {
                            res.json({ 'status': 'server_error' , 'message' : 'Something went wrong' });
                        }
                    }
                    else {
                        res.json({ 'status': 'password_incorrect' });
                    }
                });
            }else{
                res.json({ 'status': 'unregistered', 'unregistered': username });
            }
        });
    } catch (err) {
        next(err);
        console.log(err);
    } 
}


module.exports = {
   login
}



function get_final_res(user_id , name , email , picture , pw ) {
    const token = jwt.sign({ 
        user_id: user_id,
        name: name,
        email: email,
        picture: picture,
        token : pw
    }, process.env.JWT_SECRET);
    const user_res = {
        'status': 'login_verified',
        'user_id': user_id,
        'name':name,
        'email':email,
        'picture':picture,
        'acess_token': token,
    } 
    return user_res
}