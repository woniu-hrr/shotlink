@echo off
title ShotLink Service Check

echo ============================
echo   ShotLink Service Check
echo ============================
echo.

echo [1/3] Docker containers:
docker ps --format "table {{.Names}}	{{.Status}}" 2>nul
if %errorlevel% neq 0 (
    echo   FAIL - Docker not running. Open Docker Desktop first!
)

echo.
echo [2/3] Backend port 9090:
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:9090/actuator/health' -UseBasicParsing -TimeoutSec 5; Write-Host '  OK -' $r.Content } catch { Write-Host '  FAIL - Backend not running' }"

echo.
echo [3/3] Frontend port 5173:
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:5173' -UseBasicParsing -TimeoutSec 5; Write-Host '  OK - HTTP' $r.StatusCode } catch { Write-Host '  FAIL - Frontend not running' }"

echo.
echo ============================
echo   Check complete
echo ============================
pause
