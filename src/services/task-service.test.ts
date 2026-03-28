import { it, expect, vi } from "vitest";
import createTaskService from "./task-service.js";
import prisma from "../lib/prisma.js";

vi.mock("../lib/prisma.ts", () => ({
  default: {
    task: {
      create: vi.fn(),
    },
  },
}));

it("should send the correct data to Prisma and return the result", async () => {
  const input = { title: "test", deadlineAt: new Date() };
  await createTaskService(input);

  expect(prisma.task.create).toHaveBeenCalledWith({
    data: expect.objectContaining({
      title: "test",
    }),
    select: expect.any(Object),
  });
});
