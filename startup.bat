@echo off
REM PyFixer-Pro Startup Batch File
REM Developed by MT Tech Industries LLC
REM https://mttechindustries.github.io/

echo.
echo  _____      _       _                 
echo ^|  __ \    (_)     ^| ^|                
echo ^| ^|__) ^| __ ___   _^| ^|__   ___  _ __  
echo ^|  ___/ '__^| \ \ / / '_ \ / _ \^| '_ \ 
echo ^| ^|   ^| ^|  ^| ^|^\ V /^| ^| ^| ^| (_) ^| ^|_) ^|
echo ^|_^|   ^|_^|  ^|_^| \_/ ^|_^| ^|_^|\___/^| .__/ 
echo                               ^| ^|    
echo                               ^|_^|    
echo.
echo  PyFixer-Pro - Advanced Python Code Analysis Tool
echo  Developed by MT Tech Industries LLC
echo  https://mttechindustries.github.io/
echo.

REM Check prerequisites
echo.
echo 🔍 Checking prerequisites...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed
    echo Please install Node.js (v18 or higher) before running PyFixer-Pro
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js %NODE_VERSION% detected
)

npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed
    pause
    exit /b 1
) else (
    echo ✅ npm detected
)

REM Check if we're in the correct directory
if not exist "package.json" (
    echo ❌ package.json not found in current directory
    echo Please run this script from the PyFixer-Pro project directory
    pause
    exit /b 1
) else (
    echo ✅ PyFixer-Pro project detected
)

REM Install dependencies
echo.
echo 📦 Installing dependencies...
if exist "node_modules" (
    echo ⚠️  Dependencies may already be installed
    set /p REINSTALL="Reinstall dependencies? (y/N): "
    if /I "%REINSTALL%"=="y" (
        npm install
        if %errorlevel% equ 0 (
            echo ✅ Dependencies installed successfully
        ) else (
            echo ❌ Failed to install dependencies
            pause
            exit /b 1
        )
    ) else (
        echo ✅ Skipping dependency installation
    )
) else (
    npm install
    if %errorlevel% equ 0 (
        echo ✅ Dependencies installed successfully
    ) else (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check environment
echo.
echo 🔐 Checking environment configuration...
if exist ".env.local" (
    echo ✅ Environment file (.env.local) found
    REM Count configured API keys (simplified check)
    findstr /C:"_API_KEY=" .env.local >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ API keys found in environment file
    ) else (
        echo ⚠️  No API keys found in environment file
    )
) else (
    echo ⚠️  Environment file (.env.local) not found
    echo Create .env.local with your API keys to use PyFixer-Pro
    echo See INSTALLATION.md for setup instructions
)

REM Start the application
echo.
echo 🚀 Starting PyFixer-Pro...
echo Application will be available at http://localhost:5173
echo Press Ctrl+C to stop the server
echo.

npm run dev