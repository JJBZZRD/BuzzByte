@echo off
echo Starting BuzzByte in Docker containers...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not running! Please start Docker and try again.
    exit /b 1
)

REM Make sure we're in the right directory
cd /d %~dp0

REM Build and start the containers
echo Building and starting containers...
docker-compose up --build -d

if %errorlevel% neq 0 (
    echo Failed to start Docker containers. Check the Docker logs for more information.
) else (
    echo BuzzByte is now running!
    echo Web interface: http://localhost
    echo To stop the application, run stop.bat
)

exit /b 0 