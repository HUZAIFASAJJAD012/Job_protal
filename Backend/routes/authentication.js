import express from 'express'
import {login} from '../controllers/authControllers.js';



const router = express.Router();

router.post('/login', login)
router.post('/school/login', login)

export default router;