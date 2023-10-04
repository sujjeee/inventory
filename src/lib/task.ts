import { TaskStatus } from "@prisma/client"
import { z } from "zod"

export const taskSchema = z.object({
    name: z.string().min(1, {
        message: "Must be at least 1 character",
    }),
    title: z.string(),
    status: z
        .enum(Object.values(TaskStatus) as [keyof typeof TaskStatus], {
            required_error: "Must be a valid category",
        })
        .default(Object.values(TaskStatus)[0]),
})