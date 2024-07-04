import React, { FC } from 'react'
import cn from 'classnames'

interface IProps{
    className?: string
    onClick?: ()=> void
    type?: "button" | "submit" | "reset" | undefined;
    children: React.ReactNode
    LeftIcon?: any | React.JSX.Element
    RightIcon?: any | React.JSX.Element
    variant?: 'gray' | 'purple'
    disabled?: boolean
}

let variants = {
    purple: 'bg-[#635bff] text-white hover:bg-[#4611cf]',
    gray: 'bg-gray-200 text-black hover:bg-gray-300',
}

const Button:FC<IProps> = (props) => {
    const {className, onClick, type='button',children, LeftIcon, RightIcon, variant='purple', disabled=false} = props
  return (
    <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(className,`px-5 py-2 ${variant && variants[variant]}  border-none rounded-lg  flex items-center justify-between gap-2`)}
    >
        {LeftIcon && LeftIcon } {children} {RightIcon && <RightIcon />}
    </button>
  )
}

export default Button