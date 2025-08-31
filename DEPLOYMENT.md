# Sports Booking App - Deployment Guide

## 📁 Project Structure

```
SportsBooking/
├── backend/          # Node.js Express API
├── frontend/         # React Application
└── README.md        # This file
```

## 🚀 Deployment Setup

### Backend Deployment

1. **Environment Variables**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your production values
   ```

2. **Required Environment Variables:**
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Secure JWT secret key
   - `FRONTEND_URL` - Your frontend domain
   - `NODE_ENV=production`

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Start Production Server:**
   ```bash
   npm start
   ```

### Frontend Deployment

1. **Environment Variables**
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env with your production values
   ```

2. **Required Environment Variables:**
   - `REACT_APP_API_URL` - Your backend API URL
   - `REACT_APP_ENVIRONMENT=production`

3. **Build for Production:**
   ```bash
   npm install
   npm run build
   ```

4. **Deploy the `build/` folder to your hosting service**

## 🔧 Production Configuration

### Backend (.env)
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-super-secure-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
PORT=5001
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_ENVIRONMENT=production
REACT_APP_ENABLE_DEBUG=false
REACT_APP_ENABLE_CONSOLE_LOGS=false
```

## 📦 Deployment Platforms

### Backend Options:
- **Heroku**: Easy deployment with Git
- **Railway**: Modern hosting platform
- **DigitalOcean App Platform**: Scalable hosting
- **AWS EC2**: Full control VPS

### Frontend Options:
- **Netlify**: Easy static site hosting
- **Vercel**: Optimized for React apps
- **AWS S3 + CloudFront**: AWS ecosystem
- **GitHub Pages**: Free hosting for open source

### Database:
- **MongoDB Atlas**: Cloud MongoDB service (recommended)
- **Self-hosted MongoDB**: On your VPS

## 🔐 Security Checklist

- [ ] Change default admin credentials
- [ ] Use strong JWT secret in production
- [ ] Enable HTTPS on both frontend and backend
- [ ] Set up proper CORS configuration
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting in production
- [ ] Regular database backups

## 🌐 Domain Setup

1. Point your domain to your hosting service
2. Update `FRONTEND_URL` in backend .env
3. Update `REACT_APP_API_URL` in frontend .env
4. Configure SSL certificates
5. Test all functionality after deployment

## 📝 Post-Deployment

1. Create admin user:
   ```bash
   cd backend
   npm run create-admin
   ```

2. Test all features:
   - User registration/login
   - Court booking
   - Product purchases
   - Admin panel access

## 🐛 Troubleshooting

- Check environment variables are set correctly
- Verify CORS configuration allows your frontend domain
- Ensure MongoDB connection is working
- Check server logs for errors
- Test API endpoints manually

## 📞 Support

For deployment issues, check:
1. Server logs
2. Browser console errors
3. Network tab in browser dev tools
4. Environment variable configuration
