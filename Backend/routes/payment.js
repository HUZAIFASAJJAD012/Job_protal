import express from 'express';
import PaymentController from '../controllers/paymentController.js'; // Ensure this path is correct

const router = express.Router();

router.post('/checkout', PaymentController.checkout);
router.get('/getTransiction', PaymentController.getTransaction)

export default router;
