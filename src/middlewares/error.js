const httpStatus = require('http-status');

/* eslint-disable no-unused-vars */
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (!err.isOperational) {
    statusCode = httpStatus.default.INTERNAL_SERVER_ERROR;
    message = message || httpStatus.default['500'];

    /* eslint-disable no-console */
    console.error(err);
  }

  const response = {
    status: statusCode,
    error: message,
  };

  res.status(statusCode).json(response);
};

module.exports = {
  errorHandler,
};
