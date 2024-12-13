"use client";
import React, { useEffect, useState } from 'react';
import CreateBudget from './CreateBudget';
import BudgetItem from './BudgetItem';
import { db } from '../../../../../../utils/dbConfig';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Budgets, Expenses } from '../../../../../../utils/schema';
import { useUser } from '@clerk/nextjs';

export type Budget = {
  totalSpending: number;
  totalItems: number;
  id: number;
  name: string;
  amount: string;
  icon: string | null;
  createdBy: string;
};

function BudgetList() {
  const [budgetList, setBudgetList] = useState<Budget[]>([]);
  const { user } = useUser();

  useEffect(() => {
    //console.log("Updated budgetList:", budgetList);
  }, [budgetList]);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      getBudgetList();
    }
  }, [user]);

  const getBudgetList = async () => {
    const emailAddress = user?.primaryEmailAddress?.emailAddress;
    if (!emailAddress) return;

    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpending: sql`sum(CAST(${Expenses.amount} AS NUMERIC))`.mapWith(Number),
        totalItems: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));
      const formattedResult = result.map((item) => ({
        ...item,
        //amount: Number(item.amount),  // Convert amount to a number
      }));
    
  
    setBudgetList(formattedResult);
  };

  return (
    <div className="mt-7">
       <CreateBudget refreshData={()=>getBudgetList()}/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {budgetList.length > 0
          ? budgetList.map((budget, index) => (
              <BudgetItem key={index} budget={budget} />
            ))
          : [1, 2, 3, 4, 5, 6].map((item, index) => (
              <div key={index} className="w-full bg-slate-200 rounded-lg h-[150px] animate-pulse"></div>
            ))}
      </div>
    </div>
  );
}

export default BudgetList;
