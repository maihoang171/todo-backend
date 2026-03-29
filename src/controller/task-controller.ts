import type { NextFunction, Request, Response } from "express";
import {
  createTaskService,
  deleteTaskService,
  getTasksService,
  updateTaskService,
} from "../services/task-service.js";
import {
  createTaskSchema,
  idSchema,
  updateTaskSchema,
} from "../schemas/task-schema.js";
import { sendSuccess } from "../utils/response.js";

export const createTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = createTaskSchema.parse(req.body);
    const newTask = await createTaskService(validatedData);
    sendSuccess(res, 200, newTask);
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

    sendSuccess(res, 200, tasks);
  } catch (error) {
    next(error);
  }
};

export const updateTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = idSchema.parse(req.params.id);
    const validatedData = updateTaskSchema.parse(req.body);
    const updateTask = await updateTaskService(id, validatedData);

    sendSuccess(res, 200, updateTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = idSchema.parse(req.params.id);

    const deletedTask = await deleteTaskService(id);
    sendSuccess(res, 200, deletedTask);
  } catch (error) {
    next(error);
  }
};
