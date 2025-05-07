// controllers/paymentController.js
import dotenv from 'dotenv';
dotenv.config();
import JobApplied from '../models/appliedJob.js';  
import Payment from '../models/paymentModel.js';
import { School } from '../models/schoolModel.js';

import Stripe from 'stripe';
import mongoose from 'mongoose';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Creates Stripe Checkout session for school registration
export const createSchoolPaymentSession = async (req, res) => {
  const { schoolData } = req.body;
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'qar',
            product_data: {
              name: `School Registration: ${schoolData.schoolName}`,
            },
            unit_amount: 39900, // $399 x 100
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL.split(',')[0]}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL.split(',')[0]}/payment-cancelled`,
      metadata: {
        email: schoolData.email,
        jsonData: JSON.stringify(schoolData), 
        type:'school'
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err);
    res.status(500).json({ error: 'Failed to create Stripe session' });
  }
};

export const createJobApplicationSession = async (req, res) => {
  const { user_id, job_id } = req.body;

  try {
      // Check if user_id and job_id are provided
      if (!user_id || !job_id) {
          return res.status(400).json({ error: "User ID and Job ID are required" });
      }

      // Check if the user has already applied for this job
      const existingApplication = await JobApplied.findOne({ user: user_id, job: job_id });
      if (existingApplication) {
          return res.status(400).json({ error: "You have already applied for this job" });
      }

      // Create Stripe checkout session for payment
      const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
              {
                  price_data: {
                      currency: 'qar',
                      product_data: {
                          name: `Job Application Fee for Job ID: ${job_id}`,
                      },
                      unit_amount: 1500, // Example fee (500 cents = $5)
                  },
                  quantity: 1,
              },
          ],
          mode: 'payment',
          success_url: `${process.env.FRONTEND_URL.split(',')[0]}/application-success`,
          cancel_url: `${process.env.FRONTEND_URL.split(',')[0]}/application-cancelled`,
          metadata: {
              user_id: user_id,
              job_id: job_id,
              type:'job_application'
          },
      });

      // Respond with the Stripe session URL
      res.status(200).json({ url: session.url });

  } catch (error) {
      console.error('Error creating payment session:', error);
      res.status(500).json({ error: 'Failed to create Stripe payment session' });
  }
};

// Add new method to check subscription status
export const getSubscriptionStatus = async (req, res) => {
  try {
    const schoolId = req.params.schoolId;
    console.log('Received schoolId:', schoolId);
    ('Received schoolId:', schoolId);
    if (!mongoose.Types.ObjectId.isValid(schoolId)) {
      console.log('Invalid school ID format:', schoolId);
      return res.status(400).json({ error: 'Invalid school ID format' });
    }
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }
    
    
    // Get latest payment
    const latestPayment = await Payment.findOne({ 
      user: schoolId,
      type: 'school',
      status: 'completed'
    }).sort({ paymentDate: -1 });
    
    const isActive = school.subscriptionActive && 
      (school.subscriptionExpiryDate > new Date());
    
    const daysRemaining = isActive ? 
      Math.ceil((school.subscriptionExpiryDate - new Date()) / (1000 * 60 * 60 * 24)) : 0;
    
    res.status(200).json({
      success: true,
      subscription: {
        active: isActive,
        expiryDate: school.subscriptionExpiryDate,
        daysRemaining: daysRemaining,
        lastPayment: latestPayment ? {
          date: latestPayment.paymentDate,
          amount: latestPayment.amount,
          currency: latestPayment.currency
        } : null
      }
    });
  } catch (error) {
    console.error('Error checking subscription status:', error);
    res.status(500).json({ error: 'Failed to check subscription status' });
  }
};

// Add method to renew subscription
export const createRenewalSession = async (req, res) => {
  const { schoolId } = req.body;
  
  try {
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }
    
    // Create new checkout session for renewal
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'qar',
            product_data: {
              name: `Subscription Renewal: ${school.schoolName}`,
            },
            unit_amount: 39900, // $399 x 100
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL.split(',')[0]}/renewal-success`,
      cancel_url: `${process.env.FRONTEND_URL.split(',')[0]}/renewal-cancelled`,
      metadata: {
        schoolId: schoolId,
        email: school.email,
        type: 'school',
        renewal: 'true'
      },
    });
    
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating renewal session:', error);
    res.status(500).json({ error: 'Failed to create renewal session' });
  }
};