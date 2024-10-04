import Link from "next/link";
import React from "react";
import LoginForm from "./LoginForm";

const Login = () => {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">
            Welcome back! Log in to your account to access exclusive features
            and manage your bookings effortlessly. By logging in, you&apos;ll be
            able to view your past events, make new reservations, and stay
            updated with the latest offerings. Don&apos;t miss out on any
            opportunities—secure your spot and dive back into the action today!
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
