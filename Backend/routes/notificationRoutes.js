import express from 'express';
import {
  createNotification,
  getPendingNotifications,
  approveNotification,
  selectNotification,
  getUserNotifications,
  getNotificationStatus,
  sendUserSelectedNotification,
} from '../controllers/notificationController.js';

const router = express.Router();

router.post('/', createNotification);
router.get('/pending', getPendingNotifications);
router.put('/approve/:id', approveNotification);
router.put('/select/:id', selectNotification);
router.get('/status/:userId', getNotificationStatus);
router.get('/user/:userId', getUserNotifications);
router.post('/send-selected', sendUserSelectedNotification);
export default router;