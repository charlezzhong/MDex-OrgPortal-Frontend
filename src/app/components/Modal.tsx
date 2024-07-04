import React from 'react'
import { GrClose } from 'react-icons/gr';

type Props = {
  open:boolean;
  onClose : () => void
  children:React.ReactNode
}

export const Modal = (props: Props) => {
  return (
    <>
      {
        props.open && (
          <>
            <div className='w-screen h-screen  bg-black opacity-50 absolute top-0 left-0 z-50'/>
            <dialog className='z-50 p-5 rounded-lg w-10/12 md:w-8/12' open={props.open} onClose={props.onClose}>
              <div>
                <p className='flex justify-end cursor-pointer' onClick={props.onClose}><GrClose/></p>
                <div className='mt-4'>
                  {props.children}
                </div>
              </div>
            </dialog>
          </>
        )
      }
    </>
  )
}

