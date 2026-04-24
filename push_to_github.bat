@echo off
cd /d "c:\Users\Admin\Downloads\final_editIDRL"

echo ----------------------------------------
echo Starting GitHub Push Process...
echo ----------------------------------------

echo.
echo [1/6] Initializing Git repository...
git init

echo.
echo [2/6] Adding all files to Git...
git add .

echo.
echo [3/6] Committing changes...
git commit -m "Initial commit for RescueSync"

echo.
echo [4/6] Setting up GitHub connection...
git remote add origin https://github.com/krishnamourya565-hue/RescueSync.git 2>nul
git remote set-url origin https://github.com/krishnamourya565-hue/RescueSync.git

echo.
echo [5/6] Setting main branch...
git branch -M main

echo.
echo [6/6] Pushing project to GitHub...
git push -u origin main

echo.
echo ----------------------------------------
echo Process Complete!
echo ----------------------------------------
pause
