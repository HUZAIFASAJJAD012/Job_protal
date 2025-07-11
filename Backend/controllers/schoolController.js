import { School } from "../models/schoolModel.js";
import Job from "../models/jobModel.js";
import JobApplied from "../models/appliedJob.js";
import createError from "../utils/error.js";

class schoolController {
  static register = async (req, res) => {
    const {
      schoolName,
      country,
      area,
      email,
      phone,
      firstName,
      lastName,
      role,
      password,
    } = req.body;

    try {
      // Check if school with this email already exists
      const existingSchool = await School.findOne({ email });
      if (existingSchool) {
        return res
          .status(400)
          .json({ error: "School with this email already exists." });
      }

      // Create a new school
      const newSchool = new School({
        schoolName,
        country,
        area,
        email,
        phone,
        firstName,
        lastName,
        role,
        password,
      });
      await newSchool.save();

      res
        .status(201)
        .json({
          message: "School registered successfully!",
          school: newSchool,
        });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

  static addJob = async (req, res) => {
    const {
      title,
      schoolId,
      coverFrom,
      coverTo,
      payPerDay,
      payPerHour,
      currency,
      timeStart,
      timeEnd,
      paymentMethod,
      qualifications,
      backgroundChecks,
      jobDurationDays,
      jobDurationType,
      description,
    } = req.body;

    try {
      // Check if the school exists
      const school = await School.findById(schoolId);
      if (!school) {
        return res.status(404).json({ error: "School not found." });
      }
      const schoolName = school.schoolName;
      const location = school.area;

      // Handle the job image
      let jobImage = null;
      if (req.file) {
        jobImage = `/uploads/${req.file.filename}`;
      }

      // Create a new job
      const newJob = new Job({
        title,
        schoolName,
        schoolId,
        coverFrom,
        coverTo,
        payPerDay,
        payPerHour,
        currency,
        timeStart,
        timeEnd,
        paymentMethod,
        location,
        qualifications,
        backgroundChecks,
        jobDurationDays,
        jobDurationType,
        description,
        jobImage, // Add the image path to the job document
      });

      await newJob.save();

      res.status(201).json({ message: "Job added successfully!", job: newJob });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  };
  static getJobById = async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ message: "Job not found" });
      res.status(200).json(job);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };

  static updateJob = async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ message: "Job not found" });
      console.log("Updating job :", job);

      const updateData = { ...req.body };
      if (req.file) {
        updateData.jobImage = `/uploads/${req.file.filename}`;
      }

      if (
        updateData.qualifications &&
        typeof updateData.qualifications === "string"
      ) {
        updateData.qualifications = JSON.parse(updateData.qualifications);
      }

      if (
        updateData.backgroundChecks &&
        typeof updateData.backgroundChecks === "string"
      ) {
        updateData.backgroundChecks = JSON.parse(updateData.backgroundChecks);
      }

      Object.assign(job, updateData);
      await job.save();

      res.status(200).json({ message: "Job updated successfully!", job });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
  static update = async (req, res) => {
    const {
      schoolName,
      country,
      area,
      email,
      phone,
      firstName,
      lastName,
      role,
      password,
    } = req.body;
    const schoolId = req.params.id;    
    try {
      const school = await School.findById(schoolId);
      if (!school) {
        return res.status(404).json({ error: "School not found." });
      }

      school.schoolName = schoolName || school.schoolName;
      school.country = country || school.country;
      school.area = area || school.area;
      school.email = email || school.email;
      school.phone = phone || school.phone;
      school.firstName = firstName || school.firstName;
      school.lastName = lastName || school.lastName;
      school.role = role || school.role;
      if (password) {
        // If password is provided, hash and update it
        const salt = await bcrypt.genSalt(10);
        school.password = await bcrypt.hash(password, salt);
      }

      await school.save();
      res.status(200).json({
        message: "School updated successfully!",
        user: {
          id: school._id,
          schoolName: school.schoolName,
          firstName: school.firstName,
          lastName: school.lastName,
          email: school.email,
          phone: school.phone,
          country: school.country,
          area: school.area,
          role: school.role,
          isHire: school.isHire,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

  static getJob = async (req, res) => {
    try {
      const jobs = await Job.find({}); // Replace `Job` with your Mongoose model name

      if (!jobs || jobs.length === 0) {
        return res.status(404).json({ message: "No jobs found" });
      }

      res.status(200).json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  };

  static getAllSchool = async (req, res, next) => {
    try {
      const result = await School.find();

      if (!result || result.length === 0) {
        return res
          .status(404)
          .json({ message: "Sorry, no school is available." });
      }
      res.status(200).json(result);
    } catch (err) {
      console.error("Error in getAllSchool:", err); // Log errors
      next(createError(500, "Internal Server Error"));
    }
  };
  static deleteDocById = async (req, res, next) => {
    console.log("DELETE request received for ID:", req.params.id);
    try {
      const result = await Job.findByIdAndDelete(req.params.id); // use your correct model
      if (!result) return res.status(404).json({ message: "Not found" });
      res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
  static deletescById = async (req, res, next) => {
    console.log("DELETE request received for ID:", req.params.id);
    try {
      const result = await School.findByIdAndDelete(req.params.id); // use your correct model
      if (!result) return res.status(404).json({ message: "Not found" });
      res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      next(error);
    }
  };

  static getappliedcandidate = async (req, res) => {
    try {
      const jobs = await JobApplied.find({});

      if (!jobs || jobs.length === 0) {
        return res.status(404).json({ message: "No applied candidate found" });
      }
      res.status(200).json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  };

  static removeApplication = async (req, res) => {
    try {
      const { jobId, userId } = req.params;
      
      // Remove the application from the database
      const result = await JobApplied.findOneAndDelete({ 
        job: jobId, 
        user: userId 
      });

      if (!result) {
        return res.status(404).json({ message: "Application not found" });
      }

      res.status(200).json({ 
        message: "Application removed successfully",
        removedApplication: result 
      });
    } catch (error) {
      console.error("Error removing application:", error);
      res.status(500).json({ 
        message: "Internal server error", 
        error: error.message 
      });
    }
  };

  static selectCandidate = async (req, res) => {
    try {
      const { jobId, userId } = req.params;
      
      // Update the application status to 'selected'
      const result = await JobApplied.findOneAndUpdate(
        { job: jobId, user: userId },
        { 
          status: 'selected',
          selectedAt: new Date()
        },
        { new: true }
      );

      if (!result) {
        return res.status(404).json({ message: "Application not found" });
      }

      res.status(200).json({ 
        message: "Candidate selected successfully",
        application: result 
      });
    } catch (error) {
      console.error("Error selecting candidate:", error);
      res.status(500).json({ 
        message: "Internal server error", 
        error: error.message 
      });
    }
  };
}

export default schoolController;
