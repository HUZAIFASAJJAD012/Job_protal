// controllers/paymentController.js - FIXED VERSION
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
    // METHOD 1: Create a unique customer first, then use it
    const customer = await stripe.customers.create({
      email: schoolData.email,
      name: `${schoolData.firstName} ${schoolData.lastName}`,
      metadata: {
        type: 'school',
        schoolName: schoolData.schoolName,
        created_at: new Date().toISOString()
      }
    });

    console.log(`✅ Created unique customer: ${customer.id} for ${schoolData.email}`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'qar',
            product_data: {
              name: `School Registration: ${schoolData.schoolName}`,
            },
            unit_amount: 39900,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL.split(',')[0]}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL.split(',')[0]}/`,
      
      // Use the specific customer we just created
      customer: customer.id,
      
      metadata: {
        email: schoolData.email,
        jsonData: JSON.stringify(schoolData), 
        type: 'school',
        customer_id: customer.id,
        unique_session_id: `school_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      },
    });

    console.log(`✅ Created session: ${session.id} with customer: ${customer.id}`);
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err);
    res.status(500).json({ error: 'Failed to create Stripe session' });
  }
};

export const createJobApplicationSession = async (req, res) => {
  const { user_id, job_id } = req.body;

  try {
      if (!user_id || !job_id) {
          return res.status(400).json({ error: "User ID and Job ID are required" });
      }

      const existingApplication = await JobApplied.findOne({ user: user_id, job: job_id });
      if (existingApplication) {
          return res.status(400).json({ error: "You have already applied for this job" });
      }

      // METHOD 2: Create unique customer for job applications
      // Use a unique email pattern to avoid conflicts
      const uniqueEmail = `job-${user_id}-${job_id}-${Date.now()}@tempuser.local`;
      
      const customer = await stripe.customers.create({
        email: uniqueEmail,
        metadata: {
          type: 'job_application',
          user_id: user_id,
          job_id: job_id,
          created_at: new Date().toISOString()
        }
      });

      console.log(`✅ Created unique customer: ${customer.id} for job application`);

      const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
              {
                  price_data: {
                      currency: 'qar',
                      product_data: {
                          name: `Job Application Fee for Job ID: ${job_id}`,
                      },
                      unit_amount: 1500,
                  },
                  quantity: 1,
              },
          ],
          mode: 'payment',
          success_url: `${process.env.FRONTEND_URL.split(',')[0]}/application-success`,
          cancel_url: `${process.env.FRONTEND_URL.split(',')[0]}/application-cancelled`,
          
          // Use the specific customer we created
          customer: customer.id,
          
          metadata: {
              user_id: user_id,
              job_id: job_id,
              type: 'job_application',
              customer_id: customer.id,
              unique_session_id: `job_${user_id}_${job_id}_${Date.now()}`
          },
      });

      console.log(`✅ Created session: ${session.id} with customer: ${customer.id}`);
      res.status(200).json({ url: session.url });

  } catch (error) {
      console.error('Error creating payment session:', error);
      res.status(500).json({ error: 'Failed to create Stripe payment session' });
  }
};

// ALTERNATIVE METHOD: If you want to use real emails for job applications
export const createJobApplicationSessionWithRealEmail = async (req, res) => {
  const { user_id, job_id, user_email } = req.body; // Add user_email to request

  try {
      if (!user_id || !job_id || !user_email) {
          return res.status(400).json({ error: "User ID, Job ID, and User Email are required" });
      }

      const existingApplication = await JobApplied.findOne({ user: user_id, job: job_id });
      if (existingApplication) {
          return res.status(400).json({ error: "You have already applied for this job" });
      }

      // Create customer with a modified email to ensure uniqueness
      const timestampedEmail = user_email.replace('@', `+job${job_id}t${Date.now()}@`);
      
      const customer = await stripe.customers.create({
        email: timestampedEmail,
        metadata: {
          type: 'job_application',
          user_id: user_id,
          job_id: job_id,
          original_email: user_email,
          created_at: new Date().toISOString()
        }
      });

      const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
              {
                  price_data: {
                      currency: 'qar',
                      product_data: {
                          name: `Job Application Fee for Job ID: ${job_id}`,
                      },
                      unit_amount: 1500,
                  },
                  quantity: 1,
              },
          ],
          mode: 'payment',
          success_url: `${process.env.FRONTEND_URL.split(',')[0]}/application-success`,
          cancel_url: `${process.env.FRONTEND_URL.split(',')[0]}/application-cancelled`,
          customer: customer.id,
          metadata: {
              user_id: user_id,
              job_id: job_id,
              type: 'job_application',
              customer_id: customer.id,
              original_email: user_email
          },
      });

      res.status(200).json({ url: session.url });

  } catch (error) {
      console.error('Error creating payment session:', error);
      res.status(500).json({ error: 'Failed to create Stripe payment session' });
  }
};

export const getSubscriptionStatus = async (req, res) => {
  try {
    const schoolId = req.params.schoolId;
    console.log('Received schoolId:', schoolId);
    
    if (!mongoose.Types.ObjectId.isValid(schoolId)) {
      console.log('Invalid school ID format:', schoolId);
      return res.status(400).json({ error: 'Invalid school ID format' });
    }
    
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }
    
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

export const createRenewalSession = async (req, res) => {
  const { schoolId } = req.body;
  
  try {
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }
    
    // Create unique customer for renewal
    const customer = await stripe.customers.create({
      email: school.email,
      name: school.schoolName,
      metadata: {
        type: 'school_renewal',
        schoolId: schoolId,
        created_at: new Date().toISOString()
      }
    });
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'qar',
            product_data: {
              name: `Subscription Renewal: ${school.schoolName}`,
            },
            unit_amount: 39900,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL.split(',')[0]}/renewal-success`,
      cancel_url: `${process.env.FRONTEND_URL.split(',')[0]}/renewal-cancelled`,
      customer: customer.id,
      metadata: {
        schoolId: schoolId,
        email: school.email,
        type: 'school',
        renewal: 'true',
        customer_id: customer.id
      },
    });
    
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating renewal session:', error);
    res.status(500).json({ error: 'Failed to create renewal session' });
  }
};