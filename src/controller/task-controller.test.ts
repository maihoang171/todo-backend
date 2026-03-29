import { it, expect, vi, describe } from "vitest";
import express from "express";
import request from "supertest";
import {
  createTaskService,
  getTasksService,
  updateTaskService,
  deleteTaskService,
} from "../services/task-service.js";

import {
  createTaskController,
  getTasksController,
  updateTaskController,
  deleteTaskController,
} from "./task-controller.js";
import { beforeEach } from "node:test";
import { errorHandler } from "../middleware/error.js";

vi.mock("../services/task-service", () => ({
  createTaskService: vi.fn(),
  getTasksService: vi.fn(),
  updateTaskService: vi.fn(),
  deleteTaskService: vi.fn()
}));

const app = express();
app.use(express.json());
app.post("/task", createTaskController);
app.get("/task", getTasksController);
app.patch("/task/:id", updateTaskController);
app.delete("/task/:id", deleteTaskController);
app.use(errorHandler);

describe("createTaskController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
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
    expect(response.body.data).toEqual(mockTask);
  });

  it("should return 400 with ZodError when data is invalid", async () => {
    const invalidInput = {
      title: "",
      deadlineAt: "2025-12-01", //day in the past
    };

    const response = await request(app).post("/task").send(invalidInput);

    expect(response.statusCode).toBe(400);
  });
});

describe("getTasksService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should return 200, response message and the task list on success", async () => {
    const mockTasks = [
      {
        id: "2fabd321-9b7f-4070-8c8c-0ea7c541ae58",
        title: "test1",
        status: "PENDING",
        deadlineAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "ba5715d5-4b10-4fc3-9406-e23e4a53a38b",
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
    const fakeError = new Error("Database connection lost");

    vi.mocked(getTasksService).mockRejectedValue(fakeError);

    const response = await request(app).get("/task");

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe(fakeError.message);
  });
});

describe("updateTaskController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 200 and the update task on success", async () => {
    const mockTaskInput = {
      title: "test2",
    };

    const mockTaskResponse = {
      id: "a844cbaf-9d69-45f1-a5df-30378260a064",
      title: "test2",
      status: "PENDING",
      deadlineAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    vi.mocked(updateTaskService).mockResolvedValue(mockTaskResponse as any);

    const response = await request(app)
      .patch("/task/a844cbaf-9d69-45f1-a5df-30378260a064")
      .send(mockTaskInput);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqual(mockTaskResponse);
  });

  it("should return 400 with ZodError when data is invalid", async () => {
    const invalidData = {};

    const response = await request(app)
      .patch("/task/a844cbaf-9d69-45f1-a5df-30378260a064")
      .send(invalidData);

    expect(response.statusCode).toBe(400);
  });

  it("should return 500 with an unknown error occurs", async () => {
    const fakeError = new Error("Internal server error");

    vi.mocked(updateTaskService).mockRejectedValue(fakeError);

    const mockTask = {
      title: "test",
    };

    const response = await request(app)
      .patch("/task/a844cbaf-9d69-45f1-a5df-30378260a064")
      .send(mockTask);

    expect(response.statusCode).toBe(500);
  });
});

describe("deleteTaskController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 200 and the deleted task", async () => {
    const mockId = "a844cbaf-9d69-45f1-a5df-30378260a064";

    const mockResponse = {
      id: mockId,
      title: "delete test",
    };

    vi.mocked(deleteTaskService).mockResolvedValue(mockResponse as any)
    const res = await request(app).delete(`/task/${mockId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual(mockResponse);
  });

  it("should return 400 with zod error", async () => {
    const fakeError = new Error("Zod error")
    const badId = "12"

    vi.mocked(deleteTaskService).mockRejectedValue(fakeError)

    const result = await request(app).delete(`/task/${badId}`)
    expect(result.statusCode).toBe(400)
  })

  it("should return 500 with an unknown error occurs", async() => {
    const fakeError = new Error()
    const mockId = "a844cbaf-9d69-45f1-a5df-30378260a064";

    vi.mocked(deleteTaskService).mockRejectedValue(fakeError)

     const result = await request(app).delete(`/task/${mockId}`)
    expect(result.statusCode).toBe(500)
    expect(result.body.message).toBe("Internal server error")
  })
});
