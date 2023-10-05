import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/buttons/theme-toggle";
import InventorySwitcher from "@/components/buttons/inventory-switcher";


export function Header({ inventoryID }: { inventoryID: string | undefined }) {
    return (
        <div className='sticky h-14 inset-x-0 top-0 z-30 w-full'>
            <div className='flex h-14 items-center justify-between '>
                <InventorySwitcher id={inventoryID} />
                <div className='hidden items-center space-x-4 sm:flex'>
                    <ThemeToggle />
                    <UserButton />
                </div>
            </div>
        </div>
    )
}