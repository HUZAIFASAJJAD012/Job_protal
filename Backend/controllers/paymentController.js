import { v4 as uuidv4 } from "uuid";
import stripe from "stripe";
import PaymentModel from "../models/paymentModel.js";
import UserModel from "../models/userModel.js";
import dotenv from "dotenv";
import { fail } from "assert";

dotenv.config();

// const stripeSecretKey = process.env.stripe_Secret_Key;
const stripeSecretKey =
  "sk_test_51OGbliKue2i3LW4N4ir7njHXaj35PLAJqZnFwZrhbsZRXc4JFAwInE9cpYmW8SNOREcZvFthHKY9Z3rft9vWT9FS00y6K6gRWE";
const stripeInstance = stripe(stripeSecretKey);

class PaymentController {
  // Method to create a payment
  // static async createPayment(req, res, next) {
  //   const { token, amount, userId } = req.body;

  //   try {
  //     // 1. Create a customer with Stripe using token data (email, card info)
  //     const customer = await stripeInstance.customers.create({
  //       email: token.email,
  //       source: token.id,
  //     });

  //     // 2. Charge the customer for the specified amount
  //     const charge = await stripeInstance.charges.create({
  //       amount,
  //       currency: "pounds",  // change this to GBP or the desired currency if needed
  //       customer: customer.id,
  //       receipt_email: token.email,
  //       description: "Payment Description",
  //     });

  //     // 3. Save the payment details to the database (MongoDB via PaymentModel)
  //     const paymentId = uuidv4(); // Generate a unique payment ID
  //     const newPayment = new PaymentModel({
  //       paymentId,
  //       userId,           // Associate the payment with a user
  //       amount,
  //       currency: "usd",  // Change if needed
  //       paymentStatus: charge.status, // Save the payment status (e.g., succeeded)
  //       receiptUrl: charge.receipt_url, // Save the receipt URL
  //       description: "Payment for services", // Can customize as needed
  //     });

  //     await newPayment.save(); // Save payment to DB

  //     // 4. Optionally, update user's payment history in UserModel
  //     await UserModel.findByIdAndUpdate(userId, {
  //       $push: { paymentHistory: paymentId },
  //     });

  //     // 5. Send success response with the charge and payment data
  //     res.status(200).json({ success: true, charge, payment: newPayment });
  //   } catch (error) {
  //     console.error("Payment error:", error);
  //     res.status(500).json({ error: "Payment failed. Please try again." });
  //   }
  // }

  static async checkout(req, res) {
    const { token, amount } = req.body;

    console.log("Data here");

    console.log(req.body.lawyerId);

    if (!token || !amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    try {
      const customer = await stripeInstance.customers.create({
        email: token.email,
        source: token.id,
      });

      const charge = await stripeInstance.charges.create({
        amount,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: "Payment Description",
      });

      const payment = new PaymentModel({
        userId: req.body.userId,
        lawyerId: req.body.lawyerId,
        amount: amount / 100,
        status: "Completed",
      });
      await payment.save();

      res.status(200).json(charge);
    } catch (error) {
      console.error("Payment Error:", error);
      res.status(400).json({ error: "Payment Failed" });
    }
  }

  // get transictions api

  static getTransaction = async (req, res, next) => {
    try {
      const transictions = req;
      if (!transictions) {
        res.status(2001).json({ success: fail, message: "No payment found" });
      } else {
        console.error("Error fetching Lawyer data:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    } catch (err) {
      next(err);
     
    }
  };
}

export default PaymentController;
