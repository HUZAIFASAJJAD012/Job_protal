import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js";
import adminModel from "../models/adminModel.js";
import {School} from "../models/schoolModel.js";
const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // First, check in adminModel to see if the user is an admin
        const existingAdmin = await adminModel.findOne({ email });

        if (existingAdmin) {
            // If admin is found, check if the password is valid
            const isPasswordValid = await bcrypt.compare(password, existingAdmin.password);

            if (!isPasswordValid) {
                return res.status(400).json({ message: "Invalid password" });
            }

            // Generate token for admin
            const token = generateToken(existingAdmin);

            return res.status(200).json({
                message: "Admin login successful",
                user: {
                    id: existingAdmin._id,
                    firstName: existingAdmin.firstName,
                    lastName: existingAdmin.lastName,
                    email: existingAdmin.email,
                    phone: existingAdmin.phone,
                    isAdmin: existingAdmin.isAdmin, // Admin flag
                },
                token: token
            });
        }

        // If not admin, check in userModel for regular user
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);

            if (!isPasswordValid) {
                return res.status(400).json({ message: "Invalid password" });
            }

            const token = generateToken(existingUser);

            return res.status(200).json({
                message: "User login successful",
                user: {
                    id: existingUser._id,
                    firstName: existingUser.firstName,
                    lastName: existingUser.lastName,
                    email: existingUser.email,
                    phone: existingUser.phone,
                    isUser: existingUser.isUser, // User flag
                },
                token: token
            });
        }

        // If not found in userModel, check if it's a school
        const existingSchool = await School.findOne({ email });

        if (existingSchool) {
            const isPasswordValid = await bcrypt.compare(password, existingSchool.password);

            if (!isPasswordValid) {
                return res.status(400).json({ message: "Invalid password" });
            }

            const token = generateToken(existingSchool);

            return res.status(200).json({
                message: "School login successful",
                user: {
                    id: existingSchool._id,
                    schoolName: existingSchool.schoolName,
                    firstName: existingSchool.firstName,
                    lastName: existingSchool.lastName,
                    email: existingSchool.email,
                    phone: existingSchool.phone,
                    country: existingSchool.country,
                    area: existingSchool.area,
                    role: existingSchool.role,
                    isHire: existingSchool.isHire
                },
                token: token
            });
        }

        // If no user is found, return an error
        return res.status(400).json({ message: "User not found" });

    } catch (error) {
        // Handle errors
        res.status(500).json({ message: error.message });
    }
};


// Example of a function to generate a JWT token

const generateToken = (user) => {
    // Replace with your own secret key and expiration time
    const secretKey = 'poiuytrewqlkjhgfdsamnbvcxz';
    const expirationTime = '1h'; // Token expires in 1 hour

    // Generate a token
    return jwt.sign(
        { userId: user._id, email: user.email },  // Payload
        secretKey,                               // Secret key
        { expiresIn: expirationTime }            // Options
    );
};

export {login}