'use server'

import { revalidatePath } from 'next/cache'

export async function revalidatePage() {
    console.log("hitted for relvatidate")
    revalidatePath('/dashboard')
}
