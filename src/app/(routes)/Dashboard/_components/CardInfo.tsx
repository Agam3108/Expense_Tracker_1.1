import { PiggyBank, ReceiptText, Wallet } from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface BudgetItem {
  name: string; // Assuming 'name' is a string
  totalSpending: number; // Assuming 'totalSpending' is a number
  amount: string; // Assuming 'amount' is a number
}

// Define the props for the BarChartDashboard component
interface CardInfoDashboardProps {
  budgetList: BudgetItem[]; // budgetList is an array of BudgetItem
}

const CardInfo: React.FC<CardInfoDashboardProps> = ({ budgetList }) => {
    //console.log('Budget List:' , budgetList) ;
    const [totalBudget, setTotalBudget] = useState<number>(0); const [totalSpending, setTotalSpending] = useState<number>(0);

    useEffect(()=>{
        budgetList && calculateCardInfo();

    },[budgetList])
    const calculateCardInfo = () => {
        console.log(budgetList);
        let totalBudget_ = 0;
        let totalSpend_ = 0;
        budgetList.forEach((element: { amount: any; totalSpending: any; })=>{
           // console.log('Element:', element); console.log('Total Spend:', element.totalSpending);
            totalBudget_ = totalBudget_+Number(element.amount);
            totalSpend_ += element.totalSpending ? element.totalSpending : 0 ;
        });
        setTotalBudget(totalBudget_);
        setTotalSpending(totalSpend_);

    }
  return (
    <div>
        {budgetList?
    <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
      <div className='p-7 border rounded-lg flex items-center justify-between'>
        <div>
        <h2 className='text-sm'>Total Budget </h2>
        <h2 className='font-bold text-xl'>${totalBudget}</h2>
        </div>
        <PiggyBank className='bg-primary p-3 h-12 w-12 rounded-full text-white'/>
      </div>
      <div className='p-7 border rounded-lg flex items-center justify-between'>
        <div>
        <h2 className='text-sm'>Total Spent </h2>
        <h2 className='font-bold text-xl'>${totalSpending}</h2>
        </div>
        <ReceiptText className='bg-primary p-3 h-12 w-12 rounded-full text-white'/>
      </div>
      <div className='p-7 border rounded-lg flex items-center justify-between'>
        <div>
        <h2 className='text-sm'>No. of Budget</h2>
        <h2 className='font-bold text-xl'>{budgetList?.length}</h2>
        </div>
        <Wallet className='bg-primary p-3 h-12 w-12 rounded-full text-white'/>
      </div>
    </div>
    :
    <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
       {[1,2,3].map(()=>(
        <div className='h- [160px] w-full bg bg-slate-200 animate-spin rounded-lg'>
            </div>

))} 
        </div>
    }
    </div>
  )
}

export default CardInfo
