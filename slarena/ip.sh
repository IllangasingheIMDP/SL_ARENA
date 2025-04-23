#!/bin/bash

# Get the IP address of the active network interface (usually en0 for Wi-Fi)
IP=$(ipconfig getifaddr en0)

# Fallback if en0 doesn't work (e.g., on Ethernet or other setups)
if [ -z "$IP" ]; then
  IP=$(ipconfig getifaddr en1)
fi

# Check if IP was found
if [ -z "$IP" ]; then
  echo "Could not find local IP address."
  exit 1
fi

echo "Found IP: $IP"

# Write the new API_URL to the .env file (overwrite it)
echo "API_URL=http://$IP:5001/api/v1" > .env

echo ".env file has been updated with API_URL=http://$IP:5001/api/v1"
