import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Budgets, Expenses } from '../../../../../../utils/schema';
import { db } from '../../../../../../utils/dbConfig';
import { toast } from 'sonner';
import moment from 'moment'
interface AddExpensesProps {
  budgetId: number;
  user: any; 
  refreshData: any
}

function AddExpenses({ budgetId, user,refreshData }: AddExpensesProps) {
  const [name, setName] = useState<string>('');
  const [amount, setAmount] = useState<number | ''>('');

  const addNewExpense = async () => {
    if (!name || !amount || !user?.primaryEmailAddress?.emailAddress) {
      toast.error('Please fill in all the fields.');
      return;
    }
    
    try {
      const result = await db.insert(Expenses).values({
        name,
        amount : amount.toString(),
        budgetId,
        createdAt: moment().format('DD/MM/YYYY')
      }).returning({ insertedId: Budgets.id });
  
      console.log(result);
      if (result) {
        refreshData();
        toast('New Expense Added');
        setName(''); 
        setAmount('');
      }
    } catch (error) {
      toast.error('Failed to add expense.');
    }
  };

  return (
    <div className='border p-5 rounded-lg'>
      <h2 className='font-bold text-lg'>Add Expenses</h2>
      <div className='mt-2'>
        <h2 className='text-black font-large my-1'>Expense Name</h2>
        <Input
          placeholder="e.g Bedroom Decor"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className='mt-2'>
        <h2 className='text-black font-medium my-1'>Expense Amount</h2>
        <Input
          type="number"
          placeholder="e.g 1000$"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>
      <Button
        disabled={!name || !amount}
        onClick={addNewExpense}
        className='mt-3 w-full'
      >
        Add New Expense
      </Button>
    </div>
  );
}

export default AddExpenses;
