"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { LayoutGrid, PiggyBank, ReceiptText } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function SideNav() {
    const menuList = [
        {
            id: 1,
            name: 'Dashboard',
            icon: LayoutGrid,
            path: '/Dashboard'
        },
        {
            id: 2,
            name: 'Budgets',
            icon: PiggyBank,
            path: '/Dashboard/budgets'
        },
        {
            id: 3,
            name: 'Expenses',
            icon: ReceiptText,
            path: '/Dashboard/expenses'
        }
    ];

    // Call usePathname unconditionally
    const path = usePathname();

    useEffect(() => {
        console.log(path);
    }, [path]);

    return (
        <div className='h-screen p-5 border shadow-sm'>
            <Image
                src={'/logo.svg'}
                alt='logo'
                width={160}
                height={100}
            />
            <div className='mt-5'>
                {menuList.map((menu) => (
                    <Link key={menu.id} href={menu.path} passHref>
                        <div
                            className={`flex gap-2 items-center text font-medium p-5 cursor-pointer rounded-md
                                hover:text-primary hover:bg-blue-100
                                ${path === menu.path ? 'text-primary bg-blue-100' : ''}`}
                        >
                            <menu.icon />
                            {menu.name}
                        </div>
                    </Link>
                ))}
            </div>
            <div className='fixed-bottom-10 p-5 flex gap-2 items-center'>
                <UserButton />
                Profile
            </div>
        </div>
    );
}

export default SideNav;