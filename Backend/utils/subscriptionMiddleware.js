// utils/subscriptionMiddleware.js
import { School } from '../models/schoolModel.js';
import AppError from './error.js';

export const checkSchoolSubscription = async (req, res, next) => {
  try {
    // Get school ID from request or user object
    const schoolId = req.params.schoolId || req.user?.schoolId || req.body?.schoolId;
    
    if (!schoolId) {
      return next();
    }
    
    const school = await School.findById(schoolId);
    
    if (!school) {
      return next(new AppError('School not found', 404));
    }
    
    // Check if subscription is active and not expired
    const isActive = school.subscriptionActive && 
      (school.subscriptionExpiryDate > new Date());
    console.log("Subscription status:", isActive, school.subscriptionExpiryDate, new Date());
    
    if (!isActive) {
      return next(new AppError('Subscription expired. Please renew to continue.', 403));
    }
    
    // Add subscription info to request for potential use in controllers
    req.subscription = {
      active: true,
      expiryDate: school.subscriptionExpiryDate,
      daysRemaining: Math.ceil(
        (school.subscriptionExpiryDate - new Date()) / (1000 * 60 * 60 * 24)
      )
    };
    
    next();
  } catch (error) {
    next(error);
  }
};