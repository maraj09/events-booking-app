"use client";
import React, { useState } from "react";
import AdminAvatar from "../../../public/images/admin-avatar.png";
import Image from "next/image";
import { useAppContext } from "@/app/AppContext";
import axios from "@/app/axios";
import Link from "next/link";

const Header = () => {
  const { user, setUser, authToken, setAuthToken } = useAppContext();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const deleteTokenResponse = await fetch("/api/auth-token", {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ authToken }),
    });
    if (deleteTokenResponse.ok) {
      try {
        await axios.post(
          "/api/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setUser(null);
        setAuthToken("");
        window.location.href = "/login";
      } catch (error) {
        console.error("Error logging out:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div className="navbar bg-base-200">
      <div className="container mx-auto">
        <div className="flex-1">
          <Link href={"/"} className="btn btn-ghost text-xl">
            Events Booker
          </Link>
        </div>
        <div className="flex items-center">
          <Link href={"/events/create"} className="btn btn-info mr-3">
            Create Event
          </Link>
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
                <a
                  className={`text-error`}
                  onClick={!loading ? handleLogout : null}
                  disabled={loading}
                >
                  {loading && <span className="loading loading-spinner"></span>}
                  {!loading && "Logout"}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
