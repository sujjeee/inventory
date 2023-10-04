"use client"

import { UserButton } from "@clerk/nextjs";
import { ArrowRight, Home, Link } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import InventorySwitcher from "../buttons/inventory-switcher";
import { ThemeToggle } from "../buttons/theme-toggle";

export function Header() {
    const user = true;
    return (
        <div className='sticky h-14 inset-x-0 top-0 z-30 w-full'>
            <div className='flex h-14 items-center justify-between '>
                {user ? (
                    <InventorySwitcher />
                ) : (
                    <div className="text-xl font-bold flex justify-center items-center">
                        <Home className="mr-2 h-5 w-5" />
                        Inventory
                    </div>
                )}

                <div className='hidden items-center space-x-4 sm:flex'>
                    {!user ? (
                        <>
                            <Button
                                className={buttonVariants({
                                    variant: 'ghost',
                                    size: 'sm',
                                })}>
                                Sign in
                            </Button>
                            <Button
                                className={buttonVariants({
                                    size: 'sm',
                                })}>
                                Get started{' '}
                                <ArrowRight className='ml-1.5 h-5 w-5' />
                            </Button>
                        </>
                    ) : (
                        <>
                            <ThemeToggle />
                            <UserButton />
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}