"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import CardInfo from "./_components/CardInfo";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { db } from "../../../../utils/dbConfig";
import { Budgets, Expenses } from "../../../../utils/schema";
import { Budget } from "./budgets/_components/BudgetList";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";
interface Expense {
  id: number | null; // Allow null
  name: string | null; // Allow null
  amount: string | null; // Change to string
  createdAt: string | null; // Allow null
}
function Dashboard() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState<Budget[]>([]);
  const [expensesList, setExpensesList] = useState<Expense[]>([]);

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

        totalSpending: sql`sum(CAST(${Expenses.amount} AS NUMERIC))`.mapWith(
          Number
        ),
        totalItems: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));
    const formattedResult = result.map((item) => ({
      ...item,
     
    }));

    setBudgetList(formattedResult);
    getAllExpenses();
  };
  const getAllExpenses = async () => {
    if (user?.primaryEmailAddress?.emailAddress) {
      const result = await db
        .select({
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          createdAt: Expenses.createdAt,
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(Expenses.id));
  
      // Filter out any entries with null values
      const filteredResult = result.filter((expense) => 
        expense.id !== null && 
        expense.name !== null && 
        expense.amount !== null && 
        expense.createdAt !== null
      );
  
      setExpensesList(filteredResult);
    }
    
  };
  return (
    <div className="p-8">
      <h2 className="font-bold text-3xl"> Hi, {user?.fullName} 🤝</h2>
      <p className="text-gray-500">
        Here's what's happening with your money. Let us manage your expenses!
      </p>
      <CardInfo budgetList={budgetList} />
      <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-5">
        <div className="md: col-span-2">
          <BarChartDashboard budgetList={budgetList} />
          <ExpenseListTable
            expensesList={expensesList}
            refreshData={() => getBudgetList()}
          />
        </div>
        <div className="grid gap-5">
          <h2 className="font-bold text-lg text-center">Latest Budget List</h2>
          {budgetList.map((budget, index) => (
            <BudgetItem budget={budget} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
