"use client"

import * as React from "react"
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { trpc } from "@/app/_trpc/client"
import { Icons } from "@/components/icons"
import { Skeleton } from "@/components/ui/skeleton"
import { inferRouterOutputs } from "@trpc/server"
import { AppRouter } from "@/trpc"
import { useRouter } from "next/navigation"

type RouterOutput = inferRouterOutputs<AppRouter>
type Inventory = RouterOutput['getInventory']
type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>
interface InventorySwitcherProps extends PopoverTriggerProps {
  id: string | undefined
}

export default function InventorySwitcher({ className, id }: InventorySwitcherProps) {

  const router = useRouter()

  const [inventory, setInventory] = React.useState<Inventory>([]);
  const [open, setOpen] = React.useState(false)
  const [inventoryName, setInventoryName] = React.useState<string>('')
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false)
  const [selectedTeam, setSelectedTeam] = React.useState<any>(
    inventory[0]
  )
  const { data: getInventory, isLoading: isFetching } = trpc.getInventory.useQuery(undefined, {
    onSuccess: (data) => {
      if (data.length > 0) {
        setInventory(data)
        const matchingItem = data.find((item) => item.id === id);
        if (matchingItem) {
          setSelectedTeam(matchingItem);
          router.push(`/dashboard?id=${matchingItem.id}`);
          return; // Exit the function if a match is found
        }
        setSelectedTeam(data[0]);
        router.push(`/dashboard?id=${data[0].id}`);
      }
    }
  })

  const { mutate: createInventory, isLoading: iscreating } = trpc.createInventory.useMutation({
    onSuccess: (data) => {
      console.log("data form create invenroty", data)
      if (data) {
        setInventory((prevInventory) => [...prevInventory, data]);
        setSelectedTeam(data);
        router.push(`/dashboard?id=${data.id}`);
        setShowNewTeamDialog(false)
      }
    }
  });

  function getNameById(id: any) {
    const item = inventory.find(item => item.id === id);
    return item ? item.name : 'Not Found';
  }
  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[200px] h-max justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/2.png`}
                alt={selectedTeam?.name}
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {getNameById(id) || selectedTeam?.name || "Test"}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search team..." />
              <CommandEmpty>No team found.</CommandEmpty>
              <CommandGroup key="Inventories" heading="Inventories">
                {isFetching
                  ? (<Skeleton className="h-8 w-full" />)
                  : (<>
                    {getInventory?.map((group) => {
                      // console.log("groups", group.id)
                      // console.log("selectedTeam?.id", selectedTeam?.id)
                      return (
                        <CommandItem
                          key={group.name}
                          onSelect={() => {
                            setSelectedTeam(group)
                            setOpen(false)
                            router.push(`/dashboard?id=${group.id}`)
                          }}
                          className="text-sm"
                        >
                          <Avatar className="mr-2 h-5 w-5">
                            <AvatarImage
                              src={`https://avatar.vercel.sh/1.png`}
                              alt={group.name}
                              className="grayscale"
                            />
                            <AvatarFallback>SC</AvatarFallback>
                          </Avatar>
                          {group.name}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedTeam?.id === group.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>)
                    })}
                  </>)}

              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false)
                      setShowNewTeamDialog(true)
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Team
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create inventory</DialogTitle>
          <DialogDescription>
            Add a new inventory to manage tasks.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Inventory name</Label>
              <Input
                id="name"
                placeholder="Enter inventory name"
                onChange={(e) => {
                  setInventoryName(e.target.value)
                }} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            disabled={iscreating}
            onClick={() => {
              setInventoryName('')
              setShowNewTeamDialog(false)
            }}>
            Cancel
          </Button>
          <Button
            disabled={iscreating}
            onClick={() => {
              setInventoryName('')
              createInventory({
                name: inventoryName,
              })
            }}
          >
            {!iscreating
              ? "Create"
              : (
                <>
                  <Icons.spinner className="mr-2 h-4 w-5 animate-spin" />
                  create
                </>
              )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}