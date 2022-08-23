const AppError = require('../utilities/appError');

const handleCastErrorDb = (err) => {
  const message = `we cannot find the ${err.path} ${err.value} ${err.name}`;
  return new AppError(message, 500);
};
const handleDuplicateFieldDb = (err) => {
  // this is a regular expression for matchimg words
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  // console.log(value);
  const message = `Duplicate field value`;
  return new AppError(message, 500);
};
const handleValidationErrorDb = (err) => {
  // this is a regular expression for matchimg words
  const mainErrors = Object.values(err.errors).map((el) => el.message);
  const message = `validation error check and validate the following ${mainErrors.join(
    '. '
  )}`;
  return new AppError(message, 500);
};
const handleJwtError = (err) => {
  // this is a regular expression for matchimg words

  const message = `wt error invalid token, ${err.name}`;
  return new AppError(message, 401);
};
const handleJwtExpired = (err) => {
  // this is a regular expression for matchimg words

  const message = `wt error expired, ${err.name}`;
  return new AppError(message, 401);
};

const sendErrorDev = (err, request, response) => {
  if (request.originalUrl.startsWith('/api')) {
    return response.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // it is a good prctice to remove the else
    console.error(`error ${err} ${err.message}`);
    return response.status(err.statusCode).render('error', {
      title: 'something went wrong',
      msg: err.message,
    });
  }
};
const sendErrorProd = (err, request, response) => {
  // if api in production
  if (request.originalUrl.startsWith('/api')) {
    // if we know whatte problem is
    if (err.isOperational) {
      return response.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // you can remove this else or not
      // if we dont know what thw problem is
      console.error(`error  ${err.message}`);
      return response.status(500).json({
        status: 'fail',
        message: 'something went very wrong here',
        error: err,
      });
    }
  }else{
    if (err.isOperational) {
      console.log(err);
      return response.status(err.statusCode).render('error', {
        title: 'something went wrong',
        msg: err.message,
      });
    } else {
      // if we dont know what thw problem is
      console.log(err);
      return response.status(err.statusCode).render('error', {
        title: 'something went wrong',
        msg: 'please try again something went wrong',
      });
    }
  }

};

module.exports = (err, request, response, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  // response.status(err.statusCode).json({
  //   status: err.status,
  //   error: err,
  //   message: err.message,
  //   stack: err.stack,
  // });
  const prod = process.env.NODE_ENV.trim();
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, request, response);
  } else if (prod === 'production') {
    // I finally fixed this bug of roduction, understand that the spave after production in package .jso before the & sign makes node env to also add the space after the word prodction so uave to add it to your if statement too or remove te space on package.json with te awkward appearance of te and clse to te word production
    // solution2 trim it and save in a vraiable and then use afterwards
    console.log(process.env.NODE_ENV);
    // let error = Object.create(err); I didnot use this because I didnot want to create a whole new object that night reuire other variables I dinot use the error from spread too because it does not have the name property due to spread function, I simply used it to create a shallo copy and later overwrie as to collect the new error to be that will be coing fromcast error handler.
    // let error = Object.create(err);
    let error = { ...err };
    // because this error did not copy the prototype, we have to manually assign the message to it also we avoided sin obect .create
    error.message = err.message;
    if (err.name === 'CastError') error = handleCastErrorDb(err);
    if (err.code === 11000) error = handleDuplicateFieldDb(err);
    if (err.name === 'ValidationError')
      error = handleValidationErrorDb(err);
    if (err.name === 'JsonWebTokenError') error = handleJwtError(err);
    if (err.name === 'TokenExpiredError') error = handleJwtExpired(err);

    sendErrorProd(error, request, response);
  }
  next();
};
