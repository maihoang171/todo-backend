import prisma from "../lib/prisma.js";
import type {
  createTaskInput,
  updateTaskInput,
} from "../schemas/task-schema.js";

export const createTaskService = async (data: createTaskInput) => {
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
    where: {
      deletedAt: null,
    },
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

export const updateTaskService = async (
  id: string,
  updateTask: updateTaskInput,
) => {
  const cleanData = Object.fromEntries(
    Object.entries(updateTask).filter(([_, v]) => v !== undefined),
  );

  return await prisma.task.update({
    where: { id },
    data: cleanData,
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

export const deleteTaskService = (id: string) => {
  return prisma.task.update({
    where: { id },
    data: { deletedAt: new Date() },
    select:{
      id: true,
      title: true,
    }
  });
};
