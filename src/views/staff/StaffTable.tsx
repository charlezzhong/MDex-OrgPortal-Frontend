import Button from '@/app/components/Button'
import { Modal } from '@/app/components/Modal'
import { deleteStaff } from '@/services/handlers/staff.handlers'
import { Staff } from '@/types/staff.interface'
import React, { SetStateAction, useState } from 'react'
import toast from 'react-hot-toast'
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi'
import { FaTrashAlt } from 'react-icons/fa'
import { IoPencil } from 'react-icons/io5'

type Props = {
    members: Staff[]
    onPaginationChange: (offset:number, perpage:number) => void
    totalMembers:number;
    setSectedMember: React.Dispatch<SetStateAction<string>>
}

export const StaffTable = (props: Props) => {
    const {members, onPaginationChange, totalMembers, setSectedMember} = props
    const [currentPage, setcurrentPage] = useState(0);
    const [openModal, setOpenModal] = useState(false)
    const [userID, setUserID] = useState('')
    const limit = 10

    const onNext = () => {
        if((currentPage + 1)* limit >= totalMembers) return
        onPaginationChange( (currentPage + 1) * limit , limit);
        setcurrentPage(currentPage + 1)
    }

    const onBack = () => {
        if(currentPage == 0) return 
        onPaginationChange( (currentPage-1) * limit , limit)
        setcurrentPage(currentPage - 1)
    }

    const deleteUser = async () => {
        try {
            await deleteStaff(userID)
            setUserID('')
            setOpenModal(false)
            onPaginationChange( 0 , limit);
            toast.success("successfully deleted")
        } catch (error:any) {
            let msg = error?.message || 'Something went wrong'
            toast.error(msg)
            
        }
    }
    return (
    <div className='w-full mt-5 overflow-x-scroll'>
        <table className='overflow-x-scroll w-full table'>
            <thead >
                <tr className='border-y border-opacity-20 border-black'>
                    <th className='text-left py-2'>Name</th>
                    <th className='text-left py-2'>Email</th>
                    <th className='text-left py-2'>Role</th>
                    <th className='text-left py-2'>Action</th>
                </tr>
            </thead>
            <tbody >
                {
                    members.map((member) => (
                        <tr key={member._id}>
                            <td className='p-1'>
                                <p className='border w-fit px-3 rounded-md'>{member.name}</p>
                            </td>
                            <td className='p-1'>
                                <p className='border w-fit px-3 rounded-md'>{member?.email}</p>
                            </td>
                            <td className='p-1'>
                                <p className='border w-fit px-3 rounded-md uppercase'>{member?.jobTitle || '-'}</p>
                            </td>
                            <td className='p-1 flex gap-4'>
                                    <IoPencil onClick={()=> setSectedMember(member._id)} className='cursor-pointer' color='blue'/>
                                    <FaTrashAlt onClick={() => {setOpenModal(!openModal); setUserID(member?._id)}} className='cursor-pointer' color='red' />
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
        <div className='mt-3 flex gap-3 items-center'>
            <div className='flex gap-2'>
                <BiLeftArrow className='cursor-pointer' onClick={onBack} color={currentPage == 0 ? 'gray' : 'black' }/>
                <BiRightArrow className='cursor-pointer' onClick={onNext}  color={(currentPage + 1)* limit >= totalMembers ? 'gray' : 'black' }/>
            </div>
            <p>
                Total Staff: {totalMembers}
            </p>
        </div>
        <Modal open={openModal} onClose={()=>{
            setOpenModal(false)}
        }>
            <div>
                <p>Are you sure you want to delete this member</p>
                <p className='text-red-400'>Note: this action is irreversible and cannot retrieve the member again</p>

                <div className='flex gap-4 mt-3'>
                    <Button className='bg-red-500 hover:bg-red-600' onClick={ deleteUser}>Delete</Button>
                    <Button className='!bg-gray-500 hover:!bg-gray-600' onClick={()=> {
                        setUserID('')
                        setOpenModal(false)
                    }}>Cancel</Button>
                </div>

            </div>
        </Modal>
    </div>
  )
}
