"use client";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { useFormik } from "formik";
import { useSelector } from "@/store/store";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { createPost } from "@/services/handlers/post.handlers";
import toast from "react-hot-toast";
import { BiPencil, BiPlus } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { path } from "@/helpers/path";
import { IoPencil } from "react-icons/io5";
import { FaAddressCard, FaEnvelope, FaUser } from "react-icons/fa";
import { BsCalendarDate, BsCardText } from "react-icons/bs";
import { HiOutlineMapPin } from "react-icons/hi2";
import AdmissionSettings from '../components/Tickets/TicketSettings';
import SelectionPage from '../components/SelectionPage'
import TicketsView from '../components/Tickets/TicketsView'
import PictureSelection from '../components/Posts/PictureSelection'
import AdvancedSettings from "../components/Posts/AdvancedSettings";
import TimeSelector from '../components/Selectors/TimeSelector';
import DateSelector from '../components/Selectors/DateSelector';
import { Fontdiner_Swanky } from "next/font/google";
dayjs.extend(isSameOrAfter);

interface IPost {
  title: string;
  link: string;
  description: string;
  website: string;
  instagram: string;
  eventDate: Date;
  eventTime: Date;
  eventEndTime: Date;
  eventLocation: string;
  eventLocationDescription: string;
  lat:                      string;
  lng:                      string;
  category: string;
  campus: string;

}

const validationSchema = Yup.object().shape({
  title: Yup.string(),
  link: Yup.string(),
  description: Yup.string().required(),
  website: Yup.string(),
  instagram: Yup.string(),
  eventTime: Yup.date().required("start time cannot be empty"),
  eventEndTime: Yup.date()
    .min(Yup.ref("eventTime"), "end date can't be before start date")
    .required(),
  eventLocation: Yup.string().required(),
  eventLocationDescription: Yup.string().required(),
  category: Yup.string().required(),
  campus: Yup.string().required(),
});

const RegSchema = Yup.object().shape({
  capacity: Yup.number().required().min(1),
});

const CampusEnum = ["north", "central", "all"];

export const Categories = [
  "Clothes",
  "Tickets",
  "Caffeine",
  "Pizza",
  "Snacks",
  "Food",
  "Water bottles",
  "Swag bag",
  "Therapy Dogs",
  "Hats",
  "Phone Wallets",
  "Accessories",
];

interface Options {
  optional1: string;
  optional2: string;
  optional3: string;
  // Add more optional properties as needed
}
interface Reg {
  capacity: 999;
  questions: Options;
  // Add more optional properties as needed
}

interface Ticket {
  _id: string;
  name: string;
  available: string;
  price: string;
  salePeriod?: boolean;
  startDate?: string;
  endDate?: string;
  validFrom?: boolean;
  startTime?: string;
  endTime?: string;
  description?: string;
  limitQty?: boolean;
  minQty?: number;
  maxQty?: number;
  hideTier?: boolean;
  hidePrice?: boolean;
  disableTicket?: boolean;
  requireApproval?: boolean;
  passwordProtected?: boolean;
  password?: string;
}

const initialTickets: Ticket[] = [
  { _id: '1', name: 'Default Ticket', available: '100', price: '10' },  // No 'available' property
];

export const CreatePost = () => {
  const [questionsCount, setQuestionsCount] = useState(0);
  const [loading, setloading] = useState(false);
  const [questions, setQuestions] = useState(-1);
  const [showRegisteration, setShowRegisteration] = useState(false);
  const [toggleRegisteration, setToggleRegisteration] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [step, setStep] = useState(0); // 0 for selection, 1 for form
  const [isSellingTickets, setIsSellingTickets] = useState(true);

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const handleShowAdvancedSettings = () => {
    setShowAdvancedSettings(!showAdvancedSettings);
  };

  const [showAdmissionSettings, setShowAdmissionSettings] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  // useEffect(() => {
  //   if (!tickets.length) {
  //     setTickets(initialTickets);
  //   }
  // }, [initialTickets]);

  const handleContinue = () => {
    setStep(1);
  };

  const handleDone = () => {
    setShowAdmissionSettings(false);
  };

  const selectionOptions = [
    { label: 'Sell Tickets', value: true, isSelected: isSellingTickets },
    { label: 'RSVP Only', value: false, isSelected: !isSellingTickets }
  ];

  //hooks  
  const router = useRouter();
  const org = useSelector((state) => state?.user?.organization);
  const regFromik = useFormik({
    initialValues: {
      capacity: 999,
      questions: {
        optional1: "",
        optional2: "",
        optional3: "",
      },
    } as Reg,
    validationSchema: RegSchema,
    onSubmit: (values) => { },
  });
  const formik = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      title: "",
      link: org?.orgWebsite || "",
      description: "",
      website: org?.orgWebsite || "",
      instagram: org?.orgInsta || "",
      eventTime: new Date(),
      eventEndTime: new Date(),
      eventLocation: "",
      eventLocationDescription: "",
      lat:"42.2804947",
      lng:"-83.7401702",
      category: "",
      campus: "",
    } as IPost,
    // enableReinitialize:true,
    /*onSubmit: (values) => {
      handleCreate(values);
    },*/
    onSubmit: async (values) => {
      if (isSellingTickets) {
        await createTicket(values, tickets);
      } else {
        await handleCreate(values);
      }
    },
  });

  const createTicket = async (postData: IPost, ticketData: Ticket[]) => {
    const dataToSend = {
      ...postData,
      isNorth: postData?.campus == "north",
      isCentral: postData?.campus == "central",
      //organization: org?._id,
      organization: "669bea28422d685053f6da92",
      //organizationName: org?.orgName,
      organizationName: "Testing",
      eventDate: dayjs(postData?.eventTime).format("MM/DD/YYYY"),
      eventTime: dayjs(postData?.eventTime).format("HH:mm"),
      rsvpData: null,
      tickets: ticketData,
    };

    try {
      const response = await fetch('http://localhost:5000/ipa/v2/testing/postFeed/ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Failed to create ticket event');
      }

      const data = await response.json();
      toast.success("Ticket event created successfully");
      router.push(path.post.index);
    } catch (error) {
      console.error('Error creating ticket event:', error);
      toast.error('Failed to create ticket event');
    }
  };


  const handleCreate = async (values: IPost) => {

    const dataToSend: any = {
      ...values,
      isNorth: values?.campus == "north",
      isCentral: values?.campus == "central",
      //organization: org?._id,
      organization: "669bea28422d685053f6da92",
      //organizationName: org?.orgName,
      organizationName: "Testing",
      eventDate: dayjs(values?.eventTime).format("MM/DD/YYYY"),
      eventTime: dayjs(values?.eventTime).format("HH:mm"),
      rsvpData: null,
    };

    if (toggleRegisteration) {
      const regData = {
        rsvpLimit: regFromik.values.capacity,
        optionals: regFromik.values.questions,
      };
      dataToSend.rsvpData = regData;
    }
    setloading(true);

    try {
      await createPost(dataToSend);
      toast.success("Successfully created a post");
      router.push(path.post.index);
      setloading(false);
    } catch (error: any) {
      let msg = error?.message || "something went wrong";
      toast.error(msg);
      setloading(false);
      //console.log(error)
    }
  };




  return (
    <div>
      {step === 0 ? (
        <SelectionPage options={selectionOptions} onSelect={setIsSellingTickets} onContinue={handleContinue} />
      ) : (

        <div>
          <h1 className="text-2xl font-bold mb-5">Create a New Post</h1>
          <form
            className="flex w-11/12 m-auto flex-col gap-2 p-4 shadow-lg mt-5 rounded-lg"
            onSubmit={formik.handleSubmit}
          >
            <div className="flex flex-col md:flex-row justify-between gap-5">
              <div className="w-full">
                {/* Title */}

                <div className="flex gap-2 mb-5">
                  <Input
                    placeholder="Title"
                    name="title"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #ccc',
                      backgroundColor: '#ffffff',
                      color: 'black'
                    }}
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>

                <div id="date" className="  flex gap-2">
                  <BsCalendarDate color="gray" size={30} className="mt-3" />
                  <div className="flex-1 bg-gray-100 p-3 rounded-xl">
                    <div className="">
                      <Input
                        type={"datetime-local"}
                        label={"Start"}
                        value={formik.values.eventTime.toString()}
                        onChange={formik.handleChange}
                        name={"eventTime"}
                        id={"eventTime"}
                        className="bg-gray-200"
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.eventTime && formik.touched.eventTime && (
                        <small className="text-red-500">
                          {formik.errors?.eventTime
                            ? `${formik.errors.eventTime}`
                            : ""}
                        </small>
                      )}
                    </div>
                    <div>
                      <Input
                        type={"datetime-local"}
                        label={"End"}
                        value={formik.values.eventEndTime}
                        onChange={formik.handleChange}
                        name={"eventEndTime"}
                        id={"eventEndTime"}
                        className="bg-gray-200 white mt-1"
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.eventEndTime && formik.touched.eventEndTime && (
                        <small className="text-red-500">
                          {formik.errors?.eventEndTime
                            ? `${formik.errors.eventEndTime}`
                            : ""}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'left', alignItems: 'left' }}>
                  <div style={{ margin: '0px 20px' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>Event Starts</p>
                    <DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                    {/* {selectedDate && (
                      <p>
                        Selected Date: {selectedDate.toDateString()}
                      </p>
                    )} */}
                    <TimeSelector />
                  </div>
                  <div style={{ margin: '0 10px' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>Event End</p>
                    <DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                    <TimeSelector />
                  </div>
                </div>



                {/* location */}
                <div className="flex gap-2">
                  <HiOutlineMapPin size={30} color="gray" className="p-1 border rounded-lg mt-6 border-[rgba(0,0,0,0.3)]" />
                  <div
                    id="location"
                    className="bg-gray-100 p-3 rounded-xl flex flex-col gap-4 mt-5 flex-1"
                  >
                    <p className="font-bold">Add Event Location</p>
                    <Input
                      placeholder="Write the location"
                      className="bg-gray-200"
                      value={formik.values.eventLocation}
                      onChange={formik.handleChange}
                      id="eventLocation"
                      name="eventLocation"
                    />
                    {formik.errors.eventLocation && formik.touched.eventLocation && (
                      <small className="text-red-500">
                        {formik.errors.eventLocation}
                      </small>
                    )}

                    <Input
                      className='bg-gray-200'
                      placeholder="Write the location description"
                      value={formik.values.eventLocationDescription}
                      onChange={formik.handleChange}
                      id="eventLocationDescription"
                      name="eventLocationDescription"
                    />
                    {formik.errors.eventLocationDescription &&
                      formik.touched.eventLocationDescription && (
                        <small className="text-red-500">
                          {formik.errors.eventLocationDescription}
                        </small>
                      )}

                    <>
                      <div className="w-full  flex flex-col sm:flex-row items-start sm:items-center sm:gap-1 gap-3">
                        <select
                          value={formik.values.campus}
                          onChange={formik.handleChange}
                          name={"campus"}
                          id={"campus"}
                          onBlur={formik.handleBlur}

                          className=" px-3 py-1 border bg-gray-200 border-gray-200 rounded-lg w-full"
                        >
                          <option disabled value={""}>
                            Select a Campus
                          </option>

                          {CampusEnum.map((campus) => (
                            <option value={campus}>{campus}</option>
                          ))}
                        </select>
                      </div>
                      {formik.errors.campus && formik.touched?.campus && (
                        <small className="text-red-500">{formik.errors.campus}</small>
                      )}
                    </>
                  </div>

                </div>
                <div className="bg-gray-100 p-3 rounded-xl flex flex-col gap-4 w-full mt-4">
                  <p className="font-bold">Category</p>
                  <>
                    <div className="w-full  flex flex-col sm:flex-row items-start sm:items-center sm:gap-1 gap-3">
                      <select
                        value={formik.values.category}
                        onChange={formik.handleChange}
                        name={"category"}
                        id={"category"}
                        onBlur={formik.handleBlur}
                        className=" px-3 py-1 bg-gray-200 border border-gray-200 rounded-lg w-full"
                      >
                        <option disabled value={""}>
                          Select Category
                        </option>

                        {Categories.map((category) => (
                          <option value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    {formik.errors.category && formik.touched.category && (
                      <small className="text-red-500 mt-2">
                        {formik.errors.category}
                      </small>
                    )}
                  </>
                </div>

                {/* Description */}
                <p className="font-bold mt-4 text-gray-500">Description</p>
                <div className="bg-gray-200 p-3 rounded-xl flex flex-col gap-4 mt-1">

                  <textarea
                    rows={5}
                    className='bg-gray-200 w-full'
                    onChange={formik.handleChange}
                    value={formik.values.description}
                    name={"description"}
                  />
                  {formik.errors.description && formik.touched.description && (
                    <small className="text-red-500 mt-2">
                      {formik.errors.description}
                    </small>
                  )}
                </div>
              </div>
              <div className="w-full">
                <PictureSelection />
              </div>

            </div>
            {isSellingTickets ? (
              <TicketsView tickets={tickets} setTickets={setTickets} />
            ) : (
              <div>
                {/* Registeration */}
                <div style={{ marginTop: '2rem' }}>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Registration</h2>
                  </div>
                  <hr style={{ borderColor: 'gray', margin: '1rem 0' }} />

                  {/* {showRegisteration && ( */}
                  <div className="shadow-lg p-3 rounded-xl flex flex-col gap-4 w-full mt-5">
                    <div className="flex justify-between">
                      {/* <h1 className="font-bold">Registration</h1> */}
                      {/* <Switch checked={toggleRegisteration} onChange={(checked) => setToggleRegisteration(!toggleRegisteration)} /> */}
                    </div>
                    <Input
                      label="Capacity"
                      name="capacity"
                      type="number"
                      onChange={regFromik.handleChange}
                      value={regFromik.values.capacity?.toString()}
                    />
                    <div>
                      <p className="font-bold flex items-center gap-2"><span className="h-7 w-7 rounded-full bg-green-700 flex justify-center items-center text-lg"><FaAddressCard color='white' /></span>Identity</p>
                      <div className='flex justify-between items-center my-3'>
                        <p className='flex items-center gap-2'><FaUser color='gray' /><span>Name</span></p>
                        <p className='text-gray-400'>required</p>
                      </div>
                      <div className='flex justify-between items-center'>
                        <p className='flex items-center gap-2'><FaEnvelope color='gray' /><span>Email Address </span></p>
                        <p className='text-gray-400'>required</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-lg flex items-center gap-2"><span className="h-7 w-7 rounded-full bg-orange-500 flex justify-center items-center text-lg"><BsCardText color='white' /></span>Custom Question</p>
                      <div>
                        {questionsCount > 0 ? Object.keys(regFromik.values.questions).map(
                          (key, index: number) => {
                            return index < questionsCount ? (
                              <div className="flex gap-2 items-center mb-2">
                                <Input
                                  name={`questions.${key}`}
                                  onChange={regFromik.handleChange}
                                  label={`Question 1 ${index + 1}`}
                                  value={
                                    regFromik.values.questions[
                                    `${key}` as keyof Options
                                    ]
                                  }
                                />
                              </div>
                            ) : null;
                          }
                        ) : (
                          <p className="mt-2 text-sm">You are not asking guests additional questions.</p>
                        )}
                        <Button
                          className=" bg-gray-700 mt-5"
                          LeftIcon={<IoPencil />}
                          onClick={() => {
                            if (questionsCount >= 3) return;
                            setQuestionsCount((prev) => prev + 1);
                          }}
                        >
                          Add Question
                        </Button>
                        {/* <Input  name='questions.optional2' onChange={regFromik.handleChange} label='Optional 2' className='mb-4' value={regFromik.values.questions.optional2} />
                                            <Input  name='questions.optional3' onChange={regFromik.handleChange} label='Optional 3'  value={regFromik.values.questions.optional3} /> */}
                      </div>
                    </div>
                  </div>
                  {/* )} */}
                </div>
              </div>
            )}
            {showAdmissionSettings && <AdmissionSettings onClose={() => setShowAdmissionSettings(false)} onDone={handleDone} tickets={tickets} setTickets={setTickets} />}

            {/* {
                Object.keys(formik.values).map(key => (
                    renderField(key)
                ))
            } */}
            <button
              style={{
                marginTop: '1rem',
                color: 'gray',
                textDecoration: 'underline',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
              type="button"
              onClick={handleShowAdvancedSettings}
            >
              Show Advanced Settings
            </button>

            {showAdvancedSettings && <AdvancedSettings />}
            <Button
              type="submit"
              onClick={() => questions < 2 && setQuestions(questions + 1)}
              disabled={loading}
              className="w-fit mt-8 ml-auto"
            >
              Create Post
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
