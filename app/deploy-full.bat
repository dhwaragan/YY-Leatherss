@echo off
REM =========================================================
REM YY Leathers - Full Deployment for Netlify (Windows)
REM =========================================================
REM This script builds the project and packages it with
REM all Netlify Functions for drag-drop deployment.
REM
REM Usage: Double-click or run: deploy-full.bat
REM
REM Output: dist-netlify\ - Ready to deploy folder
REM =========================================================

echo Building project...
call npm run build

echo Creating deployment package...
if exist dist-netlify rmdir /s /q dist-netlify
mkdir dist-netlify

echo Copying static assets...
xcopy /e /i /q dist dist-netlify

echo Copying Netlify Functions...
mkdir dist-netlify\netlify\functions
xcopy /e /i /q netlify\functions dist-netlify\netlify\functions

echo Copying _redirects...
if exist dist\_redirects (
  copy dist\_redirects dist-netlify\
)

echo Copying netlify.toml...
copy netlify.toml dist-netlify\

echo.
echo ==========================================
echo Deployment package created in 'dist-netlify\'
echo ==========================================
echo.
echo Next steps:
echo   1. Go to https://app.netlify.com/drag
echo   2. Drag and drop the 'dist-netlify' folder
echo   3. Set environment variables in Netlify Dashboard
echo.
pause