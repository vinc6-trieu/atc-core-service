#!/bin/bash

# Function to wait for successful curl
wait_for_curl() {
    local url=$1
    local max_retries=30
    local retry_interval=5
    local retries=0

    while [ $retries -lt $max_retries ]; do
        if curl -s "$url" > /dev/null; then
            echo "curl $url - Succeeded"
            return 0
        else
            retries=$((retries + 1))
            sleep $retry_interval
            echo "Retrying... Attempt $retries/$max_retries"
        fi
    done

    echo "curl $url - Failed after $max_retries attempts"
    return 1
}

# Stop pm2 processes
echo "Stopping atlas-1..."
pm2 stop atlas-1
pm2 start atlas-1
wait_for_curl http://localhost:3000/ || exit 1

echo "Stopping atlas-2..."
pm2 stop atlas-2
pm2 start atlas-2
wait_for_curl http://localhost:4000/ || exit 1

echo "Stopping atlas-3..."
pm2 stop atlas-3
pm2 start atlas-3
wait_for_curl http://localhost:5000/ || exit 1