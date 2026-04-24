@echo off
echo Installing Dependencies...
cd frontend
call npm.cmd install
echo Starting Application...
call npm.cmd run dev
pause
