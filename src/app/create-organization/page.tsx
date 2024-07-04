import OrgForm from '@/sections/CreateOrg/OrgForm'
import React from 'react'

const page = () => {

  return (
    <div className='flex items-center justify-center min-h-[80vh]'>
      <div className='lg:w-8/12 md:w-11/12 sm:w-4/5'>
        <h1 className='font-bold text-3xl text-left'>Welcome!</h1>
        <div className='rounded-3xl border-2 border-black p-5'>
          <OrgForm />
        </div>
      </div>
    </div>
  )
}

export default page