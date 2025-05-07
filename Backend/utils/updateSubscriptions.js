// utils/updateSubscriptions.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { School } from '../models/schoolModel.js';
import Payment from '../models/paymentModel.js';

dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('Database connection error:', err));

async function updateExpiredSubscriptions() {
  try {
    const now = new Date();
    
    // Find schools with expired subscriptions
    const expiredSchools = await School.find({
      subscriptionActive: true,
      subscriptionExpiryDate: { $lt: now }
    });
    
    console.log(`Found ${expiredSchools.length} schools with expired subscriptions`);
    
    // Update each school's subscription status
    for (const school of expiredSchools) {
      school.subscriptionActive = false;
      await school.save();
      
      console.log(`Updated subscription status for school: ${school.schoolName} (${school._id})`);
    }
    
    console.log('Subscription update completed');
  } catch (error) {
    console.error('Error updating subscriptions:', error);
  } finally {
    mongoose.disconnect();
    console.log('Database disconnected');
  }
}

// Execute the function
updateExpiredSubscriptions();