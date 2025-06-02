import express from 'express';
import {
  createNotification,
  getPendingNotifications,
  approveNotification,
  rejectNotification,
  getUserNotifications,
  getNotificationStatus,
  sendUserSelectedNotification,
} from '../controllers/notificationController.js';

const router = express.Router();

router.post('/', createNotification);
router.get('/pending', getPendingNotifications);
router.put('/approve/:id', approveNotification);
router.put('/reject/:id', rejectNotification);
router.get('/status/:userId', getNotificationStatus);
router.get('/user/:userId', getUserNotifications);
router.post('/send-selected', sendUserSelectedNotification);
export default router;