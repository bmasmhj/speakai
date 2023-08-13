const express = require("express");
const admin = express.Router();
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('dotenv').config();
const { HttpException } = require('../../errors/HttpException.js');
const { connection } = require("../../database/connection");
const validateToken = require("../../middlewares/validateToken");
const multer = require('multer');
const { addtracking } = require("../../middlewares/tracker");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/logo'); // specify the destination folder for uploaded images
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname+'.png');
  }
});

const getAdmin = (req, res, next) => {
    const select = `SELECT * FROM admin`;
    connection.query(select, function (err, result) {
        if (err){ console.log(err) ; return ; }
        if (result.length > 0) {
            res.send(result);
        }else{
            res.send(new HttpException(500, 'Internal Error'));
        }
    }
    );
}

const getSingleAdmin = (req, res, next) => {

    const select = `SELECT * FROM admin WHERE username = '${req.params.user}'`;
    connection.query(select, function (err, result) {
        if (err){ console.log(err) ; return ; }
        if (result.length > 0) {
            res.send(result[0]);
        }else{
            res.send(new HttpException(500, 'Internal Error'));
        }
    }
    );
}

const upload = multer({ storage });


const updatelogo = (req, res, next) => {
    console.log('logo')
    upload.single('user')(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.log(err);
        return next(new HttpException(400, 'File upload error: ' + err.message));
      } else if (err) {
        console.log(err);
        return next(new HttpException(400, 'File upload error: ' + err));
      }
      const { filename } = req.file;
      const imageUrl = `${process.env.ASSETS_URL}/logo/${filename}`;
      
      addtracking('user' , `Profile picture was updated` , 'success')
      res.send({ 
          "status": "success",
          imageUrl
       });
    });
  };

  
const changepassword = async (req, res, next) => {
    const requests = req.body;
    const pass= requests.oldpassword
    const newpass = requests.newpassword;
    const username = requests.username;
    try {
        var sql = `SELECT * FROM admin WHERE username = '${username}'`;
        connection.query(sql, function (err, result) {
            if (err) {
                next(new HttpException(500, err));
                return;
            }
            if (result.length > 0) {
                bcrypt.compare(pass, result[0].password, function(err, verify) {
                    if (verify) {
                        const encrypted = bcrypt.hashSync(newpass, 10);
                        const send_res = get_final_res( 
                            result[0].username , 
                            result[0].fullname , 
                            result[0].email , 
                            result[0].image,
                            encrypted,
                            stat = 'password_changed'
                        );
                        var sql = `UPDATE admin SET password = '${encrypted}' WHERE username = '${username}'`;
                        connection.query(sql, function (err, result) {
                            if (err) {
                                next(new HttpException(500, err));
                                return;
                            }
                            res.send(send_res);
                        }
                        );
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
    }
}

const changename = async (req, res, next) => {
    const requests = req.body;
    const name= requests.fullname
    const username = requests.username;
    try {
        var sql = `SELECT * FROM admin WHERE username = '${username}'`;
        connection.query(sql, function (err, result) {
            if (err) {
                next(new HttpException(500, err));
                return;
            }
            if (result.length > 0) {
                const send_res = get_final_res(
                    result[0].username ,
                    name,
                    result[0].email ,
                    result[0].image,
                    result[0].password,
                    stat = 'name_changed'
                );    
                var sql = `UPDATE admin SET fullname = '${name}' WHERE username = '${username}'`;
                connection.query(sql, function (err, result) {
                    if (err) {
                        next(new HttpException(500, err));
                        return;
                    }
                    res.send(send_res);
                }
                );
            }else{
                res.json({ 'status': 'unregistered', 'unregistered': username });
            }
        });
    } catch (err) {
        next(err);
    }
}


function get_final_res(user_id , name , email , picture , pw , stat ) {
    const token = jwt.sign({ 
        user_id: user_id,
        name: name,
        email: email,
        picture: picture,
        token : pw
    }, process.env.JWT_SECRET);
    const user_res = {
        'status': stat,
        'user_id': user_id,
        'name':name,
        'email':email,
        'picture':picture,
        'acess_token': token,
    } 
    return user_res
}
admin.get('/:user' , validateToken , getSingleAdmin);
admin.post("/updatelogo", validateToken, updatelogo);
admin.post("/changepassword", validateToken, changepassword);
admin.post("/changename", validateToken, changename);

module.exports = { admin };