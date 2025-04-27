@echo off
echo Stopping BuzzByte Docker containers...

REM Make sure we're in the right directory
cd /d %~dp0

REM Stop the containers
docker-compose down

echo BuzzByte has been stopped. 