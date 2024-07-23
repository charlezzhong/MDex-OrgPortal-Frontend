'use client';
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Switch from "@/app/components/Switch";
import { Divider } from "@/app/components/divider";
import { updateOrganization } from "@/services/handlers/organization.handlers";
import { updateStaffs } from "@/services/handlers/staff.handlers";
import { imgUrl } from "@/services/uri";
import { useAppDispatch, useSelector } from "@/store/store";
import { updateOrg, updateStaff } from "@/store/userReducer";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as yup from 'yup';
import axios from "axios";

const validationSchema = yup.object().shape({
  orgName: yup.string().required('Name is required'),
  orgBio: yup.string().required("Bio is required"),
  orgWebsite: yup.string(),
  orgInsta: yup.string()
})

interface IHours {
  sunday: {start:string; end:string, isClosed:boolean}
  monday: {start:string; end:string, isClosed:boolean}
  tuesday: {start:string; end:string, isClosed:boolean}
  wednesday: {start:string; end:string, isClosed:boolean}
  thursday: {start:string; end:string, isClosed:boolean}
  friday: {start:string; end:string, isClosed:boolean}
  saturday: {start:string; end:string, isClosed:boolean}
}
interface IOffice {
  room:string;
  office:string;
  hours: IHours
}

export const ProfileForm = () => {
  const staff = useSelector(state => state.user.staff)
  const [showUpdate, setShowUpdate] = useState('');
  const [files, setfiles] = useState<any[]>([]);
  const [room, setRoom] = useState<string>(staff?.office?.roomNumber || '');
  const [office, setOffice] = useState<string>(staff?.office?.officeBuilding || '');
  // const [hours, setHours] = useState<string>(staff?.office?.hours || '');
  const [loading, setLoading] = useState(false);

  const handleStripeOnboarding = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/ipa/v2/testing/stripe/onboard', {
        organizationId: "669bea28422d685053f6da92", 
      });
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error onboarding to Stripe:', error);
      setLoading(false);
    }
  };
  
  //hooks
  const dispatch = useAppDispatch()
  const user = useSelector(state => state.user);
  const formik = useFormik({
    initialValues:{
      orgName: user?.organization?.orgName || '',
      orgBio: user?.organization?.orgBio || '',
      orgWebsite:  user?.organization?.orgWebsite || '',
      orgInsta: user?.organization?.orgInsta ||  '',
      email: user?.organization?.email ||  ''
    },
    enableReinitialize:true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
     
      handleOrgUpdate(values)
    }
  })

 
  const officeFormik = useFormik({
    initialValues:{
      room: user?.organization?.office?.roomNumber || '',
      office: user?.organization?.office?.officeBuilding || '',
      hours:  user?.organization?.office?.hours || {
          sunday:{
            start:'',
            end: '',
            isClosed:false
          },
          monday:{
            start:'',
            end: '',
            isClosed:false
          },
          tuesday:{
            start:'',
            end: '',
            isClosed:false
          },
          wednesday:{
            start:'',
            end: '',
            isClosed:false
          },
          thursday:{
            start:'',
            end: '',
            isClosed:false
          },
          friday:{
            start:'',
            end: '',
            isClosed:false
          },
          saturday:{
            start:'',
            end: '',
            isClosed:false
          },
      },
    } as IOffice,
    enableReinitialize:true,
    onSubmit: (values) => {
      handleOfficeUpdate(values)
    }
  })

  useEffect(() => {
    if(user.organization?.media?.length){
      setfiles(user?.organization?.media)
    }
  }, [user.organization])
  
  const handleOrgUpdate = async (values:any) => {
    try {
      const res:any = await updateOrganization( values, user?.organization?._id! )
      if(res?.data?.data){
        dispatch(updateOrg(res?.data?.data))
        setShowUpdate('')
        toast.success('Successfully Updated')
      }
    } catch (error) {
      //console.log(error)
    }
  }
  const handleOfficeUpdate = async (values:IOffice) => {
    try {
      let dataToSend = {
        "office":{
          "officeBuilding": values.office,
          "roomNumber": values.room,
          hours : values.hours
        }
      }
      handleOrgUpdate(dataToSend)
      return
      // if(!staff?._id){
      //   toast.error('No staff entries found')
      //   return 
      // }
     
      // const res:any = await updateStaffs( dataToSend, staff?._id! )
      // if(res?.data?.data){
      //   dispatch(updateStaff(res?.data?.data))
      //   toast.success('Successfully Updated')
      // }
    } catch (error:any) {
      toast.error(error?.message || "Something went wrong")
    }
  }

  const handleUpload = (e:any, index:number) => {
    let imgs = [...files]
    imgs[index] = e.target.files[0]
    setfiles(imgs)
  }
  const handleRemove = (index:number) => {
    let imgs = [...files]
    imgs.splice(index,1)
    setfiles(imgs)
  }

  const handleImageUpdate = () => {
    let formData = new FormData()

    files.map((file:any) => {
      formData.append('media',file)
    })
    handleOrgUpdate(formData)
  }

  const [oldValues, setOldValues] = useState(formik.values);

  const handleUpdateBtn = (txt:string) => {
    if (txt === '') {
      formik.setValues(oldValues);
    } else {
      setOldValues(formik.values);
    }
    setShowUpdate(txt);
  }

  return (
    <div>
      <div className="w-full p-6">
      <section aria-labelledby="profile-information" className="mb-6">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold">Profile</h1>
        {showUpdate !== 'profile' && (
          <Button onClick={() => handleUpdateBtn('profile')} variant="gray">
            Edit
          </Button>
        )}
      </div>
      <Divider />
      <div className="mt-5">
        <Input
          disabled={showUpdate !== 'profile'}
          onChange={formik.handleChange}
          value={formik.values.orgName}
          id='orgName'
          name='orgName'
          label="Org Name"
          placeholder="Example Organization Name"
        />
        {formik.errors?.orgName && <small className="my-1 text-red-500">{formik.errors?.orgName}</small>}
        <Input
          disabled={showUpdate !== 'profile'}
          value={formik.values.email}
          onChange={formik.handleChange}
          id='orgEmail'
          name='email'
          label="Email"
          placeholder="example@gmail.com"
        />
        {formik.errors?.email && <small className="my-1 text-red-500">{formik.errors?.email}</small>}
        <Input
          disabled={showUpdate !== 'profile'}
          onChange={formik.handleChange}
          value={formik.values.orgBio}
          id='orgBio'
          name='orgBio'
          label="Bio"
          placeholder="Example bio here with 150 character maximum"
        />
        {formik.errors?.orgBio && <small className="my-1 text-red-500">{formik.errors?.orgBio}</small>}
      </div>
      {showUpdate === 'profile' && (
        <div className="mt-4 flex">
          <Button className="ml-auto mr-2" onClick={formik.handleSubmit}>Update</Button>
          <Button className="ml-2" onClick={() => handleUpdateBtn('')}>Cancel</Button>
        </div>
      )}
    </section>

        {/* Links ifo section */}
        <section aria-labelledby="links-information" className="my-6">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold" id="links-information">
              Links
            </h2>
            <Button onClick={() => handleUpdateBtn(showUpdate == 'links' ? '' : 'links')} variant="gray">Edit</Button>
          </div>
          <div className="grid grid-cols-1 gap-4 mt-2">
            <Input disabled={!(showUpdate == 'links')}  onChange={formik.handleChange} value={formik.values.orgWebsite} id='orgWebsite' name='orgWebsite' label="Website" placeholder="www.example.com" />
            <Input disabled={!(showUpdate == 'links')}  onChange={formik.handleChange} value={formik.values.orgInsta} id='orgInsta' name='orgInsta' label="Instagram" placeholder="www.instagram.com/example" />
          </div>
          {showUpdate == 'links' && <Button className="mt-4 ml-auto" onClick={formik.handleSubmit}>Update</Button>}
        </section>

        {/* Office Info Section */}
        <section aria-labelledby="office-information" className="my-6">
          <div className="flex justify-between items-start">
            <h2 className="text-3xl font-semibold" id="office-information">
              Office
            </h2>
              <Button onClick={() => handleUpdateBtn(showUpdate == 'office' ? '' : 'office')} variant="gray">Edit</   Button>          
            </div>
          <Divider/>
          <div className="grid grid-cols-1 gap-4 mt-6">
            <Input disabled={!(showUpdate == 'office')} type="number" value={officeFormik.values.room} onChange={officeFormik.handleChange} label="Room #" name="room" placeholder="Example room number" />
            <Input disabled={!(showUpdate == 'office')} value={officeFormik.values.office} onChange={officeFormik.handleChange} label="Building Name" name="office" placeholder="Example Building Name" />
            {/* Hours */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-10">
              <p className="w-1/6">Hours</p>
              <div className="w-full">
                {
                  Object.keys(officeFormik.values.hours).map((day:string,index: number) => (
                    // console.log(key),
                    <div key={`${day}-${index}`}>
                      <p className="font-bold capitalize">{day}</p>
                      <div className="flex gap-2 items-center mt-2">
                        <div className="w-1/2">
                          <p className=" text-xs">Start</p>
                          <Input 
                            disabled={!(showUpdate == 'office')}
                            className="w-full" 
                            type="time" 
                            value={officeFormik.values?.hours && day && officeFormik.values.hours[day as keyof IHours]['start']} 
                            name={`hours.${day}.start`} onChange={officeFormik.handleChange} 
                            placeholder="office hours"
                          />
                        </div>
                        <div className="w-1/2">
                          <p className=" text-xs">End</p>
                          <Input 
                            disabled={!(showUpdate == 'office')} 
                            className="w-full" 
                            type="time" 
                            value={officeFormik.values?.hours && day && officeFormik.values.hours[day as keyof IHours]['end']} 
                            name={`hours.${day}.end`} 
                            onChange={officeFormik.handleChange} 
                            placeholder="office hours"
                          />
                        </div>
                        <div>
                          <Switch 
                            id={day}
                            key={day}
                            disabled={!(showUpdate == 'office')}
                            onChange={(checked:boolean) => {
                              console.log(day,`hours.${day}.isClosed`)
                              officeFormik.setFieldValue(`hours.${day}.isClosed`,checked)
                            }}
                            checked={officeFormik.values?.hours && officeFormik.values.hours[day as keyof IHours]['isClosed']}
                            />
                        </div>
                      </div>
                    </div>
                  ))
                }
                {/* <div>
                  <p className="font-bold">Sunday</p>
                  <div className="flex gap-2 items-center mt-2">
                    <div className="w-1/2">
                      <p className=" text-xs">Start</p>
                      <Input disabled={!(showUpdate == 'office')} type="time" value={officeFormik.values.hours.sunday.start} name="hours.sunday.start" onChange={officeFormik.handleChange} placeholder="office hours" />
                    </div>
                    <div className="w-1/2">
                      <p className=" text-xs">End</p>
                      <Input disabled={!(showUpdate == 'office')} type="time" value={officeFormik.values.hours.sunday.end} name="hours.sunday.end" onChange={officeFormik.handleChange} placeholder="office hours" />
                    </div>

                  </div>
                </div> */}

              </div>
            </div>
          </div>
          {showUpdate == 'office' &&<Button  onClick={officeFormik.handleSubmit} className="mt-4 ml-auto">Update</Button>}
        </section>


        <section id='imageSection'>
            <h2 className="text-3xl font-semibold" id="office-information">
              Pictures
            </h2>
            <Button className="ml-auto" onClick={() => handleUpdateBtn(showUpdate == 'pics' ? '' : 'pics')} variant="gray">Add pictures</   Button>  
            <div className="flex flex-wrap gap-2 mt-4">
              {
                new Array(6).fill('*').map((arr:string,index:number ) => {
                  let image = files[index] || null
                  return (
                    image ? (
                      <div key={index} className="relative w-48 h-56 border rounded-lg overflow-hidden">
                        <img src={typeof image === 'string' ? `${imgUrl}${image}` : URL.createObjectURL(image)} className="w-full h-full object-contain" alt="org media" />
                        <p onClick={() => handleRemove(index)} className="text-red-500 absolute right-3 top-0 bg-black p-1 rounded-full cursor-pointer">x</p>
                      </div>
                    ) : (
                      <div key={index} className="relative w-48 h-56 flex justify-center items-center border rounded-lg">
                        <label htmlFor="uploadImg" className="text-xs w-full h-full flex justify-center items-center text-center">Upload Image</label>
                        <input disabled={!(showUpdate === 'pics')} onChange={(e) => handleUpload(e, index)} type="file" id="uploadImg" className="hidden"/>
                      </div>
                    )
                  )
                })
              }
            </div>
              {showUpdate == 'pics' && <Button className="mt-4 ml-auto" onClick={handleImageUpdate}>Update</Button>}
        </section>
        <div className="mt-6">
        <Button onClick={handleStripeOnboarding} disabled={loading}>
          {'hello'}{loading ? 'Setting up...' : 'Setup Card'}
        </Button>
      </div>
      </div>
    </div>
  );
};