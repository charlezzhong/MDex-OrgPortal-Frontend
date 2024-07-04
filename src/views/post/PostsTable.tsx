import { PostCard } from '@/app/components/PostCard'
import { IPost } from '@/types/post.interface'
import { Staff } from '@/types/staff.interface'
import React, { SetStateAction, useState } from 'react'
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi'
import { FaTrashAlt } from 'react-icons/fa'
import { IoPencil } from 'react-icons/io5'

type Props = {
    posts: IPost[]
    onPaginationChange: (offset: number, perpage: number) => void
    totalPosts: number;
}

export const PostsTable = (props: Props) => {
    const { posts, onPaginationChange, totalPosts } = props
    const [currentPage, setcurrentPage] = useState(0);
    const limit = 10

    const onNext = () => {
        if ((currentPage + 1) * limit >= totalPosts) return
        onPaginationChange((currentPage + 1) * limit, limit);
        setcurrentPage(currentPage + 1)
    }

    const onBack = () => {
        if (currentPage == 0) return
        onPaginationChange((currentPage - 1) * limit, limit)
        setcurrentPage(currentPage - 1)
    }

    return (
        <div className='w-full mt-5'>
            <div>
                {
                    posts.length > 0 ? posts?.map((post, index: number) => (
                        <PostCard post={post} key={`${post._id}_${index}`} />
                    )) : (
                        <p className='text-center'>No Posts Found</p>
                    )
                }
            </div>
            <div className='mt-3 flex gap-3 items-center'>
                <div className='flex gap-2'>
                    <BiLeftArrow className='cursor-pointer' onClick={onBack} color={currentPage == 0 ? 'gray' : 'black'} />
                    <BiRightArrow className='cursor-pointer' onClick={onNext} color={(currentPage + 1) * limit >= totalPosts ? 'gray' : 'black'} />
                </div>
                <p>
                    Total Posts: {totalPosts}
                </p>

            </div>
        </div>
    )
}
