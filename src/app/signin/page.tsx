"use client";
import { approvedUrl, pendingUrl, rejected } from "@/helpers/constants";
import { statusValue } from "@/helpers/enum";
import { useAppDispatch } from "@/store/store";
import { login } from "@/store/userReducer";
import { handleUserAuth } from "@/utils/auth";
import { encrypt } from "@/utils/hashing";
import { setCookie } from "cookies-next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";


export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch() 

  useEffect(() => {
    if(session){
      handleFetchOrg()
    }
  }, [session]);

  const handleFetchOrg = async () => {
    try {
      const res = await handleUserAuth(session?.user?.email!);
      let url = '/select-organization'
      let orgStatus = 'notCreated'
      
       if(res?.data?.organization) {
            // if organisation present then --> route to the page depend on status

            if(res?.data?.organization?.status == statusValue.approved) {
                url = approvedUrl
            }
            if(res?.data?.organization?.status == statusValue.pending) {
                url = pendingUrl
            }
            if(res?.data?.organization?.status == statusValue.rejected) {
                url = rejected
            }
            orgStatus = res?.data?.organization?.status
        }
         if(res?.data?.staff){
          orgStatus = 'staff'
         }
        // else{
        //     url = createOrganization
        // }
        setCookie('status',encrypt(orgStatus))
        if(res?.data){
          dispatch(login(res?.data))
        }
        router.push(url);
    } catch (error) {
      //Show error message on the UI if error occurs
      //console.log(error)
    }
  }

  const handleSignIn = async (e: any) => {
    e.preventDefault();
    await signIn('google', {redirect:false});
  };

  return (
    <main className=" p-4 ">
      {
        status === "loading" ? (
          <div></div>
        ) : (
          <div className="h-[80vh] flex justify-center items-center">
            <div className="w-3/5 h-1/2 rounded-[5rem] flex flex-col items-center justify-center bg-black">
              <div className="w-4/5">
                <h2 className="text-white text-2xl font-bold -mt-20 text-left">Sign in</h2>
              </div>
              <button
                className="w-4/5 bg-gray-900 hover:bg-gray-800 text-white  py-2 px-4 rounded-lg flex items-center justify-between"
                onClick={handleSignIn}
              >
                <span className="flex items-center gap-3"><FcGoogle /><span> Continue with Google</span></span>
                <span><FaArrowRightLong color="gray"/></span>
              </button>
            </div>
          </div>
        )
      }
     
    </main>
  );
}
