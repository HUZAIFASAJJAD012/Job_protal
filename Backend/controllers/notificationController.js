import Notification from '../models/Notification.js';
import mongoose from 'mongoose';

// Create a new notification
export const createNotification = async (req, res) => {
  const { name, email, phone, userId } = req.body;

  // Validate required fields (excluding userId)
  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Name, email, and phone are required.' });
  }

  try {
    // Check if a subscription with the same email already exists
    const existing = await Notification.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Subscription already exists for this email.' });
    }

    // Create the notification object
    const notificationData = {
      name,
      email,
      phone,
      status: 'pending',
    };

    // Only add userId if provided
    if (userId) {
      notificationData.userId = userId;
    }

    const notification = new Notification(notificationData);
    await notification.save();

    return res.status(201).json({ message: 'Subscription created successfully', notification });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return res.status(500).json({ message: 'Server error while creating notification' });
  }
};

export const getNotificationStatus = async (req, res) => {
  const { userId } = req.params;
  try {
    const notification = await Notification.findOne({ userId });
    if (!notification) {
      return res.json({ approved: false, status: 'none' });
    }
    const approved = notification.status === 'approved';
    return res.json({ approved, status: notification.status });
  } catch (error) {
    console.error('Error fetching notification status:', error);
    return res.status(500).json({ message: 'Server error while fetching status' });
  }
};
export const sendUserSelectedNotification = async (req, res) => {
  const { userId, jobId, message, name, email, phone } = req.body;

  if (!userId || !message || !name || !email || !phone) {
    return res.status(400).json({ message: 'userId, name, email, phone, and message are required.' });
  }

  try {
    const notification = new Notification({
      userId,
      name,
      email,
      phone,
      jobId: jobId || null,
      message,
      status: 'selected',
    });

    await notification.save();

    return res.status(201).json({ message: 'User selection notification sent', notification });
  } catch (error) {
    console.error('Error sending user selection notification:', error);
    return res.status(500).json({ message: 'Server error while sending notification' });
  }
};
// Get all notifications with status 'pending'
export const getPendingNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ status: 'pending' });
    
    return res.json(notifications);
  } catch (error) {
    console.error('Error fetching pending notifications:', error);
    return res.status(500).json({ message: 'Failed to fetch pending notifications' });
  }
};

// Approve a notification by ID (update status to 'approved')
export const approveNotification = async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findByIdAndUpdate(id, {
    status: 'approved',
    message: 'You are approved for the notification.',
  });
  // Optional: Send email or push notification to user
  res.status(200).json({ success: true });
};
// Select a notification by ID (update status to 'selected')
export const rejectNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.json({ message: 'Notification rejected', notification });
  } catch (error) {
    console.error('Error rejecting notification:', error);
    return res.status(500).json({ message: 'Failed to reject notification' });
  }
};

// Get all notifications for a specific userId
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Fetching notifications for userId:', userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    // Find notifications for the user (all statuses)
    const notifications = await Notification.find({ userId: objectId });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};
