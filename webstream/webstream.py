from flask.templating import render_template
from imutils.video import VideoStream
from flask_socketio import SocketIO
from time import time, sleep
from flask import Response
from flask import Flask
import threading
import argparse
import imutils
import dotenv
import cv2

WIDTH = 640
HEIGHT = 480
RS_WIDTH = int(WIDTH / 1.6)
RS_HEIGHT = int(HEIGHT / 1.6)

# Init output and thread lock
output_frame = None
lock = threading.Lock()

# Init app and camera
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
vs = VideoStream(src=0).start()

# Motion alert emit limit
emit_limit = 30

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
        threshold = cv2.erode(threshold, None, iterations=1)
        threshold = cv2.dilate(threshold, None, iterations=1)

        # Contours of motion
        contours = cv2.findContours(threshold, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[0]

        return len(contours) > 0

def detect_motion(frame_count):
    global output_frame, lock
    md = MotionDetector(0.5)
    
    next_emit = time() + emit_limit

    # Construct bg
    for _ in range(frame_count):
        with lock:
            frame = output_frame.copy()
        gray = imutils.resize(frame, width=RS_WIDTH, height=RS_HEIGHT)
        gray = cv2.cvtColor(gray, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (7, 7), 0)
        md.update(gray)

    # Run MotionDetector once every second (unless fn takes longer)
    while True:
        start = time()
        with lock:
            frame = output_frame.copy()
        gray = imutils.resize(frame, width=RS_WIDTH, height=RS_HEIGHT)
        gray = cv2.cvtColor(gray, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (7, 7), 0)

        motion = md.detect(gray)
        md.update(gray)

        ts = time()
        if motion and ts > next_emit:
            socketio.emit("motion")
            next_emit = ts + emit_limit

        sleep(max(0, 1 - (ts - start)))

def get_frame():
    global vs, output_frame, lock
    while True:
        ts = time()
        with lock:
            output_frame = vs.read()

        # Max 25 FPS
        sleep(max(0, 0.04 - (time() - ts)))

def generate():
    global output_frame, lock
    params = [cv2.IMWRITE_JPEG_QUALITY, 80]
    while True:
        with lock:
            if output_frame is None:
                continue
            
            success, encoded_img = cv2.imencode(".jpg", output_frame, params)
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
    ap.add_argument("-p", "--port", type=int, required=True, help="Port number of the server (1024 to 65535)")
    ap.add_argument("-f", "--frame_count", type=int, required=False, help="Number of frames to construct background (if using motion detection)")
    args = vars(ap.parse_args())
    args["frame_count"] = args["frame_count"] or 32
    print(args)
    
    t1 = threading.Thread(target=get_frame, name="StreamCapture")
    t1.daemon = True
    t1.start()

    t2 = threading.Thread(target=detect_motion, name="MotionDetector", args=(args["frame_count"],))
    t2.daemon = True
    t2.start()

    socketio.run(app, host=args["ip"], port=args["port"], debug=False)
    # app.run(host=args["ip"], port=args["port"], debug=False)

# Release VideoStream pointer
# vs.stop()