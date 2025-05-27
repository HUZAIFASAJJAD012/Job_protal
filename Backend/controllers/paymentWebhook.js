// controllers/paymentWebhook.js
import dotenv from 'dotenv';
dotenv.config();

import Stripe from 'stripe';
import { School } from '../models/schoolModel.js';
import JobApplied from '../models/appliedJob.js';
import Payment from '../models/paymentModel.js';
import mongoose from 'mongoose';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Calculate expiry date for school subscriptions
    let expiryDate = null;
    if (session.metadata.type === 'school') {
      expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month subscription
    }

    // Save payment record regardless of type
    let paymentRecord = null;
    try {
      let userId = null;
      
      // Get the correct user ID based on session type
      if (session.metadata.type === 'school') {
        if (session.metadata.renewal === 'true') {
          userId = session.metadata.schoolId;
        } else if (session.metadata.jsonData) {
          const schoolData = JSON.parse(session.metadata.jsonData);
          // If this is a new school registration, we might not have an ID yet
          if (schoolData._id) {
            userId = schoolData._id;
          } else {
            // For new schools, we'll use the email to find or create later
            // Just create a temporary MongoDB ObjectId for the payment
            userId = new mongoose.Types.ObjectId();
          }
        }
      } else if (session.metadata.type === 'job_application') {
        userId = session.metadata.user_id;
      }
      
      if (!userId) {
        throw new Error('Could not determine user ID from session metadata');
      }

      paymentRecord = new Payment({
        user: userId,
        type: session.metadata.type,
        amount: session.amount_total / 100, // Convert from cents
        currency: session.currency,
        paymentDate: new Date(),
        expiryDate: expiryDate,
        stripeSessionId: session.id,
        status: 'completed',
        metadata: session.metadata
      });

      await paymentRecord.save();
      console.log(`✅ Payment recorded: ${session.id}`);
      console.log("paymentRecord"+paymentRecord);
      
    } catch (e) {
      console.error('Error saving payment record:', e);
    }

    // Handle School Payment
    try {
      if (session.metadata.type === 'school') {
        if (session.metadata.renewal === 'true') {
          // Handle renewal
          const schoolId = session.metadata.schoolId;
          const school = await School.findById(schoolId);
          
          if (school) {
            school.subscriptionActive = true;
            school.subscriptionExpiryDate = expiryDate;
            if (paymentRecord && paymentRecord._id) {
              if (!school.subscriptionHistory) school.subscriptionHistory = [];
              school.subscriptionHistory.push(paymentRecord._id);
            }
            await school.save();
            console.log(`✅ School subscription renewed: ${school.email}`);
          }
        } else {
          // Handle new registration
          const schoolData = JSON.parse(session.metadata.jsonData);
          
          // Check if school already exists
          let school = await School.findOne({ email: schoolData.email });
          
          if (!school) {
            // Create new school
            school = new School({
              schoolName: schoolData.schoolName,
              email: schoolData.email,
              password: schoolData.password,
              country: schoolData.country,
              area: schoolData.area,
              phone: schoolData.phone,
              firstName: schoolData.firstName,
              lastName: schoolData.lastName,
              role: schoolData.role,
              subscriptionActive: true,
              subscriptionExpiryDate: expiryDate
            });
            
            // Only add payment reference if valid
            if (paymentRecord && paymentRecord._id) {
              school.subscriptionHistory = [paymentRecord._id];
            }
            
            await school.save();
            console.log(`✅ New school created: ${school.email}`);
            
            // Update the payment with the new school ID if needed
            if (paymentRecord && school._id && paymentRecord.user.toString() !== school._id.toString()) {
              await Payment.findByIdAndUpdate(paymentRecord._id, { user: school._id });
            }
          } else {
            // Update existing school
            school.subscriptionActive = true;
            school.subscriptionExpiryDate = expiryDate;
            
            if (paymentRecord && paymentRecord._id) {
              if (!school.subscriptionHistory) school.subscriptionHistory = [];
              school.subscriptionHistory.push(paymentRecord._id);
            }
            
            await school.save();
            console.log(`✅ Existing school updated: ${school.email}`);
          }
        }
      }
    } catch (e) {
      console.error('Error handling school payment:', e);
    }

    // Handle Job Application Payment
    if (session.metadata.type === 'job_application') {
      
      try {
        const userId = session.metadata.user_id;
        const jobId = session.metadata.job_id;

        // Check if user has already applied for the job
        const existingApplication = await JobApplied.findOne({ user: userId, job: jobId });
        if (!existingApplication) {
          const newApplication = new JobApplied({
            user: userId,
            job: jobId,
            payment: paymentRecord ? paymentRecord._id : null
          });

          await newApplication.save();
          console.log(`✅ Job application saved for Job ID: ${jobId} and User ID: ${userId}`);
        } else {
          console.log('⚠️ User already applied for this job');
        }
      } catch (e) {
        console.error('Error saving job application after payment:', e);
      }
    }
  }

  res.status(200).json({ received: true });
};