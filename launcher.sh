#!/bin/bash
. /home/jb/babycam/flaskenv/bin/activate
cd /home/jb/babycam/baby-monitor/webstream
python3 webstream.py --ip="0.0.0.0" --port=8000 &> /dev/null &