import { StatusCodes } from "http-status-codes";

/**
 * Standard success response formatter
 */
export function successResponse(
  res,
  data,
  message = "Success",
  statusCode = StatusCodes.OK,
  token = "",
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    token,
  });
}

/**
 * Standard error response formatter
 */
export function errorResponse(
  res,
  error,
  message = "Error occurred",
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
) {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error?.message || error,
  });
}

/**
 * Paginated response formatter
 */
export function paginatedResponse(res, data, pagination, message = "Success") {
  return res.status(StatusCodes.OK).json({
    success: true,
    message,
    data,
    pagination,
  });
}

/**
 * No content response
 */
export function noContentResponse(res) {
  return res.status(StatusCodes.NO_CONTENT).send();
}