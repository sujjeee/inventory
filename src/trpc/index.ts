import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { currentUser } from "@clerk/nextjs";
import { z } from 'zod'
import { TaskStatus } from '@prisma/client';

export const appRouter = router({
    authCallback: publicProcedure.query(async () => {
        const user = await currentUser();

        if (!user?.id) throw new TRPCError({ code: 'UNAUTHORIZED' })

        const dbUser = await db.user.findFirst({
            where: {
                id: user.id
            }
        })

        if (!dbUser) {
            await db.user.create({
                data: {
                    id: user.id,
                    email: user.emailAddresses[0].emailAddress
                }
            })
        }
        return { success: true }
    }),

    createInventory: privateProcedure
        .input(
            z.object({
                name: z.string().min(1, {
                    message: "Must be at least 1 character",
                }),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { userId } = ctx;

            const newTodo = await db.inventory.create({
                data: {
                    name: input.name,
                    userId
                },
            })

            return newTodo;
        }),
    getInventory: privateProcedure.query(async ({ ctx }) => {
        const { userId } = ctx
        return await db.inventory.findMany({
            where: {
                userId
            },
            select: {
                id: true,
                name: true
            }
        })
    }),
    createInventoryTask: privateProcedure
        .input(
            z.object({
                inventoryId: z.string(),
                task: z.string().min(1, {
                    message: "Must be at least 1 character",
                }),
                title: z.string(),
                status: z.enum(Object.values(TaskStatus) as [keyof typeof TaskStatus], {
                    required_error: "Must be a valid category",
                })
                    .default(Object.values(TaskStatus)[0]),
            })
        )
        .mutation(async ({ input }) => {

            const newTodo = await db.task.create({
                data: {
                    task: input.task,
                    title: input.title,
                    status: input.status,
                    inventoryId: input.inventoryId
                },
            })

            return newTodo;
        }),
    updateStatus: privateProcedure
        .input(
            z.object({
                inventoryId: z.string(),
                id: z.string().min(1, {
                    message: "Must be at least 1 character",
                }),
                status: z.enum(Object.values(TaskStatus) as [keyof typeof TaskStatus], {
                    required_error: "Must be a valid category",
                })
            })
        )
        .mutation(async ({ input }) => {

            const newTodo = await db.task.update({
                where: {
                    id: input.id,
                    inventoryId: input.inventoryId
                },
                data: {
                    status: input.status
                },
            })

            return newTodo;
        }),

    getInventoryTask: privateProcedure
        .input(
            z.object({
                inventoryId: z.string(),
            })
        )
        .query(async ({ input }) => {
            return await db.task.findMany({
                where: {
                    inventoryId: input.inventoryId
                },
            })
        }),
});

export type AppRouter = typeof appRouter;