import express from 'express';
import { createSchoolPaymentSession } from '../controllers/paymentController.js';
import { handleStripeWebhook } from '../controllers/paymentWebhook.js';

const router = express.Router();

// Route to create Stripe checkout session
router.post('/create-checkout-session',createSchoolPaymentSession );

router.post(
    '/webhook',
    express.raw({ type: 'application/json' }), // raw body for Stripe
    handleStripeWebhook
  );
export default router;
