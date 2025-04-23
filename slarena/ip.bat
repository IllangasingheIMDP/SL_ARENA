@echo off
setlocal EnableDelayedExpansion

:: Find the IPv4 address of your PC (adjust interface keyword if needed)
for /f "tokens=2 delims=:" %%A in ('ipconfig ^| findstr "IPv4"') do (
    set "IP=%%A"
    set "IP=!IP:~1!"
    goto :found
)

:found
echo Found IP: %IP%

:: Create or update the .env file
(
    echo API_URL=http://%IP%:5001/api/v1
) > .env

echo .env file has been updated with API_URL=http://%IP%:5001/api/v1

