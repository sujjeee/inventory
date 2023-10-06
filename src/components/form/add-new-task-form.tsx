"use client"

import React from 'react'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { TaskStatus } from '@prisma/client'
import { Button } from '../ui/button'
import { Icons } from '../icons'
import { useSearchParams } from 'next/navigation'
import { trpc } from '@/app/_trpc/client'
import { toast } from 'sonner'
import { revalidatePage } from '@/app/_action/revalidatePage'

export default function AddNewTaskForm() {

  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [formData, setFormData] = React.useState({
    task: '',
    description: '',
    status: 'Todo',
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const taskStatusKeys = Object.keys(TaskStatus).filter(
    (key) => isNaN(Number(key))
  ) as [keyof typeof TaskStatus];

  // const { mutate: createInventoryTask, isLoading: iscreating } = trpc.createInventoryTask.useMutation();

  const { mutate: createInventoryTask, isLoading: iscreating } = trpc.createInventoryTask.useMutation({
    onSuccess: async () => {
      toast.success("Created new task!")
      await revalidatePage()
      // Reset the form fields to their initial state
      setFormData({
        task: '',
        description: '',
        status: 'Todo',
      });
    },
  })

  return (
    <div className='space-y-6 py-2'>
      <div className="grid gap-2">
        <Label htmlFor="task">Task</Label>
        <Input
          id="task"
          name='task'
          placeholder="I need help with..."
          value={formData.task}
          onChange={handleInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          name="description"
          id="description"
          placeholder="Enter detail about yout task"
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>
      <div className='grid gap-2'>
        <Label htmlFor="security-level">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger className="capitalize">
            <SelectValue placeholder={formData.status} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {taskStatusKeys.map((option) => (
                <SelectItem key={option} value={option} className="capitalize">
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className='w-full justify-end flex'>
        <Button
          onClick={() =>
            createInventoryTask({
              task: formData.task,
              title: formData.description,
              status: formData.status as keyof typeof TaskStatus,
              inventoryId: id!
            })
          }
          className="w-fit"
          disabled={iscreating}
        >
          {iscreating && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Add Task
          <span className="sr-only">Add Task</span>
        </Button>
      </div>
    </div>
  )
}
