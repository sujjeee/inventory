"use client"

import { trpc } from '@/app/_trpc/client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AuthCallback() {
    const router = useRouter()

    const searchParams = useSearchParams()
    const origin = searchParams.get('origin')

    trpc.authCallback.useQuery(undefined, {
        onSuccess: ({ success }) => {
            if (success) {
                // user is synced to db
                router.push(origin ? `/${origin}` : '/')
            }
        },
        onError: (err) => {
            if (err.data?.code === 'UNAUTHORIZED') {
                router.push('/sign-in')
            }
        },
        retry: true,
        retryDelay: 500,
    })

    return (
        <div className='flex flex-col items-center gap-2'>
            <h3 className='font-semibold text-xl'>
                Setting up your account...
            </h3>
            <p>You will be redirected automatically.</p>
        </div>
    )
}
