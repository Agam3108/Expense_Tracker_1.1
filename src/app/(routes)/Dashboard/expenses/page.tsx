"use client";
import React, { useEffect, useState } from 'react';
import ExpenseListTable from './_components/ExpenseListTable';
import { getTableColumns, sql, eq, desc } from 'drizzle-orm';
import { db } from '../../../../../utils/dbConfig';
import { Budgets, Expenses } from '../../../../../utils/schema';
import { useUser } from '@clerk/nextjs';
import { Budget } from '../budgets/_components/BudgetList';

interface Expense {
  id: number | null; // Allow null
  name: string | null; // Allow null
  amount: string | null; // Change to string
  createdAt: string | null; // Allow null
}

function Page() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState<Budget[]>([]);
  const [expensesList, setExpensesList] = useState<Expense[]>([]);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      getBudgetList();
    }
  }, [user?.primaryEmailAddress?.emailAddress]);

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
    getAllExpenses();
  }

  const getAllExpenses = async() => {
    if(user?.primaryEmailAddress?.emailAddress){
    const result = await db.select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      createdAt: Expenses.createdAt
    })
    .from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
    .orderBy(desc(Expenses.id));

    const filteredResult = result.filter((expense) => 
      expense.id !== null && 
      expense.name !== null && 
      expense.amount !== null && 
      expense.createdAt !== null
    );

    setExpensesList(filteredResult);
    }
  }
  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl'>My Expenses</h2>
      <ExpenseListTable
        expensesList={expensesList}
        refreshData={() => getBudgetList()}
      />
    </div>
  );
}

export default Page;
