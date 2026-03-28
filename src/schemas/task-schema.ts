import z, { date } from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().optional(),
  deadlineAt: z
    .string()
    .date()
    .refine(
      (dateStr) => {
        const date = new Date(dateStr);
        return date >= new Date();
      },
      {
        message: "Deadline must be in the future",
      },
    )
    .transform((val) => new Date(val)),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
