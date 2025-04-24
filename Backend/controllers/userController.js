// import lawyerModel from "../models/lawyerModel.js";
import Payment from "../models/paymentModel.js";
import user from "../models/userModel.js";
import Profile from "../models/profileModel.js";
import JobApplied from "../models/appliedJob.js"
import createError from "../utils/error.js";
import bcrypt from 'bcrypt';

class UserController {

    import
    Profile
    from
    '../models/Profile.js';

    static register = async (req, res, next) => {
        try {
            const {
                firstName,
                lastName,
                email,
                phone,
                password,
                nationality,
                residentId,
                dateOfBirth,
                country,
                area,
                organization,
                backgroundChecks,
            } = req.body;

            // Check if email already exists in the database
            const existingUser = await user.findOne({email});
            if (existingUser) {
                return res.status(400).json({message: "Email already exists"});
            }

            // Hash the password using bcrypt
            const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

            // Create a new user with the hashed password
            const newUser = new user({
                firstName,
                lastName,
                email,
                phone,
                password: hashedPassword,
                nationality,
                residentId,
                dateOfBirth,
                country,
                area,
                organization,
                backgroundChecks,
                isUser: true,
            });

            // Save the user to the database
            const savedUser = await newUser.save();

            // Create a new profile associated with the user
            const newProfile = new Profile({
                user: savedUser._id, // Set user ID
                location: null,
                bio: null,
                skills: [],
                education: [],
                workHistory: [],
                availability: {availableDays: []},
                profilePicture: null,
            });

            // Save the profile to the database
            await newProfile.save();

            // Customize the user response
            const userResponse = {
                _id: savedUser._id,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,

            };


            // Respond with success message and the customized user data
            res.status(201).json({message: "User registered successfully", user: userResponse});
        } catch (error) {
            // Handle errors
            res.status(500).json({message: error.message});
        }
    };

    static getUserById = async (req, res, next) => {
        try {
            const {id} = req.params; // Extract user ID from request parameters

            // Find user by ID
            const userDoc = await user.findById(id);

            // Check if user exists
            if (!userDoc) {
                return res.status(404).json({message: "User not found"});
            }

            res.status(200).json(userDoc); // Return user details
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            next(createError(500, "Internal Server Error"));
        }
    };

    static updateUserById = async (req, res, next) => {
        try {
            const {id} = req.params; // Extract user ID from request parameters
            const updateData = req.body; // Extract update data from request body

            // If password is being updated, hash the new password
            if (updateData.password) {
                const hashedPassword = await bcrypt.hash(updateData.password, 10);
                updateData.password = hashedPassword;
            }

            // Find the user by ID and update
            const updatedUser = await user.findByIdAndUpdate(
                id,
                {$set: updateData}, // Use `$set` to update only provided fields
                {new: true} // Return the updated document
            );

            // Check if user exists
            if (!updatedUser) {
                return res.status(404).json({message: "User not found"});
            }

            res.status(200).json({
                message: "User updated successfully",
                user: updatedUser,
            });
        } catch (error) {
            console.error("Error updating user:", error);
            next(createError(500, "Internal Server Error"));
        }
    };

    static getProfile = async (req, res) => {
        try {
            const {id} = req.params;

            const profile = await Profile.findOne({user: id});
            if (!profile) {
                return res.status(404).json({message: "Profile not found"});
            }
            res.json(profile);
        } catch (error) {
            res.status(500).json({message: "Server error"});
        }
    };

    static updateProfile = async (req, res) => {
        try {
            const {id} = req.params;
            const {location, bio, skills, education, workHistory, availability} = req.body;

            // Find the profile by user ID
            const profile = await Profile.findOne({user: id});
            if (!profile) {
                return res.status(404).json({message: "Profile not found"});
            }

            // Update profile fields with a fallback to existing data
            Object.assign(profile, {
                location: location || profile.location,
                bio: bio || profile.bio,
                skills: skills ? JSON.parse(skills) : profile.skills,
                education: education ? JSON.parse(education) : profile.education,
                workHistory: workHistory ? JSON.parse(workHistory) : profile.workHistory,
                availability: availability ? JSON.parse(availability) : profile.availability,
            });

            // Handle profile picture upload
            if (req.file) {
                profile.profilePicture = `/uploads/${req.file.filename}`;
            }

            // Save the updated profile
            await profile.save();
            res.status(200).json({message: "Profile updated successfully", profile});
        } catch (error) {
            console.error("Error updating profile:", error);
            res.status(500).json({message: "An error occurred while updating the profile"});
        }
    };

    static getAllUsers = async (req, res, next) => {
        try {
            const result = await user.find()

            if (!result || result.length === 0) {
                return res.status(404).json({message: "Sorry, no lawyer is available."});
            }
            res.status(200).json(result);
        } catch (err) {
            console.error('Error in getAllLawyers:', err); // Log errors
            next(createError(500, 'Internal Server Error'));
        }
    };

    static getAllProfiles = async (req, res, next) => {
        try {
            const result = await Profile.find()

            if (!result || result.length === 0) {
                return res.status(404).json({message: "Sorry, no profiles is available."});
            }
            res.status(200).json(result);
        } catch (err) {
            console.error('Error in getAllProfiles:', err); // Log errors
            next(createError(500, 'Internal Server Error'));
        }
    };

    static deleteDocById = async (req, res, next) => {
        try {
            const result = await user.findByIdAndDelete(req.params.id);

            if (!result) {
                return res.status(404).json({message: "Document not found"});
            }

            res.status(200).json({message: "Document deleted successfully"});
        } catch (error) {
            next(error);
        }
    };

    static get_all_information = async (req, res) => {
        try {
            const users = await user.find();
            const attorneys = await lawyerModel.find();
            const transactions = await Payment.find();

            res.status(200).send({
                users: users.length > 0 ? users : 0,
                attorneys: attorneys.length > 0 ? attorneys : 0,
                transactions: transactions.length > 0 ? transactions : 0,
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).send({
                message: 'An error occurred while fetching data',
                error: error.message
            });
        }
    };

    static jobApplied = async (req, res) => {
        const {user_id, job_id} = req.body;

        try {
            // Check if user_id and job_id are provided
            if (!user_id || !job_id) {
                return res.status(400).json({error: 'User ID and Job ID are required'});
            }

            // Check if the user has already applied for this job
            const existingApplication = await JobApplied.findOne({user: user_id, job: job_id});

            if (existingApplication) {
                return res.status(400).json({error: 'You have already applied for this job'});
            }

            // Create a new job application if not already applied
            const jobApplied = new JobApplied({
                user: user_id,
                job: job_id
            });

            // Save the job application to the database
            await jobApplied.save();

            return res.status(201).json({message: 'Job application created successfully', jobApplied});
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    };



}

export default UserController;
