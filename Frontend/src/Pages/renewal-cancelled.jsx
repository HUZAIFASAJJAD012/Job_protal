// src/Pages/renewal-cancelled.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { XCircle, AlertTriangle } from "lucide-react";

export default function RenewalCancelled() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 bg-white rounded-lg drop-shadow-lg">
        <div className="flex justify-center mb-6">
          <XCircle className="h-16 w-16 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold mb-4 text-center">Renewal Cancelled</h1>
        <p className="text-gray-600 mb-6 text-center">
          Your subscription renewal was not completed. No charges have been made to your account.
        </p>
        
        <div className="bg-yellow-50 p-4 rounded-lg mb-6">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-700">
              Without an active subscription, you may lose access to premium features when your current subscription expires.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Link to="/school-jobs">
            <Button className="w-full bg-[#2B8200] hover:bg-green-700 text-white py-3">
              Return to Dashboard
            </Button>
          </Link>

          <Link to="/school/renew-subscription">
            <Button variant="outline" className="w-full border-[#ffcc00] text-[#ffcc00] hover:bg-[#ffcc00] hover:text-black py-3">
              Try Again
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}