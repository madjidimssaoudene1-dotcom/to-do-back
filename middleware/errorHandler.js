import { StatusCodes } from "http-status-codes";
import { logger } from "../config/logger.js";
import { errorResponse } from "../utils/responseFormatter.js";

/**
 * Global error handling middleware
 * Must be placed after all routes
 */
export function errorHandler(err, req, res, next) {
  // Log error
  logger.error("Error occurred", {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Operational errors (AppError instances)
  if (err instanceof Error && err.statusCode) {
    return errorResponse(res, err, err.message, err.statusCode);
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    const validationErrors = Object.values(err.errors).map((e) => e.message);
    return errorResponse(
      res,
      validationErrors.join(", "),
      "Validation error",
      StatusCodes.BAD_REQUEST,
    );
  }

  // Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return errorResponse(
      res,
      err,
      `Duplicate value for ${field}`,
      StatusCodes.CONFLICT,
    );
  }

  // Mongoose cast errors (invalid ObjectId)
  if (err.name === "CastError") {
    return errorResponse(
      res,
      err,
      `Invalid ${err.path}: ${err.value}`,
      StatusCodes.BAD_REQUEST,
    );
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return errorResponse(res, err, "Invalid token", StatusCodes.UNAUTHORIZED);
  }

  if (err.name === "TokenExpiredError") {
    return errorResponse(res, err, "Token expired", StatusCodes.UNAUTHORIZED);
  }

  // Default to 500 server error
  const message =
    process.env.NODE_ENV === "development"
      ? err.message
      : "Internal server error";
  const error =
    process.env.NODE_ENV === "development"
      ? { message: err.message, stack: err.stack }
      : err.message;
  errorResponse(res, error, message, StatusCodes.INTERNAL_SERVER_ERROR);
}

/**
 * Not found middleware
 */
export function notFoundHandler(req, res) {
  errorResponse(
    res,
    null,
    `Route ${req.originalUrl} not found`,
    StatusCodes.NOT_FOUND,
  );
}
