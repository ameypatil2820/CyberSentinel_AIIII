/**
 * Standardized API Response class to wrap successful responses
 * with a consistent JSON structure.
 */
class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code (typically < 400)
   * @param {any} data - The payload or data to return to the client
   * @param {string} [message="Success"] - A human-readable message description
   */
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

/**
 * Standard helper to send general successful response (200 OK by default)
 */
const sendSuccess = (res, data, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
};

/**
 * Standard helper to send response for created resources (201 Created)
 */
const sendCreated = (res, data, message = "Resource created successfully") => {
  return sendSuccess(res, data, message, 201);
};

/**
 * Standard helper to send paginated responses
 */
const sendPaginated = (res, data, page, limit, totalItems, message = "Fetched successfully") => {
  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit) || 10;
  const totalPages = Math.ceil(totalItems / currentLimit);

  return res.status(200).json({
    success: true,
    statusCode: 200,
    message,
    data,
    pagination: {
      currentPage,
      limit: currentLimit,
      totalPages,
      totalItems,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
  });
};

export default ApiResponse;
export { ApiResponse, sendSuccess, sendCreated, sendPaginated };
