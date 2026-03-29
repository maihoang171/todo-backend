import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { sendError } from "../utils/response.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = (err as any).statusCode || 500;
  let message = err.message || "Internal server error";
  let details;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Zod error";
    details = err.issues.map((e) => ({
      field: e.path[0],
      message: e.message,
    }));
  }

  sendError(res, statusCode, message, details);
};
