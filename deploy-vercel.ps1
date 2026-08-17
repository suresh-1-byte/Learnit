# Deploy to Vercel Script
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " Deploying to Vercel" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Build locally first to verify
Write-Host "Step 1: Building locally to verify..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Local build successful!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Step 2: Deploying to Vercel..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "IMPORTANT: When prompted:" -ForegroundColor Red
    Write-Host "  1. Set up and deploy? -> Y" -ForegroundColor White
    Write-Host "  2. Which scope? -> suresh's projects" -ForegroundColor White
    Write-Host "  3. Link to existing project? -> Y" -ForegroundColor White
    Write-Host "  4. Project name? -> learn-it-platform" -ForegroundColor White
    Write-Host ""
    
    pause
    
    # Deploy with fresh build
    vercel --prod --force
    
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host " Deployment Complete!" -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor Cyan
    
} else {
    Write-Host "✗ Local build failed! Fix errors before deploying." -ForegroundColor Red
}

pause
