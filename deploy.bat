@echo off
setlocal enabledelayedexpansion

REM MTG Card Finder - Deployment Script (Windows)
REM This script automates the deployment process to Cloudflare Pages

echo 🚀 MTG Card Finder - Deployment Script
echo ======================================

REM Check if wrangler is installed
echo [INFO] Checking Wrangler CLI installation...
wrangler --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Wrangler CLI is not installed. Please install it first:
    echo npm install -g wrangler
    pause
    exit /b 1
)
echo [SUCCESS] Wrangler CLI is installed

REM Check if user is authenticated
echo [INFO] Checking Cloudflare authentication...
wrangler whoami >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Not authenticated with Cloudflare. Please run:
    echo wrangler login
    pause
    exit /b 1
)
echo [SUCCESS] Authenticated with Cloudflare

REM Install dependencies
echo [INFO] Installing dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Dependencies installed

REM Build the project
echo [INFO] Building the project...
call npm run build
if errorlevel 1 (
    echo [ERROR] Failed to build project
    pause
    exit /b 1
)
echo [SUCCESS] Project built successfully

REM Check command line argument
if "%1"=="staging" (
    echo [INFO] Deploying to staging environment...
    call npm run deploy:staging
    if errorlevel 1 (
        echo [ERROR] Failed to deploy to staging
        pause
        exit /b 1
    )
    echo [SUCCESS] Deployed to staging successfully
) else if "%1"=="production" (
    echo [INFO] Deploying to production environment...
    call npm run deploy
    if errorlevel 1 (
        echo [ERROR] Failed to deploy to production
        pause
        exit /b 1
    )
    echo [SUCCESS] Deployed to production successfully
) else if "%1"=="test" (
    echo [INFO] Testing locally with Wrangler...
    echo Starting local server... Press Ctrl+C to stop
    call npm run preview
    pause
    exit /b 0
) else if "%1"=="build" (
    echo [SUCCESS] Build completed
    pause
    exit /b 0
) else if "%1"=="install" (
    echo [SUCCESS] Dependencies installed
    pause
    exit /b 0
) else (
    echo Usage: deploy.bat [COMMAND]
    echo.
    echo Commands:
    echo   staging     Deploy to staging environment
    echo   production  Deploy to production environment
    echo   test        Test locally with Wrangler
    echo   build       Build the project only
    echo   install     Install dependencies only
    echo.
    echo Examples:
    echo   deploy.bat staging     # Deploy to staging
    echo   deploy.bat production  # Deploy to production
    echo   deploy.bat test        # Test locally
    pause
    exit /b 1
)

REM Show deployment URLs
echo.
echo [INFO] Deployment URLs:
echo Production: https://mtg-card-forge.pages.dev
echo Staging: https://mtg-card-forge-staging.pages.dev
echo.
pause 