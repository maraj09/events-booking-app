"use client";
import { useAppContext } from "@/app/AppContext";
import Header from "@/app/layouts/admin/Header";
import React, { useState } from "react";
import CreateEventForm from "./CreateEventForm";

const CreateEvent = () => {
  const { user } = useAppContext();

  return (
    <>
      {user ? (
        <>
          <Header />
          <CreateEventForm />
        </>
      ) : (
        <div>
          <progress className="progress progress-accent w-90"></progress>
        </div>
      )}
    </>
  );
};

export default CreateEvent;
