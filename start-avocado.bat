@echo off
REM AVOCADO QUEST - double-click to start the server and open the app
cd /d "%~dp0"
start "AVOCADO QUEST SERVER" /min cmd /k "node server\index.js"
timeout /t 2 /nobreak >nul
start "" http://localhost:4173/
