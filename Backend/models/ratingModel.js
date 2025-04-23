import mongoose from "mongoose";
import { type } from "os";

const { Schema } = mongoose;

const ratingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lawyerId: {
    type: Schema.Types.ObjectId,
    ref: "Lawyer",
    required: true,
  },
  reting: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comments: {
    type: String,
    required: false,
  }
  
},
{
    timestamps: true
  }
);

const Rating= mongoose.model('Rating', ratingSchema);
export default Rating;