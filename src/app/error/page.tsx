'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { FC, Suspense } from 'react'
import Button from '../components/Button';

const ErrorComponent: FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const search = searchParams.get('error')
  return (
    <div>
      <p className='text-center font-bold text-lg'>{search ? search.replaceAll('_', ' ') : "Something went wrong"}</p>
      <Button onClick={() => router.push('/signin')} className='m-auto mt-8'>Go back to login</Button>
    </div>
  )
}

const page = () => {

  return (
    <Suspense>
      <ErrorComponent />
    </Suspense>
  )
}

export default page