import { Shell } from "@/components/shells"
import AuthCallback from "@/components/auth/auth-callback"

export default function SSOCallbackPage() {
    return (
        <Shell className="max-w-lg" variant={"centered"}>
            <AuthCallback />
        </Shell>
    )
}