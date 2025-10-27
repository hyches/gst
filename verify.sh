#!/bin/bash
set -e

# Start a simple HTTP server in the background
python3 -m http.server 8000 &
SERVER_PID=$!

# Give the server a moment to start
sleep 2

# Check if the page loads successfully
curl -f http://localhost:8000/GST%20Reconciliation.html > /dev/null

# Kill the server
kill $SERVER_PID

echo "Verification successful: Page loads correctly."
