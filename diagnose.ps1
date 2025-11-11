# Quick diagnostic checklist for ElectroMart

Write-Host "ElectroMart Diagnostic Checklist" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Check if MongoDB is running
Write-Host "1. Checking MongoDB..." -ForegroundColor Yellow
$mongoRunning = docker ps --filter "ancestor=mongo:6.0" --quiet
if ($mongoRunning) {
    Write-Host "   ✓ MongoDB container is running" -ForegroundColor Green
} else {
    Write-Host "   ✗ MongoDB container NOT running" -ForegroundColor Red
    Write-Host "   → Start it with: docker run -d -p 27017:27017 --name electromart-mongo mongo:6.0" -ForegroundColor Cyan
}

# Check if backend is running
Write-Host ""
Write-Host "2. Checking Backend (port 5000)..." -ForegroundColor Yellow
try {
    $backend = Invoke-WebRequest -Uri "http://localhost:5000" -ErrorAction Stop -TimeoutSec 2
    if ($backend.StatusCode -eq 200) {
        Write-Host "   ✓ Backend is running" -ForegroundColor Green
    }
} catch {
    Write-Host "   ✗ Backend NOT running or not responding" -ForegroundColor Red
    Write-Host "   → Start backend in backend/ folder: npm run dev" -ForegroundColor Cyan
}

# Check if frontend is running
Write-Host ""
Write-Host "3. Checking Frontend (port 5173)..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:5173" -ErrorAction Stop -TimeoutSec 2
    if ($frontend.StatusCode -eq 200) {
        Write-Host "   ✓ Frontend dev server is running" -ForegroundColor Green
    }
} catch {
    Write-Host "   ✗ Frontend NOT running" -ForegroundColor Red
    Write-Host "   → Start frontend in frontend/ folder: npm run dev" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Quick fixes:" -ForegroundColor Yellow
Write-Host "  • If MongoDB not running: docker run -d -p 27017:27017 --name electromart-mongo mongo:6.0" -ForegroundColor Cyan
Write-Host "  • If backend crashed: cd backend && npm run dev" -ForegroundColor Cyan
Write-Host "  • If no data: cd backend && npm run seed" -ForegroundColor Cyan
Write-Host ""
