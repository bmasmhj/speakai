const express = require("express");
const user = express.Router();
const { getAllUsers , getOneUser , editUsers , deleteUsers } = require("./user.controller");
const validateToken = require("../middlewares/validateToken");


user.get("/", validateToken , getAllUsers);
user.get("/getone/:id", validateToken , getOneUser);
user.post("/edit/:id" , validateToken , editUsers);
user.post("/deleteuser/:id" , validateToken , deleteUsers);



module.exports = { user };