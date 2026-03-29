import express from "express";
import {
  createTaskController,
  deleteTaskController,
  getTasksController,
  updateTaskController,
} from "../controller/task-controller.js";

const taskRouter = express.Router();

taskRouter.post("", createTaskController);
taskRouter.get("", getTasksController);
taskRouter.patch("/:id", updateTaskController);
taskRouter.delete("/:id", deleteTaskController);

export default taskRouter;
