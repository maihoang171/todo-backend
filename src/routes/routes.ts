import express from "express";
import taskRouter from "./task-routes.js";

const router = express.Router();

router.use("/task", taskRouter);

export default router;
