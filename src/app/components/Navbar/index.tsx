'use client'
import { signOut, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import Button from '../Button'
import { deleteCookie, setCookie } from 'cookies-next'
import { useAppDispatch, useSelector } from '@/store/store'
import { Organization } from '@/types/org.interface'
import { statusValue } from '@/helpers/enum'
import { encrypt } from '@/utils/hashing'
import { updateOrg } from '@/store/userReducer'
import { useRouter } from 'next/navigation'
import { path } from '@/helpers/path'
import { approvedUrl, pendingUrl, rejected } from '@/helpers/constants'

const Index = () => {
  const [selectedId, setSelected] = useState('');

  const router = useRouter()
  const dispatch = useAppDispatch()
  const staff = useSelector(state => state.user.staff)
  const org = useSelector(state => state.user.organization)
    const {data:session} = useSession()

    useEffect(() => {
      if(org){
        setSelected(org._id)
      }
    }, [org])
    

    const handleupdate = (id:string) => {
      const org = staff?.organization.find(org => org._id == id)
      if(org){
        setSelected(org?._id)
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
    }
  return (
    <div className='flex justify-between items-center px-3 py-5 h-[10vh]'>
        <p>
          <img src='/images/mdexlogo.png' />
        </p>
        {session && <div className='flex items-center gap-2'>
              <select className='bg-white p-2 border border-gray-200 rounded-lg' value={selectedId} onChange={(e) => handleupdate(e.target.value)}>
                {
                  staff?.organization.map((org:Organization, index:number) => (
                    <option value={org._id}>{org.orgName}</option>
                  ))
                }
              </select>
              <Button
              onClick={() => {
                signOut()
                deleteCookie('status')
              }}
            >
                Logout
            </Button>
          </div>
        }
    </div>
  )
}

export default Index