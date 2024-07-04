'use client';
import { getAnalytics } from '@/services/handlers/organization.handlers';
import { useSelector } from '@/store/store';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface IProps {
    title:string;
    values: number
  }
  
  const AnalyticsText  = (props:IProps) => {
    return (
      <div>
        <p className='text-lg font-semibold text-center'>{props.title}</p>
        <p className='text-xl font-bold text-center'>{props.values}</p>
      </div>
    )
  }
const Analytics = () => {
    const [data, setdata] = useState({
        inReviewPosts: 0,
        totalPosts: 0,
        totalSaves: 0
    })
    const org = useSelector(state => state.user.organization)
    useEffect(() => {
        if(org?._id){
            getAnalyticsData()
        }
    }, [org])
    
    const getAnalyticsData = async() => {
        try {
            const response:any = await getAnalytics(org?._id!)
            setdata(response.data)
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className='w-full flex items-center gap-3 bg-[#635bff] my-3 mt-4 px-5 py-4 text-white rounded-lg shadow-2xl'>
        <p className='text-2xl font-bold mr-3 md:mr-12'>Overview</p>
        <div className='flex flex-col items-center w-1/2 md:w-1/4'>
        {/* <AnalyticsText title='Profile Views' values={0}/> */}
          <AnalyticsText title='Total Posts' values={data?.totalPosts || 0}/>
        {/* <AnalyticsText title='Followers' values={0}/> */}
        </div>
        <div className='flex flex-col items-center w-1/2 md:w-1/4'>
        {/* <AnalyticsText title='Profile Views' values={0}/> */}
          <AnalyticsText title='Total Saves' values={data?.totalSaves || 0}/>
        {/* <AnalyticsText title='Followers' values={0}/> */}
        </div>
    </div>
  )
}

export default Analytics