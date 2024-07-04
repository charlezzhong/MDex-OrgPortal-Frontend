'use client'
import { approvedUrl, pendingUrl, rejected } from '@/helpers/constants'
import { statusValue } from '@/helpers/enum'
import { path } from '@/helpers/path'
import { useAppDispatch, useSelector } from '@/store/store'
import { updateOrg } from '@/store/userReducer'
import { Organization } from '@/types/org.interface'
import { encrypt } from '@/utils/hashing'
import { setCookie } from 'cookies-next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FcRight } from 'react-icons/fc'

type Props = {}

const page = (props: Props) => {
    const [orgs, setorgs] = useState<Organization[]>([])
    const dispatch = useAppDispatch();
    const router =useRouter()
    const user = useSelector(state => state.user.staff)

    useEffect(() => {
        if(user){
            setorgs(user.organization)
        }
    }, [user])
    

    const handleSelectOrg = (org:Organization) => {
        let orgStatus = 'notCreated'
        let url = ''

       if(org) {
            // if organisation present then --> route to the page depend on status

            if(org?.status == statusValue.approved) {
                url = approvedUrl
            }
            if(org?.status == statusValue.pending) {
                url = pendingUrl
            }
            if(org?.status == statusValue.rejected) {
                url = rejected
            }
            orgStatus = org?.status
        }
        setCookie('status',encrypt(orgStatus))
        dispatch(updateOrg(org))
        router.push(url)
        
    }
  return (
    <div className='flex justify-center items-center w-full h-[80vh]'>
        <div className='text-center p-5 w-2/3 sm:w-1/3  rounded-lg text-black shadow-lg'>
            <h1 className='font-bold text-2xl text-center'>Select an Organization</h1>
            <div className='max-h-36 overflow-y-auto my-2'>
                {
                    orgs.length > 0 ? orgs?.map((org:Organization, index:number) => (
                        <p className='my-2 text-lg flex items-center justify-between p-2 border border-gray-300  rounded-lg cursor-pointer gap-2' onClick={() => handleSelectOrg(org)}>{org.orgName} <FcRight/></p>
                    )) : (
                        <p>You are not linked to any organization</p>
                    )
                }
            </div>
           

        </div>
    </div>
  )
}

export default page