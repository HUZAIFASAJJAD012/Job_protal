// src/Pages/renewal-success.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { CheckCircle } from "lucide-react";

export default function RenewalSuccess() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 bg-white rounded-lg drop-shadow-lg">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-[#2B8200]" />
        </div>

        <h1 className="text-2xl font-bold mb-4 text-center">Subscription Renewed!</h1>
        <p className="text-gray-600 mb-8 text-center">
          Your subscription has been successfully renewed. You can continue posting jobs and accessing all premium features.
        </p>

        <div className="space-y-3">
          <Link to="/school-jobs">
            <Button className="w-full bg-[#2B8200] hover:bg-green-700 text-white py-3">
              Return to Dashboard
            </Button>
          </Link>

          <Link to="/school-add-job">
            <Button variant="outline" className="w-full border-[#ffcc00] text-[#ffcc00] hover:bg-[#ffcc00] hover:text-black py-3">
              Post a New Job
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}