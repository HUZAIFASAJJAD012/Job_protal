import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {type: String, required: true},
    schoolName: {type: String, required: true},
    schoolId: {type: mongoose.Schema.Types.ObjectId, ref: "School", required: true},
    coverFrom: {type: Date, required: true},
    coverTo: {type: Date, required: true},
    payPerDay: {type: Number, required: false},
    payPerHour: {type: Number, required: false},
    currency: {type: String, default: "USD"},
    timeStart: {type: String, required: false},
    timeEnd: {type: String, required: false},
    paymentMethod: {type: String, required: false},
    location: {type: String, required: false},
    qualifications: {type: [String], required: false},
    backgroundChecks: {type: [String], required: false},
    jobDurationDays: {type: Number, required: false},
    jobDurationType: {type: String, required: false},
    description: {type: String, required: false},
    createdAt: {type: Date, default: Date.now},
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
