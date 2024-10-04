"use client";
import { useAppContext } from "@/app/AppContext";
import Header from "@/app/layouts/admin/Header";
import React from "react";

const Dashboard = () => {
  const { user } = useAppContext();
  return (
    <>
      <Header />
    </>
  );
};

export default Dashboard;
