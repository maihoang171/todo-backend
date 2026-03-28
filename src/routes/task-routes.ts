import express from "express";
import { createTaskController, getTasksController } from "../controller/task-controller.js";

const taskRouter = express.Router();
taskRouter.post("", createTaskController);
taskRouter.get("", getTasksController)

export default taskRouter;
