import { it, expect, vi, describe } from "vitest";
import {
  createTaskService,
  deleteTaskService,
  getTasksService,
  updateTaskService,
} from "./task-service.js";
import prisma from "../lib/prisma.js";
import { mock } from "node:test";
vi.mock("../lib/prisma.ts", () => ({
  default: {
    task: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
  },
}));

it("should send the correct data to Prisma and return the new task", async () => {
  const mockTask = { title: "test", deadlineAt: new Date() };
  vi.mocked(prisma.task.create).mockResolvedValue(mockTask as any);

  const result = await createTaskService(mockTask);

  expect(result).toEqual(mockTask);
});

it("should return the task list", async () => {
  const mockTasks = [
    {
      id: "ba5715d5-4b10-4fc3-9406-e23e4a53a38b",
      title: "test1",
      status: "PENDING",
      deadlineAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2fabd321-9b7f-4070-8c8c-0ea7c541ae58",
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

describe("updateTaskService", () => {
  it("should clean data and return update task", async () => {
    const mockId = "ba5715d5-4b10-4fc3-9406-e23e4a53a38b";

    const rawInput = {
      title: "clean input",
      description: undefined,
    };

    const mockTaskResponse = {
      id: mockId,
      title: "clean input",
      description: "hello",
      status: "PENDING",
      deadlineAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.task.update).mockResolvedValue(mockTaskResponse as any);

    const result = await updateTaskService(mockId, rawInput);

    expect(result).toEqual(mockTaskResponse);
    expect(prisma.task.update).toHaveBeenCalledWith({
      where: { id: mockId },
      data: {
        title: "clean input",
      },
      select: {
        id: true,
        title: true,
        status: true,
        deadlineAt: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });
});

it("should update the deletedAt and return the deleted task", async () => {
  const mockId = "ba5715d5-4b10-4fc3-9406-e23e4a53a38b";
  const mockTaskResponse = {
    id: mockId,
    title: "delete test",
  };
  vi.mocked(prisma.task.update).mockResolvedValue(mockTaskResponse as any);

  const result = await deleteTaskService(mockId);

  expect(result).toEqual(mockTaskResponse);
  expect(prisma.task.update).toHaveBeenCalledWith({
    where: { id: mockId },
    data: { deletedAt: new Date() },
    select: {
      id: true,
      title: true,
    },
  });
});
