/* eslint-disable @next/next/no-img-element */
"use client";
import { useAppContext } from "@/app/AppContext";
import axios, { BASE_URL } from "@/app/axios";
import Header from "@/app/layouts/admin/Header";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { user, authToken } = useAppContext();
  const [events, setEvents] = useState(null);
  const router = useRouter();

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

  const handleDelete = async (eventId) => {
    const confirmed = confirm("Are you sure you want to delete this event?");
    if (confirmed) {
      try {
        await axios.delete(`/api/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setEvents(events.filter((event) => event.id !== eventId));
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const handleEdit = (eventId) => {
    router.push(`/events/edit/${eventId}`);
  };

  return (
    <>
      {user ? (
        <>
          <Header />
          <div className="container mx-auto">
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
                            {event.seats} seats
                          </span>
                        </div>
                      </div>
                      <div className="card-actions justify-end mt-5">
                        {/* Edit Button */}
                        <button
                          className="btn btn-sm btn-warning mx-2"
                          onClick={() => handleEdit(event.id)}
                        >
                          Edit
                        </button>
                        {/* Delete Button */}
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => handleDelete(event.id)}
                        >
                          Delete
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

export default Dashboard;
