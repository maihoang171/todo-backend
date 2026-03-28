import prisma from "../lib/prisma.js";
import type { CreateTaskInput } from "../schemas/task-schema.js";

export const createTaskService = async (data: CreateTaskInput) => {
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

export const getTasksService = async () => {
  return await prisma.task.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      deadlineAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
