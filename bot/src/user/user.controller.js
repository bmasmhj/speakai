const botService = require("./user.service");
const { HttpException } = require('../errors/HttpException.js');

function check(result) {
    if (result == 'err') {
        return new HttpException(500, 'Internal Error');
    }
    return result;
}

const getAllUsers = (req, res, next) => {
    botService.getAllUsers(function (result) { 
       res.send(check(result));
    })
}

const getOneUser = (req, res, next) => {
    botService.getOneUser(function (result) {
        res.send(check(result));
    } , req.params)
}


const editUsers = (req, res, next) => {
    botService.editUsers(function (result) {
        res.send(check(result));
    } , req.body , req.params)
}


const deleteUsers = (req, res, next) => {
    botService.deleteUsers(function (result) {
        res.send(check(result));
    } , req.params.id)
}





module.exports = {
    getAllUsers,
    editUsers,
    deleteUsers,
    getOneUser
}
