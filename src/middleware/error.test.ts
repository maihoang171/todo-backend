import { describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import { errorHandler } from "./error.js";

describe("errorHandler", () => {
  it("should return 400 and structured details when error is an instance of ZodError", () => {
    const mockZodError = new ZodError([
      {
        code: "invalid_type",
        expected: "string",
        path: ["title"],
        message: "Title is required",
      },
    ]);

    const req = {} as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    errorHandler(mockZodError, req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 500 and default message when an unknown error occurs", () => {
    const err = new Error();

    const req = {} as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;

    errorHandler(err, req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "Internal server error",
    });
  });
});
