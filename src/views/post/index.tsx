'use client';
import React, { useEffect, useState } from 'react'
import Post from '@/views/post'
import Button from '@/app/components/Button'
import { FaPlus } from 'react-icons/fa'
import { useRouter } from 'next/navigation';
import { path } from '@/helpers/path';
import { fetchPosts } from '@/services/handlers/post.handlers';
import { useSelector } from '@/store/store';
import { IPost } from '@/types/post.interface';
import { PostCard } from '@/app/components/PostCard';
import { PostsTable } from './PostsTable';

const index = () => {
    const [posts, setPosts] = useState<IPost[]>([])
    const [total, setTotal] = useState<number>(0)
    const [selection, setSelection] = useState<number>(0);
    
    // const [post, setMembers] = useState<StaffType[]>([])
    //hooks
    const router = useRouter();
    const org = useSelector(state => state?.user?.organization)

    const testOrgId = "669bea28422d685053f6da92"; 
    useEffect(() => {
        /*console.log("testing1");
        if(org){
          console.log("testing2");
          fetchPostData()
        }*/
        fetchPostData();
    }, [org, selection])
   
    const fetchPostData = async(offset?:number,perpage?:number) => {
        try {
          const orgId = org?._id || testOrgId;
          const postsData:any = await fetchPosts(orgId, {offset,perpage, category: selection == 0 ? 'upcoming' : 'past'}) 
          if(postsData){
            if(postsData?.posts){
               setPosts(postsData?.posts)
            }
            setTotal(postsData?.total || 0)
          }
        } catch (error) {
          //console.log(error)
        }
      }
      
  return (
    <div>
        <div className='flex flex-col md:flex-row gap-3 justify-between w-full'>
            <h1 className='text-3xl font-bold'>Posts</h1>
            <Button className='w-fit' LeftIcon={<FaPlus/>} onClick={()=> router.push(path.post.create)}>
                <h2 className='text-base md:text-lg'> CREATE NEW POST</h2>
            </Button>
        </div>
        <div className='mt-2'>
            <div className='flex gap-5 border-b border-black border-opacity-50 w-full'>
                <p onClick={()=>setSelection(0)} className={`cursor-pointer ${selection == 0 ? 'border-b-2 border-[#635bff]': 'border-none'}`}>Upcoming</p>
                <p onClick={()=>setSelection(1)} className={`cursor-pointer ${selection == 1 ? 'border-b-2 border-[#635bff]': 'border-none'}`}>Past</p>
            </div>
            <div>
                <PostsTable posts={posts} totalPosts={total} onPaginationChange={fetchPostData}/>
            </div>
        </div>

    </div>
  )
}

export default index