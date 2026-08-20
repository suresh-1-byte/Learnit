# Force deployment to Vercel Production
Write-Host "Starting forced production deployment..." -ForegroundColor Green

# Build the project locally first
Write-Host "`nBuilding project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green
    
    # Deploy to production
    Write-Host "`nDeploying to Vercel production..." -ForegroundColor Yellow
    vercel --prod --force
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nDeployment initiated successfully!" -ForegroundColor Green
        Write-Host "Check your Vercel dashboard for deployment status." -ForegroundColor Cyan
        Write-Host "Your site will be live at zentrixlearnit.in in 2-3 minutes." -ForegroundColor Cyan
    } else {
        Write-Host "`nDeployment failed. Check error above." -ForegroundColor Red
    }
} else {
    Write-Host "`nBuild failed. Fix errors before deploying." -ForegroundColor Red
}
