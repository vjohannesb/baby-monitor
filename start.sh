#!/bin/bash

# Get local ip address and print to json for 'webapp' access
PORT=8000
localip=$(ip route get 1 | sed -n "s/.*src \([0-9.]\+\).*/\1/p")
echo {\"ip\": \"$localip\", \"port\": $PORT} > webstream/src/static/ip.json

# Start flask/serving
python3 webstream.py --ip="0.0.0.0" --port 8000 &
