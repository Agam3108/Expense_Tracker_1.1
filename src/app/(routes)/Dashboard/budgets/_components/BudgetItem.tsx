import React from 'react';
import Link from 'next/link';
import { Budget } from './BudgetList';

type BudgetItemProps = {
  budget: Budget;
};

function BudgetItem({ budget }: BudgetItemProps) {
  const calculatePercProgress=()=>{
      const perc = (budget.totalSpending/Number(budget.amount))*100 ;
      return perc.toFixed(2);
     
  };
 
  return (
    
      <Link href={'/Dashboard/expenses/' + budget.id} >
     
     
        <div className='p-5 border rounded-lg gap-2 flex-auto hover:shadow-md cursor-pointer h-[170px]'>
        <div className='flex gap-2 items-center justify-between'>
          <div className='flex gap-2 items-center'>
            <h2 className='text-2xl p-3 px-4 bg-slate-100 rounded-full '>{budget.icon}</h2>
            <div>
              <h2 className='font-bold'>{budget.name}</h2>
              <h2 className='text-sm text-gray-500'>{budget.totalItems ? `${budget.totalItems} Items` : 'No items'}</h2>
            </div>
          </div>
          <h2 className='font-bold text-primary text-large'>${budget.amount}</h2>
        </div>
        <div className='mt-5'>
          <div className='flex items-center justify-between mb-3'>
            <h2 className='text-xs text-slate-400'>${budget.totalSpending ? budget.totalSpending : 0} Spent</h2>
            <h2 className='text-xs text-slate-400 ml-4'>${Number(budget.amount) - (budget.totalSpending ?? 0)} Remaining</h2>
          </div>
          <div className='w-full bg-slate-300 h-2 rounded-full'>
            <div className=' bg-primary h-2 rounded-full'
            style={{
              width: `${calculatePercProgress()}%`
            }}
            ></div>
          </div>
        </div>
        </div>
      </Link>
    
  )
}

export default BudgetItem
