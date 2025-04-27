@echo off
echo Running test scripts for the project...

echo.
echo Installing dependencies if needed...
cd ..
npm install node-fetch form-data uuid canvas
echo.

echo Running API endpoint tests...
node scripts/test-api-endpoints.js
echo.

echo Running form data tests...
node scripts/test-form-data.js
echo.

echo Running image carousel tests...
node scripts/test-image-carousel.js
echo.

echo Running project workflow tests...
node scripts/test-project-workflow.js
echo.

echo All tests completed!
echo.

echo To start the development server, run the following command:
echo cd nextjs
echo npm run dev
echo. 