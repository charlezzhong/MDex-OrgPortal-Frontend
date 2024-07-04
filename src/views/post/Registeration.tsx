"use client";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { updateRsvp } from "@/services/handlers/rsvp.handlers";
import { IPost } from "@/types/post.interface";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsCardText } from "react-icons/bs";
import { FaAddressCard, FaEnvelope, FaUser } from "react-icons/fa";
import { IoPencil } from "react-icons/io5";
import * as Yup from "yup";
type Props = {
  post: IPost;
};

interface Options {
  optional1: string;
  optional2: string;
  optional3: string;
  // Add more optional properties as needed
}

const RegSchema = Yup.object().shape({
  capacity: Yup.number().required().min(1),
});

export const Registeration = ({ post }: Props) => {
  const [questionsCount, setQuestionsCount] = useState(0);
  const regFromik = useFormik({
    initialValues: {
      capacity: post?.rsvp?.rsvpLimit,
      questions: {
        optional1: post.rsvp?.optionals?.optional1,
        optional2: post.rsvp?.optionals?.optional2,
        optional3: post.rsvp?.optionals?.optional3,
      },
    },
    validationSchema: RegSchema,
    onSubmit: (values) => {
      let dataToSend = {
        rsvpLimit: values.capacity,
        optionals: { ...values.questions },
      };
      handleRsvpUpdate(dataToSend);
    },
  });

  useEffect(() => {
    if (post.rsvp?.optionals) {
      let count = 0;
      Object.keys(post.rsvp?.optionals).map((key: string) => {
        if (post.rsvp?.optionals[`${key}` as keyof Options]) {
          count = count + 1;
        }
      });
      setQuestionsCount(count);
    }
  }, []);

  const handleRsvpUpdate = async (data: any) => {
    try {
      const resp = await updateRsvp(data, post.rsvp._id);
      toast.success("Successfully updated");
    } catch (error: any) {
      let msg = error?.response?.data?.message || "Something went wrong";
      toast.error(msg);
    }
  };
  return (
    <div className="shadow-lg p-5 rounded-xl flex flex-col gap-4 w-full mt-5">
      <div className="flex justify-between">
        <h1 className="font-bold">Registration</h1>
      </div>
      <Input
        label="Capacity"
        name="capacity"
        type="number"
        onChange={regFromik.handleChange}
        value={regFromik.values.capacity?.toString()}
      />{" "}
      <div>
        <p className="font-bold flex items-center gap-2">
          <span className="h-7 w-7 rounded-full bg-green-700 flex justify-center items-center text-lg">
            <FaAddressCard color="white" />
          </span>
          Identity
        </p>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-full md:w-1/2">
                <div className="flex justify-between items-center my-3">
                    <p className="flex items-center gap-2 w-1/2">
                        <FaUser color="gray" />
                        <span>Name</span>
                    </p>
                    <p className="text-gray-400 bg-gray-200 p-2 text-xs rounded-2xl">required</p>
                    </div>
                    <div className="flex justify-between items-center">
                    <p className="flex items-center gap-2">
                        <FaEnvelope color="gray" />
                        <span>Email Address </span>
                    </p>
                    <p className="text-gray-400 bg-gray-200 p-2 text-xs rounded-2xl">required</p>
                    </div>
                </div>
                <p className="text-gray-400 mb-6">We always asked out guests for name and email</p>

            </div>
        </div>
    
      <div className="mt-12 ">
        <p className="text-lg flex items-center gap-2 py-2">
          <span className="h-7 w-7 rounded-full bg-orange-500 flex justify-center items-center text-lg">
            <BsCardText color="white" />
          </span>
          Custom Question
        </p>
        <div>
          {questionsCount > 0 ? (
            Object.keys(regFromik.values.questions).map(
              (key, index: number) => {
                return index < questionsCount ? (
                  <div className="flex gap-2 items-center mb-2">
                    <Input
                      name={`questions.${key}`}
                      onChange={regFromik.handleChange}
                      label={`Optional ${index + 1}`}
                      value={
                        regFromik.values.questions[`${key}` as keyof Options]
                      }
                    />
                  </div>
                ) : null;
              }
            )
          ) : (
            <p className="mt-2 text-sm">
              You are not asking guests additional questions.
            </p>
          )}
          <Button
            className=" !bg-gray-700 mt-5"
            LeftIcon={<IoPencil />}
            onClick={() => {
              if (questionsCount >= 3) return;
              setQuestionsCount((prev) => prev + 1);
            }}
          >
            Add Question
          </Button>
       </div>
      </div>
      <Button className="w-fit ml-auto bg-gra" onClick={regFromik.handleSubmit}>
        Submit
      </Button>
    </div>
  );
};

export default Registeration;
