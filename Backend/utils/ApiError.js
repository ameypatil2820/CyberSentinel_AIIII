/**
 * Custom Error class to handle API-specific errors with HTTP status codes
 * and structured error details.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g., 400, 404, 401, 500)
   * @param {string} message - Error message summary
   * @param {Array|object} [errors=[]] - Array or object containing detailed validation errors
   * @param {string} [stack=""] - Custom stack trace (optional)
   */
  constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Throws a 400 Bad Request error.
 */
const throwBadRequest = (message = "Bad Request", errors = []) => {
  throw new ApiError(400, message, errors);
};

/**
 * Throws a 401 Unauthorized error.
 */
const throwUnauthorized = (message = "Unauthorized access") => {
  throw new ApiError(401, message);
};

/**
 * Throws a 403 Forbidden error.
 */
const throwForbidden = (message = "Forbidden access") => {
  throw new ApiError(403, message);
};

/**
 * Throws a 404 Not Found error.
 */
const throwNotFound = (message = "Resource not found") => {
  throw new ApiError(404, message);
};

/**
 * Throws a 500 Internal Server error.
 */
const throwInternal = (message = "Internal server error") => {
  throw new ApiError(500, message);
};

export default ApiError;
export {
  ApiError,
  throwBadRequest,
  throwUnauthorized,
  throwForbidden,
  throwNotFound,
  throwInternal,
};
