# Environment Setup Guide

This guide explains how to set up environment variables for both development and production environments.

## File Structure

```
├── backend/
│   ├── env.development    # Backend development environment
│   └── env.production     # Backend production environment
├── frontend/
│   ├── env.development    # Frontend development environment
│   └── env.production     # Frontend production environment
└── ENVIRONMENT_SETUP.md   # This file
```

## Backend Environment Setup

### Development Environment
Copy `backend/env.development` to `backend/.env` for local development:

```bash
cd backend
cp env.development .env
```

### Production Environment
For production deployment on Render, set these environment variables in your Render dashboard:

- `NODE_ENV`: production
- `PORT`: 5001
- `MONGODB_URI`: mongodb+srv://drinkdistrict:FkmZLsfje0IgINSu@cluster0.f3euenl.mongodb.net/sports_booking?retryWrites=true&w=majority&appName=Cluster0
- `JWT_SECRET`: [generate a secure random string]
- `JWT_EXPIRY`: 7d
- `FRONTEND_URL`: https://thedrinkdistrict-f.onrender.com
- `BCRYPT_ROUNDS`: 12
- `RATE_LIMIT_WINDOW_MS`: 900000
- `RATE_LIMIT_MAX_REQUESTS`: 100
- `MAX_FILE_SIZE`: 5mb
- `UPLOAD_PATH`: ./uploads
- `DEFAULT_ADMIN_USERNAME`: admin
- `DEFAULT_ADMIN_PASSWORD`: [change this]
- `DEFAULT_ADMIN_EMAIL`: admin@sportsBooking.com
- `DEBUG`: false
- `LOG_LEVEL`: error

## Frontend Environment Setup

### Development Environment
Copy `frontend/env.development` to `frontend/.env` for local development:

```bash
cd frontend
cp env.development .env
```

### Production Environment
For production deployment on Render, set these environment variables in your Render dashboard:

- `REACT_APP_ENVIRONMENT`: production
- `REACT_APP_API_URL`: https://thedrinkdistrict.onrender.com
- `REACT_APP_API_BASE_URL`: https://thedrinkdistrict.onrender.com/api
- `REACT_APP_NAME`: Sports Booking
- `REACT_APP_VERSION`: 1.0.0
- `REACT_APP_ENABLE_DEBUG`: false
- `REACT_APP_ENABLE_CONSOLE_LOGS`: false
- `REACT_APP_CACHE_DURATION`: 30000
- `REACT_APP_WALLET_CACHE_DURATION`: 30000
- `REACT_APP_ITEMS_PER_PAGE`: 10
- `REACT_APP_AUTO_LOGOUT_TIME`: 3600000
- `GENERATE_SOURCEMAP`: false
- `REACT_APP_DEV_MODE`: false

## Important Security Notes

1. **JWT Secret**: Change the JWT secret in production to a secure random string
2. **Admin Password**: Change the default admin password in production
3. **Database URI**: Consider using environment-specific database URIs
4. **CORS**: The backend is configured to allow requests from the production frontend URL

## Deployment URLs

- **Frontend**: https://thedrinkdistrict-f.onrender.com
- **Backend**: https://thedrinkdistrict.onrender.com

## Scripts for Easy Setup

### Development Setup
```bash
# Backend
cd backend && cp env.development .env

# Frontend
cd frontend && cp env.development .env
```

### Production Setup
```bash
# Backend
cd backend && cp env.production .env

# Frontend
cd frontend && cp env.production .env
```

## Environment Variables Reference

### Backend Variables
| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `NODE_ENV` | Environment mode | development | production |
| `PORT` | Server port | 5001 | 5001 |
| `MONGODB_URI` | Database connection string | [dev URI] | [prod URI] |
| `JWT_SECRET` | JWT signing secret | dev-secret | [secure random] |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 | https://thedrinkdistrict-f.onrender.com |
| `BCRYPT_ROUNDS` | Password hashing rounds | 10 | 12 |
| `DEBUG` | Enable debug mode | true | false |

### Frontend Variables
| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `REACT_APP_API_URL` | Backend API URL | http://localhost:5001 | https://thedrinkdistrict.onrender.com |
| `REACT_APP_ENVIRONMENT` | Environment mode | development | production |
| `REACT_APP_ENABLE_DEBUG` | Enable debug features | true | false |
| `REACT_APP_CACHE_DURATION` | Cache duration (ms) | 15000 | 30000 |
| `GENERATE_SOURCEMAP` | Generate source maps | true | false |

## Troubleshooting

1. **Environment not loading**: Make sure the `.env` file is in the correct directory
2. **CORS errors**: Check that `FRONTEND_URL` is correctly set in backend environment
3. **API connection issues**: Verify `REACT_APP_API_URL` is correct in frontend environment
4. **Build errors**: Ensure all required environment variables are set for production builds
