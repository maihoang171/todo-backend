import prisma from "../lib/prisma.js";
import type { CreateTaskInput } from "../schemas/task-schema.js";

const createTaskService = async (data: CreateTaskInput) => {
  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      deadlineAt: data.deadlineAt,
    },
    select: {
      title: true,
      description: true,
      deadlineAt: true,
      createdAt: true,
    },
  });
  return task;
};

export default createTaskService;
