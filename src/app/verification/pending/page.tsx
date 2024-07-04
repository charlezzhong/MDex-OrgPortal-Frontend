import { path } from '@/helpers/path'
import Link from 'next/link'
import React from 'react'

const pending = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-fit h-screen mt-[-100px]">
      <h1 className='text-center md:w-10/12 text-2xl'>
        Your organization information has been submitted!<br/> You will be notified as soon as it gets approved!
      </h1>
      <Link className='p-1 bg-gray-500 rounded-lg mt-2 text-white' href={path.selectOrganization}>Select Other Organization</Link>
    </div>
  )
}

export default pending