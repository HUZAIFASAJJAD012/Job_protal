import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from "../Utils/Axios";
import { toast } from "react-toastify";
import { Store } from "../Utils/Store";

export default function SubscriptionProtected({ children }) {
  const [hasActiveSubscription, setHasActiveSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { state } = useContext(Store);
  const { UserInfo } = state;
  
  useEffect(() => {
    // Only run this effect when UserInfo has loaded and has an _id
    console.log(UserInfo);    
    if (UserInfo && UserInfo.id) {
      checkSubscription();
    } else if (UserInfo === null) {
      // If UserInfo is explicitly null (not just loading), then user is not logged in
      setHasActiveSubscription(false);
      setLoading(false);
    }
    // Add UserInfo as a dependency so this effect runs when it changes
  }, [UserInfo]);
  
  const checkSubscription = async () => {
    try {
      if (!UserInfo || !UserInfo.id) {
        setHasActiveSubscription(false);
        setLoading(false);
        return;
      }
      
      console.log("Checking subscription for:", UserInfo.id);
      const response = await api.get(`/api/payment/subscription/${UserInfo.id}`);
      console.log("Subscription response:", response.data);
      
      setHasActiveSubscription(response.data.subscription.active);
    } catch (error) {
      console.error('Error checking subscription:', error);
      setHasActiveSubscription(false);
      toast.error('Could not verify subscription status');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="text-center p-8">Verifying subscription...</div>;
  }
  
  if (!hasActiveSubscription) {    
    toast.info('You need an active subscription to access this feature');
    return <Navigate to="/school/renew-subscription" state={{ from: location }} replace />;
  }
  
  return children;
}