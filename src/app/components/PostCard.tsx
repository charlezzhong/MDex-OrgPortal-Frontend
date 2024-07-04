import { IPost } from '@/types/post.interface'
import Image from 'next/image'
import React from 'react'
import { FaChevronRight } from 'react-icons/fa'
import RenderImage from './RenderImage'

type Props = {
    post: IPost
}

export const PostCard = ({post}: Props) => {
  return (
    <div className='w-full p-2 grid grid-cols-1 gap-3 md:grid-cols-4 min-h-44 border border-opacity-50 rounded-lg'>
        <div className='col-span-1 relative w-full md:h-full h-40 '>
            <RenderImage src={post.image}/>
        </div>
        <div className='md:col-span-3 col-span-full'>
            <div className='flex flex-col md:flex-row justify-between items-start gap-3 md:items-center mb-5'>
                <div>
                    <p className=' font-bold text-lg'>{post.title}</p>
                    <p>{post.eventDate}</p>
                </div>
                <div className='flex items-center gap-3'>
                    <p className='py-1 px-3 rounded-full bg-[#635bff] text-white'>{post.category}</p>
                    <p className={`py-1 px-3 rounded-full ${post.verified ? 'bg-orange-400': 'bg-green-400' }`}>{post.verified? 'Posted': 'In Review'}</p>
                    <a href={`/dashboard/post/${post._id}`}>
                        <p ><FaChevronRight/></p>
                    </a>
                </div>
               
            </div>
            <p>
                <span className='font-bold'>Saves:</span> 0
            </p>
            <p>
                <span className='font-bold'>RSVP:</span> 0
            </p>
        </div>
    </div>
  )
}
