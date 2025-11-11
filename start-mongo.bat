@echo off
REM Start MongoDB container for local development
docker run -d -p 27017:27017 --name electromart-mongo mongo:6.0
echo.
echo MongoDB started on localhost:27017
echo To stop: docker stop electromart-mongo
echo To remove: docker rm electromart-mongo
echo.
echo Now run in backend folder:
echo   npm run seed
echo   npm run dev
