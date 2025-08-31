@echo off
REM Environment Setup Script for Windows
REM This script helps you set up environment variables for development or production

echo Sports Booking Environment Setup
echo =================================
echo.

REM Check if environment argument is provided
if "%1"=="" (
    echo Usage: setup-env.bat [development^|production]
    echo.
    echo Examples:
    echo   setup-env.bat development  # Set up development environment
    echo   setup-env.bat production    # Set up production environment
    pause
    exit /b 1
)

set ENVIRONMENT=%1

if not "%ENVIRONMENT%"=="development" if not "%ENVIRONMENT%"=="production" (
    echo Error: Environment must be 'development' or 'production'
    pause
    exit /b 1
)

echo Setting up %ENVIRONMENT% environment...
echo.

REM Backend setup
echo Setting up backend environment...
if exist "backend\env.%ENVIRONMENT%" (
    copy "backend\env.%ENVIRONMENT%" "backend\.env" >nul
    echo ✓ Backend environment file created: backend\.env
) else (
    echo ✗ Backend environment file not found: backend\env.%ENVIRONMENT%
)

REM Frontend setup
echo Setting up frontend environment...
if exist "frontend\env.%ENVIRONMENT%" (
    copy "frontend\env.%ENVIRONMENT%" "frontend\.env" >nul
    echo ✓ Frontend environment file created: frontend\.env
) else (
    echo ✗ Frontend environment file not found: frontend\env.%ENVIRONMENT%
)

echo.
echo Environment setup complete!
echo.
echo Next steps:
echo 1. Review the .env files to ensure they contain the correct values
echo 2. For production deployment, set environment variables in your hosting platform
echo 3. Start your development server:
echo    - Backend: cd backend ^&^& npm run dev
echo    - Frontend: cd frontend ^&^& npm start
echo.
echo For more information, see ENVIRONMENT_SETUP.md
pause
