class HttpException extends Error {
  constructor(statusCode, message) {
    super(message);
      this.statusCode = statusCode;
      this.status = 'error';
      this.errors = message;
  }
}

module.exports = {
    HttpException : HttpException
}