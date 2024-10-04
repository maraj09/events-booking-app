import React from "react";
import RegisterForm from "./RegisterForm";

const Register = () => {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Create an account now!</h1>
          <p className="py-6">
            Join our community and unlock a world of possibilities! By creating
            an account, you&apos;ll gain access to exclusive features,
            personalized event recommendations, and seamless booking management.
            Stay updated with the latest offerings and receive special
            promotions directly to your inbox. Don’t wait—sign up today and
            start enjoying all the benefits we have to offer!
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
