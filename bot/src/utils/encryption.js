
const jwt = require('jsonwebtoken');

const decode = (token) =>
    jwt.verify(token, process.env.JWT_SECRET);

module.exports = { decode };