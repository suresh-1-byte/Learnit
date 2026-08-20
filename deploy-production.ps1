# Production Deployment Script for ZentrixLearnit.in
# Deploys Assignments Feature Integration to Live Website

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🚀 ZENTRIXLEARNIT.IN DEPLOYMENT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Deploying Assignments Feature (100% Complete)" -ForegroundColor White
Write-Host ""

# Step 1: Check Node and npm
Write-Host "📋 Step 1/5: Checking environment..." -ForegroundColor Yellow
node --version
npm --version
Write-Host "✅ Environment check complete" -ForegroundColor Green
Write-Host ""

# Step 2: Clean previous build
Write-Host "📦 Step 2/5: Cleaning previous build..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force dist
    Write-Host "✅ Cleaned dist folder" -ForegroundColor Green
} else {
    Write-Host "✅ No previous build to clean" -ForegroundColor Green
}
Write-Host ""

# Step 3: Install dependencies (if needed)
Write-Host "📚 Step 3/5: Checking dependencies..." -ForegroundColor Yellow
if (-Not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Dependency installation failed!" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Dependencies ready" -ForegroundColor Green
Write-Host ""

# Step 4: Build production version
Write-Host "🔨 Step 4/5: Building production version..." -ForegroundColor Yellow
Write-Host "This may take 30-60 seconds..." -ForegroundColor Gray
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ BUILD FAILED!" -ForegroundColor Red
    Write-Host "Please fix errors before deploying." -ForegroundColor Red
    Write-Host ""
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""

# Step 5: Deploy to Vercel
Write-Host "🚀 Step 5/5: Deploying to Vercel production..." -ForegroundColor Yellow
Write-Host "Target: https://zentrixlearnit.in" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-Not $vercelInstalled) {
    Write-Host "⚠️ Vercel CLI not found!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Installing Vercel CLI globally..." -ForegroundColor Yellow
    npm install -g vercel
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "❌ Failed to install Vercel CLI" -ForegroundColor Red
        Write-Host "Please run manually: npm install -g vercel" -ForegroundColor Yellow
        exit 1
    }
}

# Deploy to production
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Live at: https://zentrixlearnit.in" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "⏱️ Changes will be live in 30-60 seconds" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "What's New:" -ForegroundColor White
    Write-Host "   ✅ Mentor: Full Assignments Management" -ForegroundColor White
    Write-Host "   ✅ Student: Assignment Submission System" -ForegroundColor White
    Write-Host "   ✅ Grading: Complete Feedback System" -ForegroundColor White
    Write-Host "   ✅ Firebase: Real-time Updates" -ForegroundColor White
    Write-Host ""
    Write-Host "Test Now:" -ForegroundColor White
    Write-Host "   1. Visit: https://zentrixlearnit.in" -ForegroundColor Gray
    Write-Host "   2. Login as mentor or student" -ForegroundColor Gray
    Write-Host "   3. Click Assignments tab" -ForegroundColor Gray
    Write-Host "   4. Verify all features work" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ❌ DEPLOYMENT FAILED!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Check Vercel authentication: vercel login" -ForegroundColor Gray
    Write-Host "2. Verify project linked: vercel link" -ForegroundColor Gray
    Write-Host "3. Check error messages above" -ForegroundColor Gray
    Write-Host "4. Try manual deploy from Vercel Dashboard" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
