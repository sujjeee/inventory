import { type Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { env } from "@/env.mjs"
import { currentUser } from "@clerk/nextjs"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Shell } from "@/components/shells"
import OAuthSignin from "@/components/auth/oauth-signin"

export const metadata: Metadata = {
    title: "Sign In",
    description: "Sign in to your account",
}

export default async function SignInPage() {
    const user = await currentUser()
    if (user) redirect("/")

    return (
        <Shell className="max-w-lg" variant={"centered"}>
            <Card className="w-full">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Sign in</CardTitle>
                    <CardDescription>
                        Choose your preferred sign in method
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <OAuthSignin />
                </CardContent>
            </Card>
        </Shell>
    )
}