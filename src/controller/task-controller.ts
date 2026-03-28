import type { NextFunction, Request, Response } from "express";
import createTaskService from "../services/task-service.js";
import { createTaskSchema } from "../schemas/task-schema.js";

export const createTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = createTaskSchema.parse(req.body);
    const result = await createTaskService(validatedData);

    res.status(200).json({
      message: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
