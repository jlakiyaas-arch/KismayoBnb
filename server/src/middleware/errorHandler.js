import { ApiError } from '../utils/ApiError.js';

const handleCastError = (err) =>
  new ApiError(400, `Invalid ${err.path}: ${err.value}`);

const handleDuplicateKey = (err) => {
  const field = Object.keys(err.keyValue || {})[0] || 'field';
  return new ApiError(409, `${field} already exists`);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors || {}).map((e) => ({
    path: e.path,
    message: e.message,
  }));
  return new ApiError(400, 'Validation failed', errors);
};

const handleJWTError = () => new ApiError(401, 'Invalid token. Please log in again.');

const handleJWTExpired = () =>
  new ApiError(401, 'Token expired. Please log in again.');

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    if (error.name === 'CastError') error = handleCastError(error);
    else if (error.code === 11000) error = handleDuplicateKey(error);
    else if (error.name === 'ValidationError') error = handleValidationError(error);
    else if (error.name === 'JsonWebTokenError') error = handleJWTError();
    else if (error.name === 'TokenExpiredError') error = handleJWTExpired();
    else if (error.name === 'ZodError') {
      error = new ApiError(
        400,
        'Validation failed',
        error.errors.map((e) => ({ path: e.path.join('.'), message: e.message }))
      );
    } else {
      error = new ApiError(500, error.message || 'Internal server error');
    }
  }

  const statusCode = error.statusCode || 500;
  const response = {
    success: false,
    message: error.message || 'Internal server error',
  };

  if (error.errors) response.errors = error.errors;

  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};
