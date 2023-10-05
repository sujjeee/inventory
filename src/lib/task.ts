import * as z from "zod"


enum TaskStatus {
    Todo,
    canceld,
    InProgress,
    Done
}

// Get only the string keys of the enum
const taskStatusKeys = Object.keys(TaskStatus).filter(
    (key) => isNaN(Number(key))
) as [keyof typeof TaskStatus];

export const taskSchema = z.object({
    task: z.string().min(1, {
        message: "Task should not be empty",
    }),
    title: z.string().min(1, {
        message: "Title should not be empty",
    }),
    status: z
        .enum(taskStatusKeys, {
            required_error: "Must be a valid category",
        })
        // Use the first string key as the default value
        .default(taskStatusKeys[0]),
})