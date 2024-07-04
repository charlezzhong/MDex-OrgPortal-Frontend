'use client'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import React, { FC, useEffect } from 'react'

interface IProps {
    children: React.ReactNode
}

const AuthGuard:FC<IProps> = ({children}) => {
  
  // hooks
  const {data:session, status} = useSession();

  //router hooks
  const router = useRouter()
  const pathname = usePathname()

  /*
  * if the session is loading, display a loader component
  */
  if(status === 'loading') return <div>Loading...</div>
  
  /*
    * if the session is null, redirect to the signin page
    * if the session is not null, redirect to the home page
  */
  if(!session) {
    if(pathname !== '/signin')
      router.push('/signin')
    else 
      return (
        <div>{children}</div>
      )
  }else{
    
    // if the session is not null, and the user tries to access the signin page, redirect to the home page
    if(pathname === '/signin'){
      router.push('/')
      return <></>
    }
    else
      return (
        <div>{children}</div>
      )
  }
}

export default AuthGuard