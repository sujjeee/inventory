import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { currentUser } from "@clerk/nextjs";
import { z } from 'zod'

export const appRouter = router({
    authCallback: publicProcedure.query(async () => {
        const user = await currentUser();

        console.log("testing user data cleck data", user)
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
                name: z.string(),
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
});

export type AppRouter = typeof appRouter;