"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Budgets, Expenses } from "../../../../../../utils/schema";
import { db } from "../../../../../../utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpenses from "../_components/AddExpenses";
import ExpenseListTable from "../_components/ExpenseListTable";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import EditBudget from "../_components/EditBudget";

interface Params {
  id: string;
}

interface ExpensesScreenProps {
  params: Params;
}

interface BudgetInfo {
  id: number;
  name: string;
  amount: string;
  icon: string | null;
  createdBy: string;
  totalSpending: number;
  totalItems: number;
}

interface Expense {
  id: number | null;
  name: string | null;
  amount: string | null;
  createdAt: string | null;
}

function ExpensesScreen({ params }: ExpensesScreenProps) {
  const { user } = useUser();
  const [budgetInfo, setbudgetInfo] = useState<BudgetInfo | undefined>(undefined);
  const [expensesList, setExpensesList] = useState<Expense[]>([]);
  const route = useRouter();

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      getBudgetInfo(user.primaryEmailAddress.emailAddress, parseInt(params.id));
    }
  }, [user, params.id]);

  const getBudgetInfo = async (emailAddress: string, budgetId: number) => {
    try {
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          amount: sql`CAST(${Budgets.amount} AS TEXT)`,
          totalSpending: sql`sum(CAST(${Expenses.amount} AS NUMERIC))`.mapWith(Number),
          totalItems: sql`count(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, emailAddress))
        .having(eq(Budgets.id, budgetId))
        .groupBy(Budgets.id);

      const formattedResult = result.map((item) => ({
        ...item,
        amount: String(item.amount),  // Convert amount to a string
      }));
      setbudgetInfo(formattedResult[0]);
      getExpensesList();
    } catch (error) {
      console.error("Error fetching budget info:", error);
    }
  };

  const getExpensesList = async () => {
    try {
      const result = await db
        .select()
        .from(Expenses)
        .where(eq(Expenses.budgetId, parseInt(params.id)))
        .orderBy(desc(Expenses.id));
      setExpensesList(result as Expense[]);
      console.log(result);
    } catch (error) {
      console.error("Error fetching expenses list:", error);
    }
  };

  const deleteBudget = async () => {
    try {
      const deleteExpenseResult = await db
        .delete(Expenses)
        .where(eq(Expenses.budgetId, parseInt(params.id)))
        .returning();

      if (deleteExpenseResult) {
        await db
          .delete(Budgets)
          .where(eq(Budgets.id, parseInt(params.id)))
          .returning();
      }
      toast("Budget Deleted Successfully!");
      route.replace("/dashboard/budgets");
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Expenses</h2>
        <div className="flex gap-3">
          {budgetInfo && (
            <EditBudget
              budgetInfo={budgetInfo}
              refreshData={() => getBudgetInfo(user?.primaryEmailAddress?.emailAddress!, parseInt(params.id))}
            />
          )}
          <AlertDialog>
            <AlertDialogTrigger>
              <Button className="flex gap-2 mb-4" variant="destructive">
                <Trash />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  records from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteBudget}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {budgetInfo ? (
          <BudgetItem budget={budgetInfo} />
        ) : (
          <div className="h-[150px] w-full bg-slate-200 rounded-lg animate-pulse" />
        )}
        <AddExpenses
          budgetId={parseInt(params.id)}
          user={user}
          refreshData={() =>
            getBudgetInfo(user?.primaryEmailAddress?.emailAddress!, parseInt(params.id))
          }
        />
      </div>
      <div className="mt-4">
        <ExpenseListTable
          expensesList={expensesList}
          refreshData={() =>
            getBudgetInfo(user?.primaryEmailAddress?.emailAddress!, parseInt(params.id))
          }
        />
      </div>
    </div>
  );
}

export default ExpensesScreen;
