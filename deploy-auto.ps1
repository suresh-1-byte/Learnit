# LearnIT Platform - Automated Vercel Deployment Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " LearnIT Platform - Vercel Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Setting environment variables..." -ForegroundColor Yellow

# Set environment variables for the build
$env:VITE_FIREBASE_API_KEY="AIzaSyA_glJsKdS9-cmnW80xFsg18rr5ZUXEgrk"
$env:VITE_FIREBASE_AUTH_DOMAIN="learnit-c7e54.firebaseapp.com"
$env:VITE_FIREBASE_PROJECT_ID="learnit-c7e54"
$env:VITE_FIREBASE_STORAGE_BUCKET="learnit-c7e54.firebasestorage.app"
$env:VITE_FIREBASE_MESSAGING_SENDER_ID="403881372691"
$env:VITE_FIREBASE_APP_ID="1:403881372691:web:3000246beb0da8a545e3e6"

Write-Host "Environment variables set!" -ForegroundColor Green
Write-Host ""

Write-Host "Building project locally..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
    Write-Host "This will open interactive prompts. Please answer:" -ForegroundColor Cyan
    Write-Host "  1. Set up and deploy? -> Y" -ForegroundColor White
    Write-Host "  2. Which scope? -> suresh's projects" -ForegroundColor White
    Write-Host "  3. Link to existing? -> Y (if asked)" -ForegroundColor White
    Write-Host "  4. Project? -> learn-it-platform" -ForegroundColor White
    Write-Host ""
    
    pause
    
    vercel --prod
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " Deployment Process Complete!" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "IMPORTANT NEXT STEPS:" -ForegroundColor Red
    Write-Host "1. Copy your Production URL from above" -ForegroundColor Yellow
    Write-Host "2. Go to Firebase Console:" -ForegroundColor Yellow
    Write-Host "   https://console.firebase.google.com/project/learnit-c7e54/authentication/settings" -ForegroundColor White
    Write-Host "3. Add your Vercel URL to 'Authorized domains'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "4. Go to Vercel Dashboard and add environment variables:" -ForegroundColor Yellow
    Write-Host "   https://vercel.com/sureshs-projects-1c6ee3cb/learn-it-platform/settings/environment-variables" -ForegroundColor White
    Write-Host ""
    Write-Host "   Add these 6 variables:" -ForegroundColor White
    Write-Host "   - VITE_FIREBASE_API_KEY" -ForegroundColor Cyan
    Write-Host "   - VITE_FIREBASE_AUTH_DOMAIN" -ForegroundColor Cyan
    Write-Host "   - VITE_FIREBASE_PROJECT_ID" -ForegroundColor Cyan
    Write-Host "   - VITE_FIREBASE_STORAGE_BUCKET" -ForegroundColor Cyan
    Write-Host "   - VITE_FIREBASE_MESSAGING_SENDER_ID" -ForegroundColor Cyan
    Write-Host "   - VITE_FIREBASE_APP_ID" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "5. After adding variables, redeploy with: vercel --prod" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "Build failed! Please check the errors above." -ForegroundColor Red
}

pause
