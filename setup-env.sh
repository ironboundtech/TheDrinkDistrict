#!/bin/bash

# Environment Setup Script
# This script helps you set up environment variables for development or production

echo "Sports Booking Environment Setup"
echo "================================="
echo ""

# Check if environment argument is provided
if [ $# -eq 0 ]; then
    echo "Usage: ./setup-env.sh [development|production]"
    echo ""
    echo "Examples:"
    echo "  ./setup-env.sh development  # Set up development environment"
    echo "  ./setup-env.sh production    # Set up production environment"
    exit 1
fi

ENVIRONMENT=$1

if [ "$ENVIRONMENT" != "development" ] && [ "$ENVIRONMENT" != "production" ]; then
    echo "Error: Environment must be 'development' or 'production'"
    exit 1
fi

echo "Setting up $ENVIRONMENT environment..."
echo ""

# Backend setup
echo "Setting up backend environment..."
if [ -f "backend/env.$ENVIRONMENT" ]; then
    cp "backend/env.$ENVIRONMENT" "backend/.env"
    echo "✓ Backend environment file created: backend/.env"
else
    echo "✗ Backend environment file not found: backend/env.$ENVIRONMENT"
fi

# Frontend setup
echo "Setting up frontend environment..."
if [ -f "frontend/env.$ENVIRONMENT" ]; then
    cp "frontend/env.$ENVIRONMENT" "frontend/.env"
    echo "✓ Frontend environment file created: frontend/.env"
else
    echo "✗ Frontend environment file not found: frontend/env.$ENVIRONMENT"
fi

echo ""
echo "Environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Review the .env files to ensure they contain the correct values"
echo "2. For production deployment, set environment variables in your hosting platform"
echo "3. Start your development server:"
echo "   - Backend: cd backend && npm run dev"
echo "   - Frontend: cd frontend && npm start"
echo ""
echo "For more information, see ENVIRONMENT_SETUP.md"
