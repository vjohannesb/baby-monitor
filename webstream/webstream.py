from flask.templating import render_template
from imutils.video import VideoStream
from datetime import datetime as dt, timedelta
from flask import Response
from flask import Flask
from flask_socketio import SocketIO
import numpy as np
import threading
import argparse
import imutils
import json
import cv2

WIDTH = 640
HEIGHT = 480

class MotionDetector:
    def __init__(self, accumWeight=0.5) -> None:
        self.accumWeight = accumWeight
        self.bg = None

    def update(self, image):
        if self.bg is None:
            self.bg = image.copy().astype("float")
            return
        cv2.accumulateWeighted(image, self.bg, self.accumWeight)
    
    def detect(self, image, t_val=25):
        # Get diff between bg and image per threshold
        delta = cv2.absdiff(self.bg.astype("uint8"), image)
        threshold = cv2.threshold(delta, t_val, 255, cv2.THRESH_BINARY)[1]

        # Distort image to eradicate false positives
        threshold = cv2.erode(threshold, None, iterations=2)
        threshold = cv2.dilate(threshold, None, iterations=2)

        # Contours of motion
        contours = cv2.findContours(threshold.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        contours = imutils.grab_contours(contours)

        if len(contours) == 0:
            return None

        # Default values
        (min_x, min_y) = (np.inf, np.inf)
        (max_x, max_y) = (-np.inf, -np.inf)
        
        # Set bounding box
        for c in contours:
            (x, y, w, h) = cv2.boundingRect(c)
            (min_x, min_y) = (min(min_x, x), min(min_y, y))
            (max_x, max_y) = (max(max_x, x + w), max(max_y, y + h))

        # Threshold value + bounding box
        return (threshold, (min_x, min_y, max_x, max_y))

# Init output and thread lock
output_frame = None
lock = threading.Lock()

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
vs = VideoStream(src=0).start()

motion_notif_limit = 60
last_motion_emit = dt.now() - timedelta(seconds=motion_notif_limit)

def detect_motion(frame_count):
    global vs, output_frame, lock, last_motion_emit

    md = MotionDetector(accumWeight=0.1)
    frames_read = 0

    while True:
        frame = vs.read()
        frame = imutils.resize(frame, height=HEIGHT)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (7, 7), 0)

        # Add timestamp to video feed
        ts = dt.now()
        cv2.rectangle(frame, (0, HEIGHT), (220, 460), (0,0,0), -1)
        cv2.putText(frame, f"{ts:%a %d %b %Y %H:%M:%S}", (5, HEIGHT - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
        
        if frames_read > frame_count:
            motion = md.detect(gray)

            if motion is not None:
                # Add red rectangle around moving object
                (threshold, (min_x, min_y, max_x, max_y)) = motion
                cv2.rectangle(frame, (min_x, min_y), (max_x, max_y),
                (50, 50, 255), 2)

                # Emit 'motion detected' signal to webapp
                delta = (dt.now() - last_motion_emit).seconds
                if delta >= motion_notif_limit:
                    socketio.emit("motion")
                    last_motion_emit = dt.now()
        else:
            frames_read += 1

        md.update(gray)
        with lock:
            output_frame = frame.copy()

def get_frame():
    global output_frame, lock

    while True:
        frame = vs.read()

        # Add timestamp to video feed
        ts = dt.now()
        cv2.rectangle(frame, (0, HEIGHT), (220, 460), (0,0,0), -1)
        cv2.putText(frame, f"{ts:%a %d %b %Y %H:%M:%S}", (5, HEIGHT - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
        
        with lock:
            try:
                output_frame = frame.copy()
            except:
                pass

def generate():
    global output_frame, lock
    
    while True:
        with lock:
            if output_frame is None:
                continue
            
            (flag, encoded_img) = cv2.imencode(".jpg", output_frame)

            if not flag:
                continue
        
        yield(b"--frame\r\n" b"Content-Type: image/jpeg\r\n\r\n" + bytearray(encoded_img) + b"\r\n")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/video_feed")
def video_feed():
    return Response(generate(), mimetype="multipart/x-mixed-replace; boundary=frame")

@socketio.event
def connect(auth):
    print(f"[{dt.now():%Y-%m-%d %H:%M:%S}] New socket connection.")

@socketio.event
def set_notif_delta(data):
    global motion_notif_limit
    try:
        motion_notif_limit = json.loads(data)["delta"]
    except Exception as err:
        socketio.emit("error", { "error": err })

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("-i", "--ip", type=str, required=True, help="IP Address of the device")
    ap.add_argument("-o", "--port", type=int, required=True, help="Port number of the server (1024 to 65535)")
    ap.add_argument("-f", "--frame-count", type=int, default=32, help="If using motion detection, # of frames used to construct the background model")
    args = vars(ap.parse_args())
    print(args)
    
    t = threading.Thread(target=lambda: detect_motion(args["frame_count"]))
    t.daemon = True
    t.start()

    # SSL needed for Notifications API.
    # Self-signed [ssl_context='adhoc'] as it's only running locally
    # *not* recommended in production
    socketio.run(app, host=args["ip"], port=args["port"], debug=False, ssl_context="adhoc")

# Release VideoStream pointer
# vs.stop()