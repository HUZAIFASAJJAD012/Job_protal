import dotenv from 'dotenv';
dotenv.config();

import Stripe from 'stripe';
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
            currency: 'usd',
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
        jsonData: JSON.stringify(schoolData), // All registration data passed as string
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err);
    res.status(500).json({ error: 'Failed to create Stripe session' });
  }
};

