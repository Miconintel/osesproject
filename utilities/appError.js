class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;

// operational errors are errors that we cretaed ourselves incasae of a user's problem, why the other ones that are caught at the catch async are not operational, they might be errors ffrom mingoose