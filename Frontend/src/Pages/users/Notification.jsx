import React, { useEffect, useState, useContext } from "react";
import Header from "../users/Header";
import api from "../../Utils/Axios";
import { Store } from "../../Utils/Store";
import { Card } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const { state } = useContext(Store);
  const { UserInfo } = state;

  const [userApproved, setUserApproved] = useState(false);
  const [userNotifications, setUserNotifications] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const [errorNotifications, setErrorNotifications] = useState(null);
  const [errorJobs, setErrorJobs] = useState(null);

  const navigate = useNavigate();

  // Fetch user notifications & check approval
  useEffect(() => {
    if (!UserInfo?.id) return;

    const fetchNotifications = async () => {
      setLoadingNotifications(true);
      setErrorNotifications(null);

      try {
        const res = await api.get(`/notifications/user/${UserInfo.id}`);
        const notifications = res.data || [];

        setUserNotifications(notifications);

        // Check if user is approved
        const approved = notifications.some(
          (notification) => notification.status === "approved"
        );
        setUserApproved(approved);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setErrorNotifications("Failed to load notifications. Please try again.");
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, [UserInfo]);

  // Fetch jobs only if user is approved
  useEffect(() => {
    if (!userApproved) return;

    const fetchJobs = async () => {
      setLoadingJobs(true);
      setErrorJobs(null);

      try {
        const response = await api.get("/school/get/job");
        const jobsData = response.data || [];
        setJobs(jobsData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setErrorJobs("Failed to load jobs. Please try again.");
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, [userApproved]);

  // Click handler to open job details via navigation
  const handleNotificationClick = (notification) => {
    const job = jobs.find((j) => j._id === notification.job);

    if (job) {
      navigate("/user/job-detail", {
        state: { job },
      });
    } else {
      alert("Job details not found.");
    }
  };

  return (
    <>
      <Header />
      <div className="w-full min-h-screen bg-[#FAFAFA]">
        <div className="w-full max-w-5xl mx-auto p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center">
            Notifications & Jobs
          </h1>

          {/* Notifications Section */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Your Notifications</h2>

            {loadingNotifications && (
              <p className="text-center text-gray-500">Loading notifications...</p>
            )}

            {errorNotifications && (
              <p className="text-center text-red-600 font-semibold">{errorNotifications}</p>
            )}

            {!loadingNotifications && !errorNotifications && userNotifications.length === 0 && (
              <p className="text-gray-600 text-sm font-semibold text-center">
                No notifications found.
              </p>
            )}

            {!loadingNotifications &&
              !errorNotifications &&
              userNotifications.length > 0 &&
              userNotifications.map((notification) => {
                const relatedJob = jobs.find((job) => job._id === notification.job);

                return (
                  <Card
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className="p-4 mb-4 bg-white shadow hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  >
                    <p className="text-sm text-gray-800 font-medium">
                      {notification.message || "Job Notification"}
                    </p>
                    {relatedJob && (
                      <p className="text-xs text-gray-500 mt-1">
                        Job: <strong>{relatedJob.title}</strong> at{" "}
                        {relatedJob.schoolName}
                      </p>
                    )}
                  </Card>
                );
              })}
          </section>

          {/* Jobs Section (Optional) */}
          {userApproved && (
            <section>
              <h2 className="text-lg font-semibold mb-4">Approved Jobs</h2>

              {loadingJobs && (
                <p className="text-center text-gray-500">Loading jobs...</p>
              )}

              {errorJobs && (
                <p className="text-center text-red-600 font-semibold">{errorJobs}</p>
              )}

              {!loadingJobs &&
                !errorJobs &&
                jobs.map((job) => (
                  <Card
                    key={job._id}
                    onClick={() => navigate("/user/job-detail", { state: { job } })}
                    className="p-4 mb-4 bg-white shadow-xl hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  >
                    <p className="text-sm font-semibold text-gray-900">{job.title}</p>
                    <p className="text-xs text-gray-500">{job.schoolName}</p>
                    <p className="text-xs text-gray-500">{job.description}</p>
                  </Card>
                ))}
            </section>
          )}
        </div>
      </div>
    </>
  );
}
