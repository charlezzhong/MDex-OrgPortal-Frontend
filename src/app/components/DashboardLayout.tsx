'use client';
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import React, { FC, useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa';

interface IProps {
    children: React.ReactNode
}

const routes = [
    {
        title:"Home",
        to:'/dashboard/home'
    },
    {
        title:"Post",
        to:'/dashboard/post'
    },
    {
        title:"Profile",
        to:'/dashboard/profile'
    },
    {
        title:"Staff",
        to:'/dashboard/staff'
    },
    {
        title:"Job Postings",
        to:'/dashboard/jobpostings'
    },
    {
        title:"Map_temp",
        to:'/dashboard/map_temp'
    },
]

const DashboardLayout:FC<IProps> = ({children}) => {
    const [toggleSidebar, useToggleSidebar] = useState(false);
    const pathname = usePathname()

    return (
    <div className='flex h-full min-h-[90vh]'>
        {/* Sidebar */}
        <div className={`${toggleSidebar ? 'w-8/12 z-10' : 'w-12'}   border-r-2 border-t-2 bg-white border-slate-200 md:border-none transition-all delay-200 md:w-3/12 lg:w-2/12 absolute h-[90vh] md:relative pt-4`}>
            <div className={`md:hidden flex justify-center transition-all delay-200 ${toggleSidebar? 'rotate-0':'rotate-180'}`} onClick={()=>useToggleSidebar(!toggleSidebar)}><FaChevronLeft/></div>

            <div className={`flex flex-col gap-y-4 md:w-full h-full md:scale-100 pt-5 ${toggleSidebar ? 'w-full ' : 'w-0 scale-0'} transition-all delay-200`}>
                {
                    routes.map((route) => (
                        <Link href={route.to} className={` md:px-5 px-2 text-lg ${pathname.includes(route.to) ? 'text-[#635bff] border-l-[#635bff] border-l-4' : ''}`} key={route.title}>{route.title}</Link>
                    ))
                }

            </div>
        </div>
        {/* body */}
        <div className='md:p-4 pl-14 pr-4 w-full h-[90vh] md:w-9/12 lg:w-10/12 overflow-y-auto'>
            {children}
        </div>
    </div>
  )
}

export default DashboardLayout