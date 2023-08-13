const botService = require("./bot.service");
const { HttpException } = require('../errors/HttpException.js');

function check(result) {
    if (result == 'err') {
        return new HttpException(500, 'Internal Error');
    }
    return result;
}


const getAll = (req, res, next) => {
    botService.getbot(function (result) { 
       res.send(check(result));
    })
}

const getAllMessage = (req, res, next) => {
    botService.getAllMessage(function (result) {
        res.send(check(result));
    })
}
const getMessage = (req, res, next) => {
    botService.getMessage(function (result) {
        res.send(check(result));
    } , req.params)
}

const getDomain = (req, res, next) => {
    botService.getDomain(function (result) {
        res.send(check(result));
    })
}

const getIntent = (req, res, next) => {
    botService.getIntent(function (result) {
        res.send(check(result));
    })
}

const getTrainedData = (req, res, next) => {
    botService.getTrainedData(function (result) {
        res.send(check(result));
    } , req.body )
}

const getEntities = (req, res, next) => {
    botService.getEntities(function (result) {
        res.send(check(result));
    } , req.body )
}

const addintents = (req, res, next) => {
    botService.addIntents(function (result) {
        res.send(check(result));
    } , req.body )
}



const adddomain = (req, res, next) => {
    botService.addDomains(function (result) {
        res.send(check(result));
    } , req.body )
}

const addUtterances = (req, res, next) => {
    botService.addUtterances(function (result) {
        res.send(check(result));
    } , req.body )
}

const addAnswers = (req, res, next) => {
    botService.addAnswers(function (result) {
        res.send(check(result));
    } , req.body )
}


const deleteDomain = (req, res, next) => {
    botService.deletedomain(function (result) {
        res.send(check(result));
    } , req.params )
}

const deleteIntent = (req, res, next) => {
    botService.deleteintent(function (result) {
        res.send(check(result));
    } , req.params )
}

const deleteUtterance = (req, res, next) => {
    botService.deleteutterance(function (result) {
        res.send(check(result));
    } , req.params )
}

const deleteAnswer = (req, res, next) => {
    botService.deleteanswer(function (result) {
        res.send(check(result));
    } , req.params )
}




module.exports = { getAll ,
                    getAllMessage ,
                     getDomain ,
                     getIntent ,
                     getTrainedData ,
                     getEntities ,
                     addintents ,
                     adddomain ,
                     addUtterances ,
                     addAnswers,
                    deleteDomain ,
                    deleteIntent ,
                    deleteUtterance ,
                    deleteAnswer,
                    getMessage

                    };