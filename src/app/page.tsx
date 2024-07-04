'use client';

import { useEffect } from "react";

export default function Home() {

  // navigate to the home page
  useEffect(() => {
    window.location.href = '/dashboard/home';
  },[])

  return (
    <main className=" p-4 ">
      <div className="w-full h-full flex items-center justify-center">
      </div>
    </main>
  );
}
