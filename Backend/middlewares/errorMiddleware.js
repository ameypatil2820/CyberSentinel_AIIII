import ApiError from "../utils/ApiError.js";

/**
 * Global Error Handling Middleware for Express.
 * Intercepts all unhandled errors or errors thrown in routes,
 * formats them consistently, and handles MongoDB/Mongoose specific errors.
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // 1. Check if the error is not an instance of the custom ApiError class
  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || (error.status ? error.status : 500);
    let message = error.message || "Internal Server Error";

    // Handle Mongoose CastError (e.g. Invalid ObjectID)
    if (error.name === "CastError") {
      statusCode = 400;
      message = `Invalid ${error.path}: ${error.value}`;
    }

    // Handle Mongoose ValidationError
    else if (error.name === "ValidationError") {
      statusCode = 400;
      // Extract validation messages
      const messages = Object.values(error.errors).map((val) => val.message);
      message = `Validation failed: ${messages.join(", ")}`;
      error.errors = error.errors; // Preserve original detailed validation object
    }

    // Handle Mongoose/MongoDB duplicate key error (code 11000)
    else if (error.code === 11000) {
      statusCode = 409;
      // Extract the duplicate field name
      const field = Object.keys(error.keyValue || {}).join(", ");
      message = `Duplicate field value entered: ${field}. Please use another value.`;
    }

    // Instantiate ApiError with extracted details
    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  // 2. Format the response payload
  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };

  // 3. Send response
  return res.status(error.statusCode).json(response);
};

export default errorHandler;
