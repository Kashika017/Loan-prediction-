@echo off
echo Starting Loan Default Predictor Application...
echo.

echo Launching FastAPI Backend on http://localhost:8000 ...
start "FastAPI Backend" cmd /k "cd backend && python -m uvicorn main:app --reload --port 8000"

echo Launching React Frontend on http://localhost:5173 ...
start "React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting up! 
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8000
