import { publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { currentUser } from "@clerk/nextjs";

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
});

export type AppRouter = typeof appRouter;