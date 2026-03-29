import { describe, it, expect } from "vitest";
import { createTaskSchema, idSchema, updateTaskSchema } from "./task-schema.js";

describe("Create Task Schema Validation", () => {
  it("should pass and transform data if input is valid", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    const validData = {
      title: "Running",
      description: "",
      deadlineAt: dateStr,
    };

    const result = createTaskSchema.parse(validData);

    expect(result.title).toBe("Running");
    expect(result.deadlineAt).toBeInstanceOf(Date);
  });
  it("should fail if the deadline is in the past", () => {
    const pastDate = "2025-12-02";
    expect(() => {
      createTaskSchema.parse({
        title: "Old task",
        description: "",
        deadlineAt: pastDate,
      });
    }).toThrow("Deadline must be in the future");
  });

  it("should fail if the title is empty", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    expect(() => {
      createTaskSchema.parse({
        title: "",
        description: "",
        deadlineAt: dateStr,
      });
    }).toThrow("Title is required");
  });
});

describe("Update Task Schema Validation", () => {
  it("should fail if the id is invalid", () => {
    const id = "123";
    expect(() => {
      idSchema.parse(id);
    }).toThrow("Invalid ID format");
  });

  it("should fail if all field is empty", () => {
    const updateTask = {};
    expect(() => {
      updateTaskSchema.parse(updateTask);
    }).toThrow("At least one field must be provided for update");
  });
});
