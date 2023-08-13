const { decode } = require('../utils/encryption.js');
const NotAuthorized = require('../errors/NotAuthorized.js');
const { database } = require('../database.js');
module.exports = async (req, res, next) => {
  let token;

  if (req.headers['authorization']) {
    token = req.headers['authorization'];
  }

  if (!token) {
    return next(new NotAuthorized());
  }

  try {
    if (!token.startsWith('Bearer')) {
      return next(new NotAuthorized());
    }
    token = token.split(' ')[1];
    const decoded = decode(token);
    req.user = decoded;
    if (req.user.user_id == null ||  
        req.user.user_id == undefined ||
        req.user.user_id == '' ||
        req.user.email == null ||
        req.user.email == undefined ||  
        req.user.email == '' ||
        req.user.name == null ||
        req.user.name == undefined ||  
        req.user.name == '' ||
        req.user.picture == null ||
        req.user.picture == undefined ||  
        req.user.picture == '' ||
        req.user.token == null ||
        req.user.token == undefined ||
        req.user.token == ''
      ) {
      return next(new NotAuthorized());
    }else{
      const email = req.user.email;
      const user_id = req.user.user_id;
      const token = req.user.token;
      const select = `SELECT * FROM admin WHERE 
      username = ? AND 
      email = ? AND 
      password = ?
      `;
      database.query(select, [user_id , email , token], function (err, result) {
        if (err){ console.log(err) ; return ; }
        if (result.length > 0) {
         next();
        }else{
          return next(new NotAuthorized());
        }
      });
    }
  } catch (err) {
    return next(new NotAuthorized());
  }
};
