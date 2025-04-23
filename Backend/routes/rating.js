import express from 'express'
import RatingController from '../controllers/ratingController.js';   

const router = express.Router();

router.post('/ratingLawyer', RatingController.createRating)

export default router;