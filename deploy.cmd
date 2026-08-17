@echo off
echo ========================================
echo  LearnIT Platform - Vercel Deployment
echo ========================================
echo.

echo Starting deployment to Vercel...
echo.

echo IMPORTANT: When prompted, answer:
echo   1. Set up and deploy? --> Y
echo   2. Which scope? --> suresh's projects
echo   3. Link to existing project? --> N
echo   4. Project name? --> learn-it-platform (or press Enter)
echo   5. Directory? --> Press Enter (use current)
echo   6. Override settings? --> N
echo.

pause

vercel --prod

echo.
echo ========================================
echo  Deployment Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Copy the Production URL from above
echo 2. Add Firebase environment variables in Vercel Dashboard
echo 3. Add the Vercel URL to Firebase Authorized Domains
echo.
echo For detailed instructions, see VERCEL_DEPLOYMENT_GUIDE.md
echo.
pause
