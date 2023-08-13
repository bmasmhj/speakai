const express = require("express");
const bot = express.Router();
const { getAll , getMessage , getEntities , getAllMessage , getTrainedData , getDomain , getIntent , addAnswers , addUtterances , adddomain , addintents , deleteAnswer , deleteDomain , deleteIntent , deleteUtterance } = require("./bot.controller");
const validateToken = require("../middlewares/validateToken");


bot.get("/", getAll);

bot.get("/allchats", validateToken , getAllMessage);
bot.get("/chat/:id", getMessage);

bot.get("/intents" , getIntent);
bot.get("/domains" , getDomain);
bot.post("/trained" , getTrainedData);
bot.post("/entities" , getEntities);


bot.post("/addintents" , validateToken , addintents);
bot.post("/adddomain" , validateToken , adddomain);
bot.post("/addutterances" , validateToken , addUtterances);
bot.post("/addanswer" , validateToken , addAnswers);


bot.post("/deletedomain/:id" , validateToken , deleteDomain);
bot.post("/deleteintent/:id" , validateToken , deleteIntent);
bot.post("/deleteutterance/:id" , validateToken , deleteUtterance);
bot.post("/deleteanswer/:id" , validateToken , deleteAnswer);



module.exports = { bot };