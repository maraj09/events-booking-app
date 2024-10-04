"use client";
import axios from "@/app/axios";
import Link from "next/link";
import React, { useState } from "react";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const response = await axios.post("/api/login", formData);

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
        console.error("An error occurred:", error.response.data.message);
        setErrors({ email: [error.response.data.message] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card-body" onSubmit={handleSubmit}>
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
      <span className="label-text-alt">
        Doesn&apos;t have an account?
        <Link href="/register" className="text-primary ml-1">
          Register here
        </Link>
      </span>
      <div className="form-control mt-6">
        <button className="btn btn-primary" disabled={loading}>
          {loading && <span className="loading loading-spinner"></span>}
          Login
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
