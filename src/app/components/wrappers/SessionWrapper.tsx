"use client";
import { store } from "@/store/store";
import { SessionProvider } from "next-auth/react"

import React from 'react'
import { Provider } from "react-redux";

const SessionWrapper = ({children}: {children: React.ReactNode}) => {
  return (
    <Provider store={store}>
      <SessionProvider >{children}</SessionProvider>
    </Provider>
  )
}

export default SessionWrapper