# Direct Vercel Deployment Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Direct Vercel Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build the project
Write-Host "Step 1: Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Build successful!" -ForegroundColor Green
Write-Host ""

# Step 2: Deploy using vercel CLI directly from dist folder
Write-Host "Step 2: Deploying to Vercel..." -ForegroundColor Yellow
Write-Host ""

# Change to dist directory and deploy
Set-Location dist

# Deploy with Vercel CLI (this uploads the built files directly)
vercel --prod --yes --name learn-it-platform --confirm

Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Deployment Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

pause
