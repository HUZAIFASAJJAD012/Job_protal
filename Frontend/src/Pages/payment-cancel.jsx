// src/Pages/payment-cancelled.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { XCircle } from 'lucide-react';

export default function PaymentCancelled() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-4">
          <XCircle className="h-16 w-16 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your payment was not completed. No charges have been made to your account.
        </p>
        
        <div className="space-y-3">
          <Link to="/school/registration">
            <Button className="w-full bg-[#2B8200] hover:bg-green-700 text-white">
              Try Again
            </Button>
          </Link>
          
          <Link to="/">
            <Button variant="outline" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}