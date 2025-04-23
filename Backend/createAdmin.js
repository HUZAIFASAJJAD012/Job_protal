import dotenv from 'dotenv';
dotenv.config(); // Load the environment variables

import mongoose from 'mongoose';
import adminModel from './models/adminModel.js'; // Import the new admin model
import readline from 'readline'; // Import the readline module to take user input

// Setup readline interface to get user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Database connection setup
mongoose.connect(process.env.db2, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to the database');
    createAdmin();
  })
  .catch((err) => {
    console.error('Error connecting to the database', err);
  });

// Function to create an admin user
const createAdmin = async () => {
  try {
    const existingAdmin = await adminModel.findOne({ isAdmin: true });

    if (existingAdmin) {
      console.log('Admin account already exists');
      return;
    }

    // Prompt the user for email and password
    rl.question('Enter admin email: ', async (email) => {
      rl.question('Enter admin password: ', async (password) => {
        // Create the admin user
        const admin = new adminModel({
          firstName: 'Admin',
          lastName: 'User',
          email: email,  // User provided email
          phone: '1234567890',
          password: password,  // User provided password (hashed later)
        });

        try {
          await admin.save();
          console.log('Admin account created successfully');
        } catch (error) {
          console.error('Error creating admin account:', error);
        } finally {
          mongoose.connection.close(); // Close the connection
          rl.close();  // Close the readline interface
        }
      });
    });
  } catch (error) {
    console.error('Error creating admin account:', error);
    rl.close();  // Close the readline interface in case of error
  }
};
