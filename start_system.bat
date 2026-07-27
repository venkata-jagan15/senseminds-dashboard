@echo off
title SenseMinds Environmental Intelligence Launcher
echo =====================================================================
echo          SENSEMINDS INDUSTRIAL SAFETY ENGINE INITIALIZATION          
echo =====================================================================
echo.

echo [1/8] Cleaning raw CEMS telemetry...
python cleaning.py
if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Data cleaning phase failed. Exiting...
    pause
    exit /b %ERRORLEVEL%
)

echo [2/8] Running Feature Engineering...
python feature_engineering.py

echo [3/8] Executing Deterministic Analytics...
python Deterministic_Analytics.py

echo [4/8] Running Rule Engine Diagnoses...
python rule_engine.py

echo [5/8] Building relational Knowledge Graph database...
python -m knowledge_graph.builder

echo [6/8] Running ML Isolation Forest Outlier calculations...
python -m ml.anomaly_detector

echo [7/8] Fitting Holt-Winters time-series forecaster...
python -m ml.forecaster

echo [8/8] Syncing safety engine parameters and PLC recommendations...
python -m ml.safety_engine

echo.
echo =====================================================================
echo           PIPELINE COMPILED - LAUNCHING LOCAL SERVICE SHELLS          
echo =====================================================================
echo.

echo Launching FastAPI backend server on http://localhost:8000/docs ...
start "SenseMinds Backend API" cmd /k "python -m backend.app"

echo Launching Vite React dashboard on http://localhost:5173/ ...
start "SenseMinds Frontend Dashboard" cmd /k "npm run dev"

echo.
echo System started successfully. Keep the separate console windows open to maintain live streams.
echo Press any key to exit this launcher...
pause > nul
