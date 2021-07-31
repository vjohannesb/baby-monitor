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
import dotenv
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

        return len(contours) != 0

# Init output and thread lock
output_frame = None
lock = threading.Lock()

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
vs = VideoStream(src=0).start()

motion_notif_limit = 60
next_motion_emit = dt.now()

def detect_motion(frame_count):
    global vs, output_frame, lock, next_motion_emit
    # md = MotionDetector(accumWeight=0.1)

    last = dt.now()

    # for _ in range(frame_count):
    #     frame = vs.read()
    #     gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    #     gray = cv2.GaussianBlur(gray, (7, 7), 0)
    #     md.update(gray)

    #     with lock:
    #         output_frame = frame.copy()

    while True:
        frame = vs.read()
        # gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        # gray = cv2.GaussianBlur(gray, (7, 7), 0)
        
        # motion = md.detect(gray)

        # if motion:
        #     if dt.now() > next_motion_emit:
        #         socketio.emit("motion")
        #         next_motion_emit = dt.now() + timedelta(seconds=motion_notif_limit)

        with lock:
            tdelta = float((dt.now() - last).total_seconds()) * 100
            fps = 1 / tdelta
            cv2.putText(frame, f"FPS: {fps:.2f}", (5, HEIGHT - 5), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 1)
            output_frame = frame.copy()
            last = dt.now()
        

def generate():
    global output_frame, lock
    
    while True:
        with lock:
            if output_frame is None:
                continue
            
            (success, encoded_img) = cv2.imencode(".jpg", output_frame)

            if not success:
                continue
        
        yield(b"--frame\r\n" b"Content-Type: image/jpeg\r\n\r\n" + bytearray(encoded_img) + b"\r\n")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/video_feed")
def video_feed():
    return Response(generate(), mimetype="multipart/x-mixed-replace; boundary=frame")

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("-i", "--ip", type=str, required=True, help="IP Address of the device")
    ap.add_argument("-o", "--port", type=int, required=True, help="Port number of the server (1024 to 65535)")
    ap.add_argument("-f", "--frame-count", type=int, default=32, help="If using motion detection, # of frames used to construct the background model")
    args = vars(ap.parse_args())
    print(args)
    
    t = threading.Thread(target=detect_motion, args=(args["frame_count"],))
    t.daemon = True
    t.start()

    socketio.run(app, host=args["ip"], port=args["port"], debug=False)

# Release VideoStream pointer
# vs.stop()