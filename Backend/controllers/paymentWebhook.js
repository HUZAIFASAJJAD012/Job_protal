import dotenv from 'dotenv';
dotenv.config();

import Stripe from 'stripe';
import { School } from '../models/schoolModel.js';

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

    try {
      const parsed = JSON.parse(session.metadata.jsonData);
      console.log(parsed);
      const exists = await School.findOne({ email: parsed.email });
      if (!exists) {
        const newSchool = new School(parsed);
        await newSchool.save();
        console.log("newSchool"+newSchool);
        
        console.log(`✅ School created after payment: ${parsed.email}`);
      }
    } catch (e) {
      console.error('Error saving school after payment:', e);
    }
  }

  res.status(200).json({ received: true });
};
