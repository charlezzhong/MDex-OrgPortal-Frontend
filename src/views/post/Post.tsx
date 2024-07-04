'use client'
import { IPost, IRsvp } from '@/types/post.interface'
import React, { useState } from 'react'
import { PostDetails } from './PostDetails'
import { Rsvps } from './Rsvps'
import { RsvpUsers } from '@/types/rsvpUsers'
import Registeration from './Registeration'

type Props = {
    post: IPost
    rsvps: IRsvp[]
}

interface ITabs  {
    [key:string]: {
        Component: any
    }
}

const Tabs = {
    Overview : {
        Component: (post:IPost, rsvpCount:number) => <PostDetails post={post} rsvpCounts={rsvpCount}/>
    },
    Registered : {
        Component: (rsvp:RsvpUsers[]) => <Rsvps rsvps={rsvp} />
    },
    Registeration : {
        Component: (post:IPost) => <Registeration post={post} />
    },
} as ITabs

const Post = ({post, rsvps}: Props) => {
    const [selectedTab, setselectedTab] = useState<string>('Overview')
  return (
    <div>
        <h1 className='text-3xl font-bold capitalize'>{post.title}</h1>
        <div className='flex gap-2 border-b border-gray-300 '>
            {
                Object.keys(Tabs).map((tab: string) =>{ 
                  return post.rsvp ? (
                        <p key={tab} className={`p-2 cursor-pointer ${selectedTab == tab ? 'border-b border-[#635bff]' : 'border-none'}`} onClick={()=> {
                            setselectedTab(tab)
                        }}>{tab}</p>
                    ) : tab == 'Overview' && (  // Only renders overview in case RSVP not added when creating the post
                        <p key={tab} className={`p-2 cursor-pointer ${selectedTab == tab ? 'border-b border-[#635bff]' : 'border-none'}`} onClick={()=> {
                            setselectedTab(tab)
                        }}>{tab}</p>
                    ) 
                })
            }
        </div>
        {selectedTab == 'Overview' && Tabs[selectedTab].Component(post, rsvps.length)}
        {selectedTab == 'Registered' && Tabs[selectedTab].Component(rsvps)}
        {selectedTab == 'Registeration' && Tabs[selectedTab].Component(post)}
    </div>
  )
}

export default Post