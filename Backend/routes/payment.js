import express from 'express';
import { createJobApplicationSession, createRenewalSession, createSchoolPaymentSession, getSubscriptionStatus } from '../controllers/paymentController.js';
import { handleStripeWebhook } from '../controllers/paymentWebhook.js';

const router = express.Router();

// Route to create Stripe checkout session
router.post('/create-checkout-session',createSchoolPaymentSession );
router.post(
    '/webhook',
    express.raw({ type: 'application/json' }), // raw body for Stripe
    handleStripeWebhook
  );
  router.post('/create-renewal-session', createRenewalSession);

  router.get('/subscription/:schoolId', getSubscriptionStatus);

router.post("/job-application",createJobApplicationSession)
export default router;
