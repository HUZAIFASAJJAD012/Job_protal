// src/Pages/school/RenewSubscription.jsx
import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import api from "../../Utils/Axios";
import { toast } from "react-toastify";
import Header from "./Header";
import { CalendarDays, Check, AlertTriangle } from "lucide-react";
import { useContext } from "react";
import { Store } from "../../Utils/Store";

export default function RenewSubscription() {
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const { state } = useContext(Store);
  const { UserInfo } = state;

  useEffect(() => {
    fetchSubscriptionInfo();
  }, []);

  const fetchSubscriptionInfo = async () => {
    try {
      if (!UserInfo || !UserInfo.id) return;

      const response = await api.get(`/api/payment/subscription/${UserInfo.id}`);
      setSubscription(response.data.subscription);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      toast.error("Could not load subscription information");
    }
  };

  const handleRenewal = async () => {
    try {
      setLoading(true);
      
      const response = await api.post("/api/payment/create-renewal-session", {
        schoolId: UserInfo.id
      });
      
      if (response.data.url) {
        window.location.href = response.data.url; // Redirect to Stripe
      }
    } catch (error) {
      console.error("Error creating renewal session:", error);
      toast.error("Failed to create renewal session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col">
      <Header />
      <main className="flex-1 px-4 sm:px-6 py-8 w-full max-w-3xl mx-auto">
        <Card className="p-6 sm:p-8 bg-white rounded-lg drop-shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <CalendarDays className="h-6 w-6 text-[#2B8200]" />
            <h1 className="text-2xl font-bold">Subscription Management</h1>
          </div>

          {subscription && (
            <div className="mb-8">
              <Card className="p-4 bg-gray-50 border-gray-200 mb-6">
                <h2 className="font-semibold text-lg mb-3">Current Status</h2>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm">Status:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      subscription.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {subscription.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  
                  {subscription.active && (
                    <>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-sm">Expires on:</span>
                        <span className="text-sm">
                          {new Date(subscription.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-sm">Days remaining:</span>
                        <span className={`text-sm font-semibold ${
                          subscription.daysRemaining < 7 ? "text-orange-600" : "text-[#2B8200]"
                        }`}>
                          {subscription.daysRemaining}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </div>
          )}

          <div className="space-y-6">
            <div className="bg-[#F0F9EB] p-4 rounded-lg border border-[#E6F2DF]">
              <h3 className="font-semibold text-lg mb-3 text-[#2B8200]">Subscription Benefits</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-[#2B8200] mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Post unlimited job listings</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-[#2B8200] mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Access to all qualified candidates</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-[#2B8200] mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Priority listing in search results</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-[#2B8200] mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Advanced candidate filtering tools</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-[#2B8200] mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Dedicated customer support</span>
                </li>
              </ul>
            </div>

            {!subscription?.active && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-700">
                    Your subscription is inactive. You won't be able to post new jobs 
                    or access premium features until you renew.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-lg p-5 text-center">
              <span className="text-3xl font-bold text-[#2B8200]">399 QAR</span>
              <span className="text-gray-600 ml-2">per month</span>
              <p className="text-sm text-gray-500 mt-1">Cancel anytime</p>
            </div>

            <Button
              className="w-full bg-[#ffcc00] hover:bg-amber-500 text-black font-medium py-3 text-lg"
              onClick={handleRenewal}
              disabled={loading}
            >
              {loading ? "Processing..." : subscription?.active 
                ? "Renew Subscription" 
                : "Activate Subscription"}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}