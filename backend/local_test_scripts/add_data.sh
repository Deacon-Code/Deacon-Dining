#!/bin/bash

# Define the JSON payload
payload='{
  "location": "Dining Hall",
  "item": "Spaghetti",
  "date": "2024-03-30",
  "station": "Pasta Bar",
  "time": "Lunch",
  "dateAdded": "2024-03-30T12:00:00"
}'

# Send a POST request using curl
curl -X POST \
  -H "Content-Type: application/json" \
  -d "$payload" \
  http://localhost:5050/menu