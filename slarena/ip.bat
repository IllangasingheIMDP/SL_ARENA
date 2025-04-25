@echo off
setlocal EnableDelayedExpansion

:: Find the IPv4 address of the Wireless LAN adapter Wi-Fi
set "IP="
for /f "tokens=2 delims=:" %%A in ('ipconfig ^| findstr /C:"IPv4 Address"') do (
    set "CURRENT_IP=%%A"
    set "CURRENT_IP=!CURRENT_IP:~1!"
    :: Check if this IP belongs to Wireless LAN adapter Wi-Fi
    for /f "tokens=*" %%B in ('ipconfig ^| findstr /C:"Wireless LAN adapter Wi-Fi"') do (
        set "IP=!CURRENT_IP!"
        goto :found
    )
)

:found
if not defined IP (
    echo ERROR: Could not find IPv4 address for Wireless LAN adapter Wi-Fi
    exit /b 1
)
echo Found IP: %IP%

:: Create or update the .env file
(
    echo API_URL=http://%IP%:5001/api/v1
    echo SOCKET_URL=http://%IP%:5001
) > .env

echo .env file has been updated with API_URL=http://%IP%:5001/api/v1