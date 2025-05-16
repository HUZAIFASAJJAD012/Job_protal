import {Search, ChevronDown, Check, Paperclip, Mic, Send, CalendarDays, AlertCircle} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "../../components/ui/avatar";
import {Button} from "../../components/ui/button";
import {Input} from "../../components/ui/input";
import {ScrollArea} from "../../components/ui/scroll-area";
import {Card} from "../../components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import React, {useContext, useEffect, useState} from "react";
import Header from "./Header";
import {Link} from "react-router-dom";
import {Store} from "../../Utils/Store";
import api from "../../Utils/Axios";
import ChatInput from "../ChatInput";

// Subscription Status Component
function SubscriptionStatus({ schoolId }) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [schoolId]);

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/payment/subscription/${schoolId}`);
      setSubscription(response.data.subscription);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRenewal = async () => {
    try {
      const response = await api.post("/api/payment/create-renewal-session", {
        schoolId,
      });

      if (response.data.url) {
        window.location.href = response.data.url; // Redirect to Stripe
      }
    } catch (error) {
      console.error("Error creating renewal session:", error);
    }
  };

  if (loading) {
    return (
      <Card className="p-4 bg-white rounded-lg drop-shadow-md">
        <div className="text-center p-4">Loading subscription information...</div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-white rounded-lg drop-shadow-md">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <CalendarDays className="h-5 w-5 mr-2 text-[#2B8200]" />
        Subscription Status
      </h2>

      {subscription ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                subscription.active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {subscription.active ? "Active" : "Inactive"}
            </span>
          </div>

          {subscription.active && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Expires on:</span>
                <span className="text-sm">
                  {new Date(subscription.expiryDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Days remaining:</span>
                <span
                  className={`text-sm font-bold ${
                    subscription.daysRemaining < 7
                      ? "text-orange-600"
                      : "text-[#2B8200]"
                  }`}
                >
                  {subscription.daysRemaining}
                </span>
              </div>
            </>
          )}

          {subscription.lastPayment && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last payment:</span>
              <span className="text-sm">
                {new Date(subscription.lastPayment.date).toLocaleDateString()}{" "}
                ({subscription.lastPayment.amount}{" "}
                {subscription.lastPayment.currency.toUpperCase()})
              </span>
            </div>
          )}

          {!subscription.active && (
            <div className="mt-2 p-2 bg-yellow-50 rounded-lg flex items-start">
              <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-xs text-yellow-700">
                Your subscription has expired. You won't be able to post new jobs 
                until you renew your subscription.
              </p>
            </div>
          )}

          {subscription.active && subscription.daysRemaining < 7 && (
            <div className="mt-2 p-2 bg-yellow-50 rounded-lg flex items-start">
              <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-xs text-yellow-700">
                Your subscription will expire soon. Renew now to avoid interruption.
              </p>
            </div>
          )}

          <div className="mt-3">
            {!subscription.active || subscription.daysRemaining < 7 ? (
              <Button
                className="w-full bg-[#ffcc00] hover:bg-amber-500 text-black font-medium text-sm"
                onClick={handleRenewal}
              >
                {subscription.active ? "Renew Subscription" : "Reactivate Subscription"}
              </Button>
            ) : (
              <div className="text-xs text-gray-500 text-center flex items-center justify-center">
                <Check className="h-3.5 w-3.5 text-[#2B8200] mr-1" />
                Your subscription is active until{" "}
                {new Date(subscription.expiryDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-500">No subscription found</p>
          <Button
            className="bg-[#ffcc00] hover:bg-amber-500 text-black font-medium"
            onClick={handleRenewal}
          >
            Subscribe Now
          </Button>
        </div>
      )}
    </Card>
  );
}

export default function SchoolJobs() {
    
    const [message, setMessage] = useState("");
    const {state} = useContext(Store);
    const {UserInfo} = state;
    const [jobsAvailable, setJobsAvailable] = useState([]); // Dynamic job data
    const [appliedCandidate, setAppliedCandidate] = useState([]); // Applied candidates data
    const [conversations, setConversations] = useState([]); // Chat data
    const [searchQuery, setSearchQuery] = useState(""); // For searching jobs

    // Fetch jobs and applied candidates dynamically
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get("/school/get/job");
                const jobs = response.data || [];
                const filteredJobs = jobs.filter((job) => job.schoolId === UserInfo.id);
                setJobsAvailable(filteredJobs);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        const fetchAppliedCandidates = async () => {
            try {
                const response = await api.get("/school/get/applied-candidate");
                setAppliedCandidate(response.data || []);
            } catch (error) {
                console.error("Error fetching applied candidates:", error);
            }
        };

        fetchJobs();
        fetchAppliedCandidates();
    }, [UserInfo.id]);

    const filteredJobs = jobsAvailable.filter((job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const countAppliedCandidates = (jobId) => {
        return appliedCandidate.filter((candidate) => candidate.job === jobId).length;
    };

    return (
        <div className="min-h-screen bg-[#FBFBFB] flex flex-col">
            <Header/>
            <main className="flex-1 px-4 sm:px-6 py-4 space-y-4 w-full max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h1 className="text-xl font-medium">Hello {UserInfo.schoolName},</h1>
                    <Link to="/school-add-job">
                        <Button variant="ghost" className="flex items-center gap-1 bg-[#ffcc00]">
                            ADD JOB
                        </Button>
                    </Link>
                    <div className="relative w-full sm:w-72">
                        <Input
                            type="search"
                            placeholder="Search Jobs"
                            className="pl-10 bg-[#ECF0FA] rounded-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"/>
                    </div>
                </div>

                {/* Subscription Status Component */}
                <SubscriptionStatus schoolId={UserInfo.id} />

                <div className="space-y-8">
                    <h2 className="text-2xl font-bold -mb-6">Jobs</h2>
                    {filteredJobs.length > 0 ? (
                            filteredJobs.map((job, index) => (
                                <div key={index} className="bg-[#FFFFFF] rounded-lg p-4 sm:p-6 drop-shadow-lg">
                                    <Link to={`/school-jobs-applied/${job._id}`}
                                    >
                                        < div className="flex flex-col sm:flex-row justify-between gap-4">
                                            < div className="space-y-1">
                                                < div>
                                                    < h3 className="text-base font-semibold leading-none">
                                                        {job.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mb-2">{job.subtitle}</p>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Cover from: {new Date(job.coverFrom).toLocaleDateString()} · Cover
                                                    to: {new Date(job.coverTo).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm font-semibold">
                                                    Total
                                                    days: {Math.ceil((new Date(job.coverTo) - new Date(job.coverFrom)) / (1000 * 60 * 60 * 24))} days
                                                </p>
                                                <p className="text-sm font-semibold">
                                                    Pay per day: {job.payPerDay}/day {job.currency}
                                                </p>
                                                <p className="text-sm text-gray-500">Job ID : {job._id}</p>
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="text-sm">People Applied</span>
                                                <span
                                                    className="bg-[#2B8200] text-white w-12 h-8 flex items-center justify-center rounded-lg text-sm">
                                                {countAppliedCandidates(job._id)}
                                            </span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        ) :
                        (
                            <p className="text-sm text-gray-500">No jobs available.</p>
                        )
                    }
                </div>

                {/* Chat Section */}
               <ChatInput/>
            </main>
        </div>
    );
}