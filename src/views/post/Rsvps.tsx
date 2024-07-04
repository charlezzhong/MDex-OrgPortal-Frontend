import { IRsvp } from '@/types/post.interface'
import { RsvpUsers } from '@/types/rsvpUsers'
import React from 'react'

type Props = {
    rsvps : RsvpUsers[]
}

export const Rsvps = ({rsvps}: Props) => {
  return (
    <div className='mt-5 overflow-x-scroll w-full '>
      <table className='overflow-x-scroll w-full table'>
            <thead >
                <tr className='border-y border-opacity-20 border-black'>
                    <th className='text-left'>Name</th>
                    <th className='text-left'>Email</th>
                    <th className='text-left'>Optional1</th>
                    <th className='text-left'>Optional2</th>
                    <th className='text-left'>Optional3</th>
                </tr>
            </thead>
            <tbody >
                {
                    rsvps.length > 0 && rsvps.map((rsvp) => (
                        <tr key={rsvp._id}>
                            <td className='p-1'>
                                <p className='border w-fit px-3 rounded-md'>{rsvp.userId.name}</p>
                            </td>
                            <td className='p-1'>
                                <p className='border w-fit px-3 rounded-md'>{rsvp.userId.email}</p>
                            </td>
                            <td className='p-1'>
                                <p className='border w-fit px-3 rounded-md'>{rsvp?.answers.optional1 || '-'}</p>
                            </td>
                            <td className='p-1'>
                              <p className='border w-fit px-3 rounded-md'>{rsvp?.answers.optional2 || '-'}</p>
                            </td>

                            <td className='p-1'>
                              <p className='border w-fit px-3 rounded-md'>{rsvp?.answers.optional3 || '-'}</p>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    </div>
  )
}

