'use client';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { Fragment } from 'react'

import { LocationDropdown } from '@/app/components/locationDropdown';
import { createOrganization } from '@/services/handlers/organization.handlers';
import { useRouter } from 'next/navigation';
import { path } from '@/helpers/path';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { login } from '@/store/userReducer';
import { setCookie } from 'cookies-next';
import { statusValue } from '@/helpers/enum';
import { FaCloudUploadAlt } from 'react-icons/fa';

const ValidationSchema = Yup.object().shape({
    orgName: Yup.string().required('Required'),
    orgWebsite: Yup.string().required('Required'),
    orgLogo: Yup.mixed().required('Required'),
    orgEmail: Yup.string().email('Invalid email').required('Required'),
    orgAddress: Yup.object().shape({
        addressLine1: Yup.string(),
        city: Yup.string(),
        country: Yup.string(),
        map_id: Yup.string(),
        state: Yup.string(),
        postalCode: Yup.string(),
    }),
    jobTitle: Yup.string().required(),
    orgOffice: Yup.object().shape({
        officeBuilding: Yup.string().required('Required'),
        roomNumber: Yup.number().required('Required'),
    })
})

const OrgForm = () => {
    //hooks
    const dispatch = useDispatch()
    const router = useRouter();
    const { data: userData } = useSession();
    const formik = useFormik({
        validationSchema: ValidationSchema,
        enableReinitialize: true,
        initialValues: {
            orgName: '',
            orgWebsite: '',
            orgLogo: null,
            orgEmail: userData?.user?.email || '',
            email: userData?.user?.email || '',
            orgOffice: {
                officeBuilding: '',
                roomNumber: '',
            },
            orgAddress: null,
            jobTitle: '',
        },
        onSubmit: values => {
            handleSubmit(values)
        }

    })

    const handleSubmit = async (values: any) => {

        let formdata = new FormData();
        Object.keys(values).forEach((key) => {
            if (key === 'orgAddress') {
                Object.keys(values[key]).forEach((k) => {
                    formdata.append(`${key}[${k}]`, values[key][k])
                })
            } else if (key === 'orgOffice') {
                formdata.append('orgOfficeRoomNumber', values.orgOffice.roomNumber);
                formdata.append('orgOfficeOfficeBuilding', values.orgOffice.officeBuilding);
            } else {
                formdata.append(key, values[key])
            }
        })

        // setuser details for staff
        formdata.append('username', userData?.user?.name || '')
        formdata.append('userimage', userData?.user?.image || '')


        try {
            const res: any = await createOrganization(formdata);
            //save the org and staff info into redux
            if (res?.data?.data?.organization) {
                dispatch(login({ organization: res?.data?.data?.organization, staff: res?.data?.data?.staff }))
                setCookie('status', statusValue.pending)
                router.push(path.verification.pending)
            }
        } catch (error) {
            //console.log(error);
        }
    }

    const handleSelect = (address: any) => {
        formik.setFieldValue('orgAddress', address)

    }
    return (
        <div className='flex flex-col gap-y-4'>
            <div>
                <h1 className='font-semibold text-2xl mb-4'>Create an Organization</h1>
                {/* <label className='text-xl font-bold' htmlFor="logo">Logo</label>
            <input type='file' accept="image/x-png,image/gif,image/jpeg" onChange={(e) => formik.setFieldValue('orgLogo', e.target.files![0])} id='logo' name='logo' placeholder='Enter your organization name' className='w-full p-2 rounded-2xl border-2 border-black' /> */}
                <div className="max-w-full">
                    <label
                        className="flex justify-center w-full h-44 px-4 transition bg-black  rounded-3xl appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                        {
                            formik.values.orgLogo ? <img src={URL.createObjectURL(formik.values.orgLogo)} /> : (
                                <Fragment>
                                    <span className="flex flex-col justify-center items-center space-x-2">
                                        <div>
                                            <FaCloudUploadAlt size={40} color='white' />
                                        </div>
                                        <span className="font-medium text-center text-blue-400">
                                            Choose file or drag and drop
                                        </span>
                                        <span className="font-medium text-gray-600 text-center">
                                            Image {'(4mb)'}
                                        </span>
                                    </span>
                                </Fragment>
                            )
                        }
                        <input
                            type='file'
                            accept="image/png, image/jpeg"
                            onChange={(e) => formik.setFieldValue('orgLogo', e.target.files![0])} id='logo'
                            name='logo'
                            className="hidden"
                        />
                    </label>

                </div>
                {formik.errors.orgLogo && formik.touched.orgLogo && <small className='text-red-500'>{formik.errors.orgLogo}</small>}
            </div>

            {/* Organization name */}
            <div>
                <label className='text-xl font-bold' htmlFor="orgName">Organization Name</label>
                <input onChange={formik.handleChange} id='orgName' name='orgName' type="text" placeholder='Enter your organization name' className='w-full p-2 rounded-xl border border-black' />
                {formik.errors.orgName && formik.touched.orgName && <small className='text-red-500'>{formik.errors.orgName}</small>}
            </div>

            {/* Organization website */}
            <div className='flex flex-col md:flex-row  md:gap-5 gap-5'>
                <div className='w-full'>
                    <label className='text-xl font-bold' htmlFor="orgWebsite">Organization Website</label>
                    <input onChange={formik.handleChange} id='orgWebsite' name='orgWebsite' type="text" placeholder='Enter your organization website' className='w-full p-2 rounded-xl border border-black' />
                    {formik.errors.orgWebsite && formik.touched.orgWebsite && <small className='text-red-500'>{formik.errors.orgWebsite}</small>}
                </div>

                <div className='w-full'>
                    <label className='text-xl font-bold' htmlFor="orgEmail">Organization Email</label>
                    <input onChange={formik.handleChange} value={formik.values.email} id='orgEmail' name='email' type="text" placeholder='Enter your organization email' className='w-full p-2 rounded-xl border border-black' />

                    {formik.errors.email && formik.touched.email && <small className='text-red-500'>{formik.errors.email}</small>}
                </div>
            </div>

            {/* Organization address */}
            <div className='w-full'>
                <label className='text-xl font-bold' htmlFor="orgWebsite">Organization Address</label>
                <div className='border border-black p-2 rounded-xl'>

                    <LocationDropdown onSelect={(obj: any) => handleSelect(obj)} />
                </div>
            </div>
            {formik.errors.orgAddress && formik.touched.orgAddress && <small className='text-red-500'>{formik.errors.orgAddress}</small>}


            {/* Organization Office */}
            <div className='flex flex-col md:flex-row  md:gap-5 gap-5'>
                <div className='w-full'>

                    <label className='text-xl font-bold' htmlFor="orgOffice.roomNumber">Organization Office Number</label>
                    <input onChange={formik.handleChange} id='orgOffice.roomNumber' name='orgOffice.roomNumber' type="number" placeholder='Enter your organization office number' className='w-full p-2 rounded-xl border border-black' />
                    {formik.errors.orgOffice?.roomNumber && formik.touched.orgOffice?.roomNumber && <small className='text-red-500'>{formik.errors.orgOffice.roomNumber}</small>}

                </div>

                <div className='w-full'>
                    <label className='text-xl font-bold' htmlFor="orgOffice.officeBuilding">Organization Building Name</label>
                    <input onChange={formik.handleChange} id='orgOffice.officeBuilding' name='orgOffice.officeBuilding' type="text" placeholder='Enter your organization building name' className='w-full p-2 rounded-xl border border-black' />
                    {formik.errors.orgOffice?.officeBuilding && formik.touched.orgOffice?.officeBuilding && <small className='text-red-500'>{formik.errors.orgOffice?.officeBuilding}</small>}
                </div>
            </div>

            {/* Your role */}
            <div className='mt-12'>
                <label className='text-xl font-bold' htmlFor="role">Your Role</label>
                <input onChange={formik.handleChange} id='role' name='jobTitle' type="text" placeholder='Enter your role' className='w-full p-2 rounded-xl border border-black' />
                {formik.errors.jobTitle && formik.touched.jobTitle && <small className='text-red-500'>{formik.errors.jobTitle}</small>}

            </div>
            <button type="button" onClick={(e: any) => { formik.handleSubmit(e); }} className=' text-white p-2 px-8 bg-blue-950 hover:bg-blue-900 text-lg w-fit ml-auto rounded-2xl'>Save {'&'} Next</button>
        </div>
    )
}

export default OrgForm