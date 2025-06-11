# Job Portal Frontend

A modern React-based job portal frontend with real-time chat, payment integration, and responsive design.

## Features

- User and School dashboards
- Job search and application system
- Real-time chat with Socket.IO
- Stripe payment integration
- Responsive design with Tailwind CSS
- File upload capabilities
- Admin panel

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Job Portal/Frontend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   # OR
   yarn install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   # API Configuration
   REACT_APP_API_URL=http://localhost:8000
   
   # Stripe (Public Key)
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   
   # Socket.IO
   REACT_APP_SOCKET_URL=http://localhost:8000
   
   # App Configuration
   REACT_APP_NAME="Job Portal"
   REACT_APP_VERSION=1.0.0
   
   # For production
   # REACT_APP_API_URL=https://your-backend-domain.com
   # REACT_APP_SOCKET_URL=https://your-backend-domain.com
   ```

## Running the Application

1. **Development Mode**
   ```bash
   npm start
   # OR
   yarn start
   ```
   
   Opens the app at `http://localhost:3000`

2. **Production Build**
   ```bash
   npm run build
   # OR
   yarn build
   ```

3. **Test Build Locally**
   ```bash
   npm install -g serve
   serve -s build -l 3000
   ```

## Project Structure

```
Frontend/
├── public/                 # Static files
│   ├── index.html         # Main HTML template
│   └── logo.jpg           # App logo
├── src/
│   ├── components/        # Reusable components
│   │   └── ui/           # UI components
│   ├── Pages/            # Page components
│   │   ├── admin/        # Admin pages
│   │   ├── school/       # School pages
│   │   ├── users/        # User pages
│   │   └── include/      # Shared components
│   ├── Utils/            # Utility functions
│   │   ├── Store.js      # Global state management
│   │   ├── Axios.jsx     # API configuration
│   │   └── APIRoutes.js  # API endpoints
│   ├── Security/         # Route protection
│   ├── Errors/           # Error pages
│   ├── App.js           # Main app component
│   └── index.js         # App entry point
├── package.json         # Dependencies
└── README.md           # This file
```

## Key Dependencies

- **React 18** - Frontend framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Lucide React** - Icons

## Environment Configuration

### Development Environment
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_SOCKET_URL=http://localhost:8000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key
```

### Production Environment
```env
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_SOCKET_URL=https://your-backend-domain.com
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
```

## Key Features Setup

### 1. Authentication System
- JWT token management
- Role-based routing (User/School/Admin)
- Protected routes
- Automatic logout on token expiry

### 2. Payment Integration
- Stripe checkout integration
- Job application payments
- School subscription management
- Payment history tracking

### 3. Real-time Chat
- Socket.IO integration
- Private messaging
- Message status indicators
- Online/offline status

### 4. File Upload
- Profile picture uploads
- Job image uploads
- File validation and preview

## API Integration

The frontend communicates with the backend through:

### Base Configuration (Utils/Axios.jsx)
```javascript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000,
  withCredentials: true,
});
```

### Key API Endpoints
- Authentication: `/auth/login`
- User management: `/user/*`
- School management: `/school/*`
- Payment processing: `/api/payment/*`
- Chat: `/messages/*`, `/conversations/*`

## State Management

Global state is managed using React Context (Utils/Store.js):

```javascript
// Available actions
- SetUserInfo - Store user data
- ClearUserInfo - Clear user data on logout
```

## Routing Structure

### Public Routes
- `/` - Home page
- `/login-choice` - Login selection
- `/login` - Login form
- `/user-registration` - User registration
- `/school-registration` - School registration

### Protected Routes
- **User Routes** (`/user/*`)
  - Job listings, applications, profile, chat
- **School Routes** (`/school/*`)
  - Dashboard, job management, applicant management
- **Admin Routes** (`/admin/*`)
  - User management, system overview

## Styling

### Tailwind CSS Configuration
- Custom colors for brand consistency
- Responsive breakpoints
- Component-based styling
- Dark mode support (if needed)

### Custom Components
Located in `src/components/ui/`:
- Button, Card, Avatar, Input
- Form components
- Modal, Dialog components

## Testing

### Running Tests
```bash
npm test
# OR
yarn test
```

### Testing Strategy
- Component unit tests
- Integration tests for user flows
- E2E tests for critical paths

## Deployment

### Netlify Deployment
```bash
# Build the project
npm run build

# Deploy to Netlify
# Drag and drop the build folder to Netlify
# OR use Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Custom Server Deployment
```bash
# Build the project
npm run build

# Serve with any static file server
# Example with Apache/Nginx
cp -r build/* /var/www/html/
```

## Environment Variables for Production

```env
# Production API endpoints
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_SOCKET_URL=https://api.yourdomain.com

# Production Stripe key
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key

# Additional production settings
GENERATE_SOURCEMAP=false
REACT_APP_NODE_ENV=production
```

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   ```bash
   # Check if backend is running
   curl http://localhost:8000/api/health
   
   # Verify REACT_APP_API_URL in .env
   echo $REACT_APP_API_URL
   ```

2. **CORS Errors**
   - Ensure backend FRONTEND_URL includes your frontend URL
   - Check withCredentials setting in axios config

3. **Socket.IO Connection Issues**
   ```javascript
   // Check browser console for socket errors
   // Verify REACT_APP_SOCKET_URL matches backend
   ```

4. **Payment Issues**
   ```bash
   # Verify Stripe keys
   echo $REACT_APP_STRIPE_PUBLISHABLE_KEY
   
   # Check Stripe console for webhook events
   ```

5. **Build Failures**
   ```bash
   # Clear cache
   npm start -- --reset-cache
   
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Performance Optimization

1. **Code Splitting**
   ```javascript
   // Use React.lazy for route-based splitting
   const UserDashboard = React.lazy(() => import('./Pages/users/Dashboard'));
   ```

2. **Image Optimization**
   - Compress images before upload
   - Use appropriate image formats (WebP, AVIF)
   - Implement lazy loading

3. **Bundle Analysis**
   ```bash
   npm install -g webpack-bundle-analyzer
   npm run build
   npx webpack-bundle-analyzer build/static/js/*.js
   ```

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use different keys for development/production
   - Validate API responses

2. **Input Validation**
   - Sanitize user inputs
   - Validate file uploads
   - Implement rate limiting on forms

3. **Authentication**
   - Store tokens securely
   - Implement auto-logout
   - Validate user permissions

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For development issues:
1. Check browser console for errors
2. Verify environment variables
3. Check network tab for API calls
4. Review backend logs
5. Test with different browsers

## Additional Resources

- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Socket.IO Client Documentation](https://socket.io/docs/v4/client-api)
- [Stripe React Integration](https://stripe.com/docs/stripe-js/react)