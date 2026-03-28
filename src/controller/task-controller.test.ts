import { it, expect, vi, describe } from "vitest";
import express from "express";
import request from "supertest";
import {
  createTaskService,
  getTasksService,
} from "../services/task-service.js";
import { createTaskController, getTasksController } from "./task-controller.js";

vi.mock("../services/task-service", () => ({
  createTaskService: vi.fn(),
  getTasksService: vi.fn(),
}));

const app = express();
app.use(express.json());
app.post("/task", createTaskController);
app.get("/task", getTasksController);

describe("createTaskController", () => {
  it("should return statusCode = 200, response the message and the created task on success", async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const futureDateString = tomorrow.toISOString().split("T")[0];

    const mockTask = { id: 1, title: "test", deadlineAt: futureDateString };
    vi.mocked(createTaskService).mockResolvedValue(mockTask as any);

    const response = await request(app)
      .post("/task")
      .send({ title: "test1", deadlineAt: "2026-12-01" });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("success");
    expect(response.body.data).toEqual(mockTask);
  });

  it("should call next with ZodError when data is invalid", async () => {
    const invalidInput = {
      title: "",
      deadlineAt: "2025-12-01",
    };

    const req = { body: invalidInput } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();

    await createTaskController(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});

describe("getTasksService", () => {
  it("should return 200, response message and the task list on success", async () => {
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

    vi.mocked(getTasksService).mockResolvedValue(mockTasks as any);
    const response = await request(app).get("/task");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should call next with unknown error occurs", async () => {
    const err = new Error();

    const req = {} as any;
    const res = { status: vi.fn().mockReturnThis, json: vi.fn() } as any;
    const next = vi.fn();

    await getTasksController(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
