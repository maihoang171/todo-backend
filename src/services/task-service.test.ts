import { it, expect, vi } from "vitest";
import { createTaskService, getTasksService } from "./task-service.js";
import prisma from "../lib/prisma.js";

vi.mock("../lib/prisma.ts", () => ({
  default: {
    task: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

it("should send the correct data to Prisma and return the result", async () => {
  const mockTask = { title: "test", deadlineAt: new Date() };
  vi.mocked(prisma.task.create).mockResolvedValue(mockTask as any);

  const result = await createTaskService(mockTask);

  expect(result).toEqual(mockTask);
});

it("should return the task list", async () => {
  const mockTasks = [
    {
      id: 1,
      title: "test1",
      status: "PENDING",
      deadlineAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      title: "test2",
      status: "PENDING",
      deadlineAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  vi.mocked(prisma.task.findMany).mockResolvedValue(mockTasks as any);

  const result = await getTasksService();
  expect(result).toEqual(mockTasks);
});
