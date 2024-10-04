"use client";
import React from "react";
import AdminAvatar from "../../../public/images/admin-avatar.png";
import Image from "next/image";
import { useAppContext } from "@/app/AppContext";

const Header = () => {
  const { user } = useAppContext();
  return (
    <div className="navbar bg-base-200">
      <div className="container mx-auto">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Events Booker</a>
        </div>
        <div className="flex items-center">
          <a className="btn btn-info mr-3">Create Event</a>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <Image src={AdminAvatar} alt="admin-avatar" />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  {user.name}
                  <span className="badge">{user.roles[0].name}</span>
                </a>
              </li>
              <li>
                <a>{user.email}</a>
              </li>
              <li>
                <a className="text-error">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
