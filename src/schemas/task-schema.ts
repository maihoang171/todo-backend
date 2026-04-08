import z from "zod";

import { Status } from "../../generated/prisma/enums.js";

export const statusSchema = z.nativeEnum(Status);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().optional(),
  deadlineAt: z
    .string()
    .refine(
      (dateStr) => {
        const inputDate = new Date(dateStr)
        const today = new Date()
        today.setHours(0,0,0)
        return inputDate >= today;
      },
      {
        message: "Deadline must be in the future",
      },
    )
    .transform((val) => new Date(val)),
});


export const updateTaskSchema = createTaskSchema
  .extend({
    status: statusSchema.optional(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const idSchema = z.string().uuid("Invalid ID format");

export type createTaskInput = z.infer<typeof createTaskSchema>;
export type updateTaskInput = z.infer<typeof updateTaskSchema>;
