// src/Pages/school/SubscriptionStatus.jsx
import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import api from "../../Utils/Axios";
import { toast } from "react-toastify";
import { CalendarDays, AlertCircle, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SubscriptionStatus({ schoolId }) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      toast.error("Could not fetch subscription status");
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
      toast.error("Failed to start renewal process. Please try again.");
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