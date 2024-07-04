import classNames from 'classnames'
import Image from 'next/image'
import React from 'react'

type Props = {
    src:string | undefined
    className?: string
}

const RenderImage = (props: Props) => {
  return (
    props.src ? (
        <Image src={props.src} className='bg-contain md:bg-contain' fill alt='post img'/>
    ) : (
        <div className={classNames(props.className,'w-full h-full flex justify-center items-center rounded-lg bg-[#635bff]')}>
            <p className='text-white' style={{ fontSize: '20px', fontWeight: 'bold' }}>Coming soon</p>

        </div>
    ) 
  )
}

export default RenderImage