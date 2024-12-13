"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmojiPicker from 'emoji-picker-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '../../../../../../utils/dbConfig';
import { Budgets } from '../../../../../../utils/schema';
import { useUser } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

interface CreateBudgetProps {
  refreshData: () => void;
}

function CreateBudget({ refreshData }: CreateBudgetProps) {
  const [emojiIcon, setEmojiIcon] = useState('⚠️');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState<string | undefined>();
  const [amount, setAmount] = useState<string | undefined>();
  const { user } = useUser();

  const onCreateBudget = async () => {
    if (name && amount && user?.primaryEmailAddress?.emailAddress) {
      try {
        const result = await db.insert(Budgets).values({
          name,
          amount,
          createdBy: user.primaryEmailAddress.emailAddress,
          icon: emojiIcon,
        }).returning({ insertedId: Budgets.id });

        if (result) {
          refreshData();
          toast('New Budget Created!');
        }
      } catch (error) {
        toast.error('Failed to create budget');
      }
    }
  };

  return (
    <div>
      <Toaster />
      <Dialog>
        <DialogTrigger>
          <div className='bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md mb-5'>
            <h2 className='text-3xl'>+</h2>
            <h2>Create New Budget</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>
              <div className='mt-5'>
                <Button
                  variant="outline"
                  className='text-large'
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                >
                  {emojiIcon}
                </Button>
                {openEmojiPicker && (
                  <div className='absolute z-20'>
                    <EmojiPicker
                      onEmojiClick={(e) => {
                        setEmojiIcon(e.emoji);
                        setOpenEmojiPicker(false);
                      }}
                    />
                  </div>
                )}
                <div className='mt-2'>
                  <h2 className='text-black font-medium my-1'>Budget Name</h2>
                  <Input
                    placeholder="e.g Home Decor"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className='mt-2'>
                  <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                  <Input
                    type='number'
                    placeholder="5000$"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <Button
                  disabled={!(name && amount && user?.primaryEmailAddress?.emailAddress)}
                  onClick={onCreateBudget}
                  className='mt-5 w-full'
                >
                  Create Budget
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateBudget;
