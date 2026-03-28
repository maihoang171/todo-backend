import express from "express";
import { createTaskController } from "../controller/task-controller.js";

const taskRouter = express.Router();
taskRouter.post("", createTaskController);

export default taskRouter;
