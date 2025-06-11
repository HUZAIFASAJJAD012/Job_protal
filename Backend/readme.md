# Job Portal Backend

A comprehensive job portal backend built with Node.js, Express, MongoDB, and Stripe for payment processing.

## Features

- User and School registration/authentication
- Job posting and application management
- Real-time chat with Socket.IO
- Payment processing with Stripe
- File upload handling
- Email notifications
- Admin dashboard

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Stripe account
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Job Portal/Backend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Database
   db2=mongodb://localhost:27017/jobportal
   # OR for MongoDB Atlas:
   # db2=mongodb+srv://username:password@cluster.mongodb.net/jobportal

   # Server
   PORT=8000

   # Frontend URLs (comma separated for multiple environments)
   FRONTEND_URL=http://localhost:3000,http://127.0.0.1:3000

   # Stripe Configuration
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

   # JWT (if used)
   JWT_SECRET=your_jwt_secret_here

   # Email Configuration (if using email notifications)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

## Database Setup

1. **Start MongoDB**
   ```bash
   # For local MongoDB
   mongod

   # OR use MongoDB Atlas cloud service
   ```

2. **Create Admin User**
   ```bash
   node createAdmin.js
   ```
   Follow the prompts to create an admin account.

## Stripe Configuration

### Option 1: Local Development with Stripe CLI

1. **Install Stripe CLI**
   ```bash
   # Download from https://stripe.com/docs/stripe-cli
   ```

2. **Login to Stripe**
   ```bash
   stripe login
   ```

3. **Forward webhook events to local server**
   ```bash
   stripe listen --forward-to localhost:8000/api/payment/webhook
   ```
   
   This will provide you with a webhook secret starting with `whsec_`. Add this to your `.env` file as `STRIPE_WEBHOOK_SECRET`.

### Option 2: Production/Live Environment

1. **Create Webhook Endpoint in Stripe Dashboard**
   - Go to https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"
   - Enter your endpoint URL: `https://yourdomain.com/api/payment/webhook`
   - Select events: `checkout.session.completed`
   - Copy the webhook secret and add to your `.env` file

2. **Required Stripe Events**
   - `checkout.session.completed` - For handling successful payments

## Running the Application

1. **Development Mode**
   ```bash
   npm run dev
   # OR
   node app.js
   ```

2. **Production Mode**
   ```bash
   npm start
   ```

The server will start on `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /auth/login` - User/School login
- `POST /auth/school/login` - School login

### User Routes
- `POST /user/register` - User registration
- `GET /user/get_all_users` - Get all users
- `GET /user/get_user_profile` - Get user profiles
- `PUT /user/update/:id` - Update user profile

### School Routes
- `POST /school/register` - School registration
- `POST /school/add/job` - Add new job
- `GET /school/get/job` - Get all jobs
- `GET /school/job/:id` - Get job by ID
- `PUT /school/job/:id` - Update job
- `DELETE /school/delete/:id` - Delete job
- `GET /school/get/applied-candidate` - Get applied candidates
- `PUT /school/select-candidate/:jobId/:userId` - Select candidate

### Payment Routes
- `POST /api/payment/create-checkout-session` - Create Stripe checkout for school registration
- `POST /api/payment/job-application` - Create payment session for job application
- `POST /api/payment/create-renewal-session` - Create subscription renewal session
- `GET /api/payment/subscription/:schoolId` - Get subscription status
- `POST /api/payment/webhook` - Stripe webhook handler

### Chat Routes
- `GET /conversations/:userId` - Get user conversations
- `POST /messages` - Send message
- `GET /messages/:chatId` - Get chat messages

## File Structure

```
Backend/
├── controllers/          # Request handlers
├── models/              # Database models
├── routes/              # API routes
├── utils/               # Utility functions
├── uploads/             # File uploads directory
├── middleware/          # Custom middleware
├── app.js              # Main application file
├── createAdmin.js      # Admin creation script
└── package.json        # Dependencies
```

## Key Models

- **User** - Job seekers/applicants
- **School** - Educational institutions posting jobs
- **Job** - Job postings
- **JobApplied** - Job applications
- **Payment** - Payment records
- **Chat/Message** - Real-time messaging
- **Admin** - Admin users

## Socket.IO Events

- `connection` - User connects
- `join` - User joins room
- `send_message` - Send chat message
- `receive_message` - Receive chat message
- `message_read` - Mark message as read
- `disconnect` - User disconnects

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```bash
   # Check if MongoDB is running
   sudo systemctl status mongod
   # Start MongoDB
   sudo systemctl start mongod
   ```

2. **Stripe Webhook Issues**
   ```bash
   # Test webhook locally
   stripe listen --forward-to localhost:8000/api/payment/webhook
   
   # Verify webhook secret in .env file
   echo $STRIPE_WEBHOOK_SECRET
   ```

3. **Port Already in Use**
   ```bash
   # Kill process on port 8000
   lsof -ti:8000 | xargs kill -9
   ```

4. **CORS Issues**
   - Ensure FRONTEND_URL in .env matches your frontend URL exactly
   - Check that credentials are included in requests

### Testing Payments

1. **Test Card Numbers**
   - Success: `4242424242424242`
   - Decline: `4000000000000002`
   - Insufficient funds: `4000000000009995`

## Deployment

### Environment Variables for Production
```env
NODE_ENV=production
db2=mongodb+srv://username:password@cluster.mongodb.net/jobportal
FRONTEND_URL=https://yourdomain.com
STRIPE_SECRET_KEY=sk_live_your_live_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
```

### Heroku Deployment
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set db2=your_mongodb_uri
heroku config:set STRIPE_SECRET_KEY=your_stripe_key

# Deploy
git push heroku main
```

## Security Notes

- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- Implement rate limiting for production
- Use HTTPS in production
- Validate all user inputs
- Sanitize data before database operations

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Stripe documentation
3. Check MongoDB connection
4. Verify environment variables