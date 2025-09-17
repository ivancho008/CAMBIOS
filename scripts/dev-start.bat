@echo off
title Iniciando Desarrollo - Synapse App

echo Iniciando entorno de desarrollo...

REM Verificar que MySQL esté ejecutándose0
mysql -u root -e "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo  MySQL no está ejecutándose. Por favor, inicia el servicio MySQL.
    echo Puedes iniciarlo desde:
    echo - Services.msc (buscar MySQL)
    echo - MySQL Workbench
    echo - Línea de comandos: net start mysql
    pause
    exit /b 1
)

REM Iniciar Backend en una nueva ventana
echo  Iniciando Backend...
start "Backend Flask" cmd /k "cd ..\backend && call venv\Scripts\activate.bat && python run.py"

REM Esperar un momento para que el backend inicie
timeout /t 3

REM Iniciar Frontend en una nueva ventana
echo  Iniciando Frontend...
start "Frontend React" cmd /k "cd ..\frontend && npm start"

echo.
echo  Entorno iniciado correctamente!
echo.
echo  Frontend: http://localhost:3000
echo  Backend: http://localhost:5000
echo  Base de datos: localhost:3306
echo.
echo Para detener el entorno, cierra las ventanas o ejecuta dev-stop.bat
pause