const { HttpException } = require('./HttpException.js');

class NotFound extends HttpException {
  constructor() {
    const statusCode = 404;
    const message = 'Route Not Found!';
    super(statusCode, message);
  }
}

module.exports = NotFound;
