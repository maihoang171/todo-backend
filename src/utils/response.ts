import type { Response } from "express";
import type { ApiResponse } from "../type/api.js";

export const sendSuccess = <T>(res: Response, statusCode: number, data: T) => {
  const payload: ApiResponse<T> = {
    success: true,
    data,
  };
  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  details?: any[],
) => {
  const payload: ApiResponse<null> = {
    success: false,
    message,
    ...(details && { details }),
  };
  return res.status(statusCode).json(payload);
};
