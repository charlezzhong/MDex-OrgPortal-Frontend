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
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("your-publishable-key-here"); // Replace with your Stripe publishable key

const validationSchema = yup.object().shape({
  orgName: yup.string().required('Name is required'),
  orgBio: yup.string().required("Bio is required"),
  orgWebsite: yup.string(),
  orgInsta: yup.string()
});

interface IHours {
  sunday: {start: string; end: string; isClosed: boolean}
  monday: {start: string; end: string; isClosed: boolean}
  tuesday: {start: string; end: string; isClosed: boolean}
  wednesday: {start: string; end: string; isClosed: boolean}
  thursday: {start: string; end: string; isClosed: boolean}
  friday: {start: string; end: string; isClosed: boolean}
  saturday: {start: string; end: string; isClosed: boolean}
}

interface IOffice {
  room: string;
  office: string;
  hours: IHours;
}

const SetupCardForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useAppDispatch();
  const user = useSelector(state => state.user);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, setupIntent } = await stripe.confirmCardSetup("your-client-secret", {
      payment_method: {
        card: cardElement!,
        billing_details: {
          name: user?.organization?.orgName,
        },
      },
    });

    if (error) {
      toast.error(error.message || "Something went wrong");
    } else {
      const res = await updateOrganization({ paymentMethodId: setupIntent.payment_method }, user?.organization?._id!);
      if (res?.data?.data) {
        dispatch(updateOrg(res?.data?.data));
        toast.success("Payment method successfully set up");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <Button type="submit" className="mt-4 ml-auto">Setup Card</Button>
    </form>
  );
};

export const ProfileForm = () => {
  const staff = useSelector(state => state.user.staff);
  const [showUpdate, setShowUpdate] = useState('');
  const [files, setFiles] = useState<any[]>([]);
  const [room, setRoom] = useState<string>(staff?.office?.roomNumber || '');
  const [office, setOffice] = useState<string>(staff?.office?.officeBuilding || '');
  
  const dispatch = useAppDispatch();
  const user = useSelector(state => state.user);
  const formik = useFormik({
    initialValues: {
      orgName: user?.organization?.orgName || '',
      orgBio: user?.organization?.orgBio || '',
      orgWebsite: user?.organization?.orgWebsite || '',
      orgInsta: user?.organization?.orgInsta || '',
      email: user?.organization?.email || ''
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleOrgUpdate(values);
    }
  });

  const officeFormik = useFormik({
    initialValues: {
      room: user?.organization?.office?.roomNumber || '',
      office: user?.organization?.office?.officeBuilding || '',
      hours: user?.organization?.office?.hours || {
        sunday: { start: '', end: '', isClosed: false },
        monday: { start: '', end: '', isClosed: false },
        tuesday: { start: '', end: '', isClosed: false },
        wednesday: { start: '', end: '', isClosed: false },
        thursday: { start: '', end: '', isClosed: false },
        friday: { start: '', end: '', isClosed: false },
        saturday: { start: '', end: '', isClosed: false }
      },
    } as IOffice,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleOfficeUpdate(values);
    }
  });

  useEffect(() => {
    if (user.organization?.media?.length) {
      setFiles(user?.organization?.media);
    }
  }, [user.organization]);

  const handleOrgUpdate = async (values: any) => {
    try {
      const res: any = await updateOrganization(values, user?.organization?._id!);
      if (res?.data?.data) {
        dispatch(updateOrg(res?.data?.data));
        setShowUpdate('');
        toast.success('Successfully Updated');
      }
    } catch (error) {
      // console.log(error)
    }
  };

  const handleOfficeUpdate = async (values: IOffice) => {
    try {
      let dataToSend = {
        "office": {
          "officeBuilding": values.office,
          "roomNumber": values.room,
          hours: values.hours
        }
      };
      handleOrgUpdate(dataToSend);
      return;
      // if (!staff?._id) {
      //   toast.error('No staff entries found');
      //   return;
      // }
      // const res: any = await updateStaffs(dataToSend, staff?._id!);
      // if (res?.data?.data) {
      //   dispatch(updateStaff(res?.data?.data));
      //   toast.success('Successfully Updated');
      // }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const handleUpload = (e: any, index: number) => {
    let imgs = [...files];
    imgs[index] = e.target.files[0];
    setFiles(imgs);
  };

  const handleRemove = (index: number) => {
    let imgs = [...files];
    imgs.splice(index, 1);
    setFiles(imgs);
  };

  const handleImageUpdate = () => {
    let formData = new FormData();
    files.forEach((file: any) => {
      formData.append('media', file);
    });
    handleOrgUpdate(formData);
  };

  const [oldValues, setOldValues] = useState(formik.values);

  const handleUpdateBtn = (txt: string) => {
    if (txt === '') {
      formik.setValues(oldValues);
    } else {
      setOldValues(formik.values);
    }
    setShowUpdate(txt);
  };

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
              label="Org Bio"
              placeholder="Example Organization Bio"
            />
            {formik.errors?.orgBio && <small className="my-1 text-red-500">{formik.errors?.orgBio}</small>}
            <Input
              disabled={showUpdate !== 'profile'}
              value={formik.values.orgWebsite}
              onChange={formik.handleChange}
              id='orgWebsite'
              name='orgWebsite'
              label="Website"
              placeholder="example.com"
            />
            <Input
              disabled={showUpdate !== 'profile'}
              value={formik.values.orgInsta}
              onChange={formik.handleChange}
              id='orgInsta'
              name='orgInsta'
              label="Instagram"
              placeholder="@example_insta"
            />
            {showUpdate === 'profile' && (
              <div className="flex justify-end mt-5">
                <Button onClick={() => handleUpdateBtn('')} variant="gray" className="mr-3">Cancel</Button>
                <Button onClick={() => formik.handleSubmit()}>Save</Button>
              </div>
            )}
          </div>
        </section>

        <section aria-labelledby="office-information" className="mb-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">Office</h1>
            {showUpdate !== 'office' && (
              <Button onClick={() => handleUpdateBtn('office')} variant="gray">
                Edit
              </Button>
            )}
          </div>
          <Divider />
          <div className="mt-5">
            <Input
              disabled={showUpdate !== 'office'}
              onChange={officeFormik.handleChange}
              value={officeFormik.values.room}
              id='room'
              name='room'
              label="Room Number"
              placeholder="123"
            />
            <Input
              disabled={showUpdate !== 'office'}
              onChange={officeFormik.handleChange}
              value={officeFormik.values.office}
              id='office'
              name='office'
              label="Office Building"
              placeholder="Engineering Building"
            />
            {/* Add inputs for hours */}
            {Object.keys(officeFormik.values.hours).map((day) => (
              <div key={day} className="mt-2">
                <h3 className="font-semibold capitalize">{day}</h3>
                <div className="flex space-x-2">
                  <Input
                    disabled={showUpdate !== 'office'}
                    type="time"
                    onChange={officeFormik.handleChange}
                    value={officeFormik.values.hours[day as keyof IHours].start}
                    id={`hours.${day}.start`}
                    name={`hours.${day}.start`}
                    placeholder="Start"
                  />
                  <Input
                    disabled={showUpdate !== 'office'}
                    type="time"
                    onChange={officeFormik.handleChange}
                    value={officeFormik.values.hours[day as keyof IHours].end}
                    id={`hours.${day}.end`}
                    name={`hours.${day}.end`}
                    placeholder="End"
                  />
                  <Switch
                    disabled={showUpdate !== 'office'}
                    onChange={() => officeFormik.setFieldValue(`hours.${day}.isClosed`, !officeFormik.values.hours[day as keyof IHours].isClosed)}
                    checked={officeFormik.values.hours[day as keyof IHours].isClosed}
                    id={`hours.${day}.isClosed`}
                    name={`hours.${day}.isClosed`}
                    label="Closed"
                  />
                </div>
              </div>
            ))}
            {showUpdate === 'office' && (
              <div className="flex justify-end mt-5">
                <Button onClick={() => handleUpdateBtn('')} variant="gray" className="mr-3">Cancel</Button>
                <Button onClick={() => officeFormik.handleSubmit()}>Save</Button>
              </div>
            )}
          </div>
        </section>

        <section aria-labelledby="media-upload" className="mb-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">Media</h1>
          </div>
          <Divider />
          <div className="mt-5">
            {files.map((file, index) => (
              <div key={index} className="mb-4">
                <input type="file" onChange={(e) => handleUpload(e, index)} />
                {file && (
                  <div className="flex items-center mt-2">
                    <img src={URL.createObjectURL(file)} alt="uploaded" className="h-20 w-20 object-cover rounded-lg" />
                    <Button onClick={() => handleRemove(index)} variant="gray" className="ml-4">Remove</Button>
                  </div>
                )}
              </div>
            ))}
            <Button onClick={() => setFiles([...files, null])} variant="gray">Add More</Button>
            <Button onClick={handleImageUpdate} className="mt-4">Save</Button>
          </div>
        </section>

        <section aria-labelledby="setup-card" className="mb-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">Setup Your Card</h1>
          </div>
          <Divider />
          <div className="mt-5">
            <Elements stripe={stripePromise}>
              <SetupCardForm />
            </Elements>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileForm;