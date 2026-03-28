import type { Request, Response } from "express";
import { ZodError } from "zod";

export const errorHandler = (err: Error, req: Request, res: Response) => {
  let statusCode = (err as any).statusCode || 500;
  let message = err.message || "Internal server error";

  if (err instanceof ZodError) {
    statusCode = 400;
    return res.status(statusCode).json({
      status: "error",
      details: err.issues.map((e) => ({
        field: e.path[0],
        message: e.message,
      })),
    });
  }

  res.status(statusCode).json({
    status: "error",
    message: message,
  });
};
