'use client'
import Analytics from '@/app/components/Analytics'
import Button from '@/app/components/Button'
import { path } from '@/helpers/path'
import { fetchPosts } from '@/services/handlers/post.handlers'
import { useSelector } from '@/store/store'
import { IPost } from '@/types/post.interface'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaCheckSquare, FaChevronRight, FaPlus } from 'react-icons/fa'
import { MdEmojiEmotions } from 'react-icons/md'


const Index = () => {
  const [orgName, setOrgName] = useState<string>('');
  const [posts, setPosts] = useState<IPost[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  //hooks
  const org = useSelector(state => state.user?.organization);
  const router = useRouter()

    useEffect(() => {
        if(org) {
          setOrgName(org?.orgName);
          fetchPostData()
        }
            
    }, [org])
   
    const fetchPostData = async(offset?:number,perpage?:number) => {
        try {
          setLoading(true)
          const postsData:any = await fetchPosts(org?._id!, {offset,perpage, category:  'upcoming'}) 
          if(postsData){
            if(postsData?.posts){
               setPosts(postsData?.posts)
            }
          }
          setLoading(false)

        } catch (error) {
          //console.log(error)
          setLoading(false)

        }
      }
      
  return (
    <div>
        <div className='flex justify-between gap-3 flex-col md:flex-row w-full'>
            <h1 className='text-3xl '>Hey <span className='font-bold'>{orgName}{'!'}</span></h1>
            <Button className='w-fit' LeftIcon={<FaPlus/>} onClick={()=> router.push(path.post.create)}>
                <h2 className='text-lg'> CREATE NEW POST</h2>
            </Button>

        </div>
        <Analytics />
        <div className='mt-5'>
          <div className='flex justify-between items-center'>
            <p className='text-[#635bff] text-xl font-bold'>Upcoming Post</p>
            <p className='cursor-pointer text-sm underline' onClick={()=>router.push(path.post.index)}>View All Posts</p>
          </div>
          <div className='mt-2 flex flex-col gap-3'>
              {
                loading ? <p className='text-center'>loading...</p> :posts.length > 0 ? posts.map(post => (
                  <div key={post._id} className='w-full flex flex-col md:flex-row items-center justify-end border border-[#635bff] px-2 py-5 rounded-lg'>
                    <p className='w-full md:w-3/5 font-bold text-base lg:text-lg text-left '>{post.title}</p>
                    <div className='flex flex-col items-center justify-between md:flex-row w-full md:w-2/5items-center gap-3'>
                        <p className='w-full md:w-1/3 text-base lg:text-lg'>{post.eventDate}</p>
                        <div className='flex justify-around gap-2 md:gap-12 w-full'>
                          <p className='font-bold py-2 flex-1 text-center px-3  rounded-full bg-[#635bff] text-white text-base lg:text-lg flex items-center justify-center'>{post.category}</p>
                          <p className={`font-bold py-2 flex-1 flex items-center justify-center gap-2 text-center px-3 text-base lg:text-lg rounded-full ${!post.verified ? 'bg-orange-400': 'bg-green-400' }`}>{post.verified? 'Posted': 'In Review'} {post.verified ? (<FaCheckSquare color='green'/>): (<MdEmojiEmotions color='yellow'/>)}</p>
                          <a className=' flex items-center justify-end' href={`/dashboard/post/${post._id}`}>
                            <p ><FaChevronRight size={24} className='text-[#635bff]'/></p>
                          </a>
                        </div>
                    </div>
                  </div>
                )): (
                  <p className=' text-center mt-5'>Create a new post!</p>
                )
              }
          </div>
        </div>
    </div>
  )
}

export default Index