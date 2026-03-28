import type { NextFunction, Request, Response } from "express";
import {
  createTaskService,
  getTasksService,
} from "../services/task-service.js";
import { createTaskSchema } from "../schemas/task-schema.js";

export const createTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = createTaskSchema.parse(req.body);
    const newTask = await createTaskService(validatedData);

    res.status(200).json({
      message: "success",
      data: newTask,
    });
  } catch (error) {
    next(error);
  }
};

export const getTasksController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tasks = await getTasksService();

    res.status(200).json({
      message: "success",
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};
