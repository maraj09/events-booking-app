"use client";
import { useAppContext } from "@/app/AppContext";
import axios from "@/app/axios";
import { useRouter } from "next/navigation";
import Header from "@/app/layouts/admin/Header";
import React, { useEffect, useState } from "react";

const EditEvent = ({ params }) => {
  const router = useRouter();
  const { user, authToken } = useAppContext();

  const eventId = params.slug;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    banner: null,
    start_date: "",
    price: "",
    seats: "",
  });

  const [event, setEvent] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authToken) {
      axios
        .get(`/api/events/${eventId}/edit`, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`, // Include token in Authorization header
          },
        })
        .then((response) => {
          setEvent(response.data.event);
          const startDate = new Date(response.data.event.start_date)
            .toISOString()
            .slice(0, 16);
          setFormData({
            title: response.data.event.title,
            description: response.data.event.description,
            start_date: startDate,
            price: response.data.event.price,
            seats: response.data.event.seats,
          });
        });
    }
  }, [authToken, eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, banner: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (formData.banner) {
      data.append("banner", formData.banner);
    }
    data.append("start_date", formData.start_date);
    data.append("price", formData.price);
    data.append("seats", formData.seats);

    try {
      const response = await axios.post(`/api/events/${eventId}/update`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`, // Include token in Authorization header
        },
      });

      setSuccessMessage("Event updated successfully!");
      router.replace("/dashboard");
    } catch (error) {
      if (error.response && error.response.data.errors) {
        // Handle validation errors from the server
        setErrors(error.response.data.errors);
      } else {
        console.error("Error submitting form:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {user ? (
        <>
          <Header />
          <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-semibold text-center mb-6">
              Edit Event
            </h2>

            {successMessage && (
              <div className="alert alert-success mb-4">{successMessage}</div>
            )}
            {event ? (
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                {/* Title */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Event Title</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`input input-bordered ${
                      errors.title ? "input-error" : ""
                    }`}
                    placeholder="Demo Event 1"
                  />
                  {errors.title && (
                    <span className="text-red-500 text-sm">
                      {errors.title[0]}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full"
                    placeholder="Enter the event description"
                  />
                </div>

                {/* Banner */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Banner</span>
                  </label>
                  <input
                    type="file"
                    name="banner"
                    onChange={handleFileChange}
                    className={`file-input file-input-bordered w-full ${
                      errors.banner ? "input-error" : ""
                    }`}
                  />
                  {errors.banner && (
                    <span className="text-red-500 text-sm">
                      {errors.banner[0]}
                    </span>
                  )}
                </div>

                {/* Start Date */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Start Date & Time</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className={`input input-bordered ${
                      errors.start_date ? "input-error" : ""
                    }`}
                  />
                  {errors.start_date && (
                    <span className="text-red-500 text-sm">
                      {errors.start_date[0]}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Price</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`input input-bordered ${
                      errors.price ? "input-error" : ""
                    }`}
                    min="0"
                    placeholder="500"
                  />
                  {errors.price && (
                    <span className="text-red-500 text-sm">
                      {errors.price[0]}
                    </span>
                  )}
                </div>

                {/* Seats */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Available Seats</span>
                  </label>
                  <input
                    type="number"
                    name="seats"
                    value={formData.seats}
                    onChange={handleChange}
                    className={`input input-bordered ${
                      errors.seats ? "input-error" : ""
                    }`}
                    min="1"
                    placeholder="100"
                  />
                  {errors.seats && (
                    <span className="text-red-500 text-sm">
                      {errors.seats[0]}
                    </span>
                  )}
                </div>

                {/* Submit */}
                <div className="form-control">
                  <button className="btn btn-primary" disabled={loading}>
                    {loading && (
                      <span className="loading loading-spinner"></span>
                    )}
                    Update Event
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <progress className="progress progress-accent w-90"></progress>
              </div>
            )}
          </div>
        </>
      ) : (
        <div>
          <progress className="progress progress-accent w-90"></progress>
        </div>
      )}
    </>
  );
};

export default EditEvent;
