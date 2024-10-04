"use client";
import axios from "@/app/axios";
import Link from "next/link";
import React, { useState } from "react";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/register", formData);
      if (response.data.success) {
        const { token, user } = response.data;

        const storeTokenResponse = await fetch("/api/auth-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (storeTokenResponse.ok) {
          const userRole = user.roles[0].name;
          const redirectUrl = userRole === "admin" ? "/dashboard" : "/home";
          window.location.href = redirectUrl;
          setErrors({});
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("An error occurred:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card-body" onSubmit={handleSubmit}>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Full Name</span>
        </label>
        <input
          type="text"
          placeholder="full name"
          className={`input input-bordered ${errors.name ? "input-error" : ""}`}
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name[0]}</span>
        )}
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          placeholder="email"
          className={`input input-bordered ${
            errors.email ? "input-error" : ""
          }`}
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email[0]}</span>
        )}
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          type="password"
          placeholder="password"
          className={`input input-bordered ${
            errors.password ? "input-error" : ""
          }`}
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && (
          <span className="text-red-500 text-sm">{errors.password[0]}</span>
        )}
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Confirm Password</span>
        </label>
        <input
          type="password"
          placeholder="password"
          className={`input input-bordered ${
            errors.password_confirmation ? "input-error" : ""
          }`}
          name="password_confirmation"
          value={formData.password_confirmation}
          onChange={handleChange}
        />
        {errors.password_confirmation && (
          <span className="text-red-500 text-sm">
            {errors.password_confirmation[0]}
          </span>
        )}
      </div>
      <span className="label-text-alt mt-2">
        Already have an account?
        <Link href="/login" className="text-primary ml-1">
          Login here
        </Link>
      </span>
      <div className="form-control mt-6">
        <button
          className="btn btn-block btn-primary rounded-full"
          disabled={loading}
        >
          {loading && <span className="loading loading-spinner"></span>}
          Register
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
