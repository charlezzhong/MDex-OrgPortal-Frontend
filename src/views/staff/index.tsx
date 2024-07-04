'use client';
import React, { useEffect, useState } from 'react'

//icons
import { FaPlus } from 'react-icons/fa'

//components
import { StaffTable } from './StaffTable'
import Button from '@/app/components/Button'

//types
import { Staff as StaffType } from '@/types/staff.interface'

//api handlers
import { createStaffs, fetchStaffs, updateStaffs } from '@/services/handlers/staff.handlers'
import {Modal} from '@/app/components/Modal';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const Index = () => {
  const [members, setMembers] = useState<StaffType[]>([])
  const [total, setTotal] = useState<number>(0)
  const [selectedMember, setSelectedMember] = useState<string>('')
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [memberData, setMemberData] = useState<StaffType | null>(null)

  //hooks
  const org = useSelector((state:any) => state?.user?.organization)
  //console.log('org', org)
  //modal values
  const [vals, setVals] = useState({
    name:'',
    email:'',
    jobTitle: ''
  })
  
  useEffect(() => {
    fetchStaffMembers()
  }, [])

  useEffect(() => {
    if(selectedMember)
      handleOpenModal()
  }, [selectedMember])
  
  //open modal and set initial values
  const handleOpenModal = () => {
    
    if(selectedMember){
      let memberData = members.find(item => item?._id == selectedMember) as StaffType|null;
      if(memberData){
        setMemberData(memberData)
        setVals({ name:memberData?.name, email:memberData?.email, jobTitle: memberData.jobTitle || '' })
      }
    }
    setOpenModal(true)
  }

  //close modal and reset values
  const handleCloseModal = () => {    
    setVals({
      name:'',
      email:'',
      jobTitle: ""
    })
    setMemberData(null)
    setSelectedMember('')
    setOpenModal(false)
  }

  const fetchStaffMembers = async(offset?:number,perpage?:number) => {
    try {
      const staffData:any = await fetchStaffs({offset,perpage}, org._id) 
      if(staffData.data){
        setMembers(staffData.data?.data)
        setTotal(staffData?.data?.count)
      }
    } catch (error) {
      //console.log(error)
    }
  }
  
  const handleUpdate = async () => {
    
    try {
      if(selectedMember){
        if(!memberData?._id) return
        const res:any = await updateStaffs(vals, memberData?._id)
        if(res?.data?.data){
          let index = members.findIndex(item => item?._id == selectedMember) as number;
          if(index != -1){
            let temp = [...members]
            temp[index] = res.data?.data
            setMembers(temp)
          }
        }
      }else{
        let dataToSend = {
          ...vals,
          organizationId: org?._id
        }
        await createStaffs(dataToSend)
        await fetchStaffMembers()
      }

      handleCloseModal()
    } catch (error:any) {
      let msg = error?.response?.message || 'Something went wrong'
      toast.error(msg)
    }
  }

  return (
    <div>
        <div className=' w-full'>
          <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold ">Staff</h1>
              <Button onClick={handleOpenModal} LeftIcon={<FaPlus/>}>Add Staff</Button>
          </div>
          <StaffTable 
            members={members} 
            onPaginationChange= {(offset?:number,perpage?:number) => fetchStaffMembers(offset,perpage)}
            totalMembers = {total}
            setSectedMember={setSelectedMember}
          />
        </div>
          <Modal open={openModal} onClose={handleCloseModal}>
            <h1 className='text-3xl'>{selectedMember ? 'Edit Staff' : 'Add Staff'}</h1>
            <div className='mt-2 '>
              <p>Email</p>
              <input value={vals.email} onChange={(e)=> setVals(prev => ({...prev, email:e.target.value}))} className='px-2 py-3 border rounded-lg w-full md:w-8/12 '/>
              <p className='mt-4'>Name</p>
              <input value={vals.name} onChange={(e)=> setVals(prev => ({...prev, name:e.target.value}))} className='px-2 py-3 border rounded-lg w-full md:w-8/12'/>
              <p className='mt-4'>Role</p>
              <input value={vals.jobTitle} onChange={(e)=> setVals(prev => ({...prev, jobTitle:e.target.value}))} className='px-2 py-3 border rounded-lg w-full md:w-8/12'/>
              {/* <p className='mt-4'>Role</p>
              <input value={vals.role} onChange={(e)=> setVals(prev => ({...prev, role:e.target.value}))} className='px-2 py-3 border rounded-lg w-full md:w-8/12'/> */}
              <div className='mt-5 '>
                <Button className='px-4 py-3' onClick={handleUpdate}> {selectedMember ? 'Update' : 'Add'}</Button>
              </div>
            </div>
          </Modal>
    </div>
  )
}

export default Index