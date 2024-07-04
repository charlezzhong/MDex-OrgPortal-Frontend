import { fetchPost, fetchRsvpsForPost } from '@/services/handlers/post.handlers'
import { IPost } from '@/types/post.interface'
import Post from '@/views/post/Post'
import React from 'react'

const page = async ( {params }: { params: { id: string } }) => {
    const post:IPost = await fetchPost(params?.id)
    let rsvps = []
    if(post?.rsvp?._id){
        try {
            let response = await fetchRsvpsForPost(post?.rsvp?._id)
            if(response)
                rsvps = response
        } catch (error) {
            //console.log(error)
        }
    }
    if(!post){
        return (
            <div>
                <h1 className='text-2xl text-center mt-4'>Oops! Looks like this post doesn't exist anymore</h1>
            </div>
        )
    }
    return (
        <div><Post post={post} rsvps={rsvps}/></div>
    )
}

export default page