import { it, expect, vi, describe } from "vitest";
import express, { response } from "express";
import request from "supertest";
import createTaskService from "../services/task-service.js";
import { createTaskController } from "./task-controller.js";

vi.mock("../services/task-service", () => ({
  default: vi.fn(),
}));

const app = express();
app.use(express.json());
app.post("/task", createTaskController);

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
