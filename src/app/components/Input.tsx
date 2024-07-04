import React, { FC } from 'react'
import cn from 'classnames'

interface IProps{
    className?: string
    placeholder?: string
    id?: string
    name?: string
    onChange?: (e:any)=> void
    type?: string;
    label?: string;
    defaultValue?: any
    value?: string | any
    multiline?: boolean
    [otherProps:string]: any;
}

const Input:FC<IProps> = (props) => {
    const {className, onChange, type='text', name, id, placeholder, label, value, defaultValue, multiline = false, ...otherProps} = props
  return (
    <div className='w-full  flex flex-col sm:flex-row items-start sm:items-center sm:gap-1 gap-3'>
        {
           label && <p className={cn('text-sm sm:w-2/6 md:w-1/6 capitalize')}>{label}</p>
        }
        {multiline  ? (
          <textarea
            id={id}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            defaultValue={defaultValue}
            className={cn(className,'w-full px-2 py-1 flex-1 rounded-lg border border-gray-200 flex items-center justify-between gap-2')}
            {...otherProps}
          />
        ) : (
        <input
            id={id}
            name={name}
            placeholder={placeholder}
            type={type}
            value={value}
            onChange={onChange}
            defaultValue={defaultValue}
            className={cn(className,'w-full px-2 py-1 flex-1 rounded-lg border border-gray-200 flex items-center justify-between gap-2')}
            {...otherProps}
        />)}

    </div>
  )
}

export default Input