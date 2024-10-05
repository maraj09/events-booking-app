/* eslint-disable @next/next/no-img-element */
"use client";
import { useAppContext } from "@/app/AppContext";
import axios, { BASE_URL } from "@/app/axios";
import Header from "@/app/layouts/customer/Header";
import React, { useEffect, useState } from "react";

const Home = () => {
  const { user, authToken } = useAppContext();
  const [events, setEvents] = useState(null);
  const [loadingEventId, setLoadingEventId] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleQuantityChange = (eventId, amount) => {
    setQuantities((prev) => ({
      ...prev,
      [eventId]: Math.max(1, (prev[eventId] || 1) + amount),
    }));
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/api/events", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setEvents(response.data);
      } catch (err) {
        console.log(err);
      } finally {
      }
    };
    if (user) {
      fetchEvents();
    }
  }, [authToken, user]);

  const handleBooking = async (eventId) => {
    try {
      setLoadingEventId(eventId);
      const response = await axios.post(
        "/api/bookings",
        { event_id: eventId, quantity: quantities[eventId] || 1 },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setSuccessMessage("Event booked successfully!");
      setErrorMessage("");
      setQuantities((prev) => ({
        ...prev,
        [eventId]: 1,
      }));
    } catch (error) {
      console.error("Error booking event:", error);
      setErrorMessage(
        error.response?.data?.message || "An error occurred while booking."
      );
      setSuccessMessage("");
    } finally {
      setLoadingEventId(null);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId
            ? { ...event, remaining_seats: event.remaining_seats - (quantities[eventId] || 1) }
            : event
        )
      );
    }
  };

  return (
    <>
      {user ? (
        <>
          <Header />
          <div className="container mx-auto">
            {/* Success Alert */}
            {successMessage && (
              <div className="alert alert-success mt-5">
                {successMessage}
                <button
                  className="btn btn-sm btn-circle btn-ghost ml-auto"
                  onClick={() => setSuccessMessage("")}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Error Alert */}
            {errorMessage && (
              <div className="alert alert-error mt-5">
                {errorMessage}
                <button
                  className="btn btn-sm btn-circle btn-ghost ml-auto"
                  onClick={() => setErrorMessage("")}
                >
                  ✕
                </button>
              </div>
            )}
            {events ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
                {events.map((event) => (
                  <div key={event.id} className="card bg-base-100 shadow-xl">
                    <figure>
                      <img
                        src={BASE_URL + "/storage/" + event.banner}
                        alt={event.title}
                        className="w-full h-80 object-cover"
                      />
                    </figure>
                    <div className="card-body">
                      <h2 className="card-title">{event.title}</h2>
                      <p>{event.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">
                          {new Date(event.start_date).toLocaleString()}
                        </span>
                        <div>
                          <span className="text-lg mr-5 font-semibold">
                            ${event.price}
                          </span>
                          <span className="badge badge-accent">
                            Seat remains {event.remaining_seats}
                          </span>
                        </div>
                      </div>
                      <div className="card-actions justify-end mt-5">
                        <div className="flex items-center mr-4">
                          <button
                            className="btn btn-sm btn-error mx-1"
                            onClick={() => handleQuantityChange(event.id, -1)}
                            disabled={(quantities[event.id] || 1) <= 1} // Disable if quantity is 1
                          >
                            -
                          </button>
                          <input
                            type="number"
                            className="input input-sm input-bordered w-16 text-center"
                            value={quantities[event.id] || 1} // Default to 1 if not set
                            readOnly
                          />
                          <button
                            className="btn btn-sm btn-success mx-1"
                            onClick={() => handleQuantityChange(event.id, 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="btn btn-sm btn-secondary mx-2"
                          onClick={() => handleBooking(event.id)}
                          disabled={loadingEventId === event.id}
                        >
                          {loadingEventId === event.id ? (
                            <span className="loading loading-spinner"></span>
                          ) : (
                            "Book Now!"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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

export default Home;
