'use client';
import React, { useState } from 'react'
import Input from '@/app/components/Input';
import { IPost } from '@/types/post.interface'

//libraries
import * as Yup from 'yup'
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import Button from '@/app/components/Button';
import { updatePost } from '@/services/handlers/post.handlers';
import toast from 'react-hot-toast';
import RenderImage from '@/app/components/RenderImage';
import { revalidatePath } from 'next/cache';
import { useRouter } from 'next/navigation';

type Props = {
  post: IPost
  rsvpCounts: number
}

const validationSchema = Yup.object().shape({
  description: Yup.string().required(),
  eventTime: Yup.date().required("start time cannot be empty"),
  eventEndTime: Yup.date().min(
    Yup.ref('eventTime'),
    "end date can't be before start date"
  ).required(),
})


export const PostDetails = ({ post, rsvpCounts = 0 }: Props) => {
  const [enable, setEnable] = useState(false)

  const { push } = useRouter();

  //hooks
  const formik = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      description: post.description,
      eventTime: dayjs(`${post.eventDate} ${post?.eventTime}`).toISOString(),
      eventEndTime: post.eventEndTime,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      handleUpdate(values)
    }
  })

  const handleUpdate = async (values: any) => {
    const dataToSend = {
      ...post,
      eventDate: dayjs(values.eventTime).format('MM/DD/YYYY'),
      eventTime: dayjs(values.eventTime).format('HH:MM'),
      eventEndTime: (values?.eventEndTime),
      description: values?.description,
    }

    try {

      await updatePost(dataToSend, post._id);
      toast.success('Successfully updated');
      push('/dashboard/post')

    } catch (error: any) {
      let msg = error?.response?.data?.message || "Something went wrong"
      toast.error(msg)
    }
  }

  /**
   * Converts an ISO string or Date object to a local date and time string.
   * 
   * @param {string| Date} isoString - The ISO string or Date object to convert.
   * 
   * @returns {string} The local date and time string in the format YYYY-MM-DDTHH:MM.
   */
  function toLocalDateTime(isoString: string | Date): string {
    const date = new Date(isoString);
    // Convert to YYYY-MM-DDTHH:MM format for datetime-local input
    const ten = (i: number) => (i < 10 ? '0' : '') + i;

    const YYYY = date.getFullYear();
    const MM = ten(date.getMonth() + 1);
    const DD = ten(date.getDate());
    const HH = ten(date.getHours());
    const MIN = ten(date.getMinutes());
    return `${YYYY}-${MM}-${DD}T${HH}:${MIN}`;
  }

  return (
    <div className=' mt-5'>
      <div className='flex gap-2 justify-between'>
        <div className='flex gap-3 items-center'>
          <p className='p-4 bg-blue-200 rounded-lg border border-black'>Number Of Saves: {post?.numOfSaves || 0}</p>
          {post.rsvp && <p className='p-4 bg-blue-200 rounded-lg border border-black'>Total Registered: {rsvpCounts}</p>}
        </div>
        <div className='flex items-center gap-4'>
          <p className='py-1 px-3 rounded-full bg-[#635bff] text-white'>{post?.category}</p>
          <p className={`py-1 px-3 rounded-full ${post?.verified ? 'bg-orange-400' : 'bg-green-400'}`}>{post?.verified ? 'Posted' : 'In Review'}</p>
        </div>
      </div>
      <div className=' flex flex-col md:flex-row min-h-[20vh] w-full gap-2 mt-5'>
        <div className='w-full md:w-2/5 rounded-lg'>
          <RenderImage src={post.image} className='rounded-xl h-110 object-cover' />
        </div>
        <div className='w-full md:w-3/5'>
          <div className=' flex justify-end mb-4'>
            <button onClick={() => setEnable(!enable)} className=' bg-white rounded-md border px-2 py-1'>Edit</button>
          </div>
          {enable ? (
            <div className='w-full px-2'>
              <div className='mb-4'>
                <Input onChange={formik.handleChange} value={formik.values.description} label='Description' name='description' />
              </div>
              <div className='mb-4'>
                <Input type='datetime-local' onChange={formik.handleChange} value={toLocalDateTime(formik.values.eventTime)} label='Start Time' name='eventTime' />
                {formik.errors?.eventTime && <p className='text-red-500'>{formik.errors?.eventTime}</p>}
              </div>

              <div className='mb-4'>
                <Input type='datetime-local' onChange={formik.handleChange} value={toLocalDateTime(formik.values.eventEndTime)} label='End Time' name='eventEndTime' />
                {formik.errors?.eventEndTime && <p className='text-red-500'>{formik.errors?.eventEndTime as string}</p>}
              </div>

              <div>
                <Button className='ml-auto' onClick={formik.handleSubmit}>
                  Update
                </Button>
              </div>
            </div>
          ) : (
            <div className='w-full px-2'>
              <div className='mb-4'>
                <div className='font-semibold'>Date:</div>
                <div>{post.eventDate}</div>
              </div>
              <div className='mb-4'>
                <div className='font-semibold'>Start Time:</div>
                <div>{post.eventTime}</div>
              </div>
              <div className='mb-4'>
                <div className='font-semibold'>End Time:</div>
                <div>{dayjs(post.eventEndTime).format("HH:mm")}</div>
              </div>
              <div className='mb-4'>
                <div className='font-semibold'>Location:</div>
                <div>{post.eventLocation}</div>
              </div>
              <div className='mb-4'>
                <div className='font-semibold'>Location:</div>
                <div>{post.eventLocationDescription}</div>
              </div>
              <div className='mb-4'>
                <div className='font-semibold'>Description:</div>
                <div>{post.description}</div>
              </div>
              <div className='mb-4'>
                <div className='font-semibold'>Description:</div>
                <div>{post.campus}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
