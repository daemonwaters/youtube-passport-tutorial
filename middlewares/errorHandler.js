function AppError(statusCode, message) {
  Error.call(this);
  Error.captureStackTrace(this);
  this.statusCode = statusCode;
  this.message = message;
}

AppError.prototype = Object.create(Error.prototype);
AppError.prototype.constructor = AppError;

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode ?? 500;
  const message = error.message ?? "Internal Server Error";

  console.error(error);

  return res.status(statusCode).json({
    statusCode,
    message,
  });
};

module.exports = {
  errorHandler,
  AppError,
};
