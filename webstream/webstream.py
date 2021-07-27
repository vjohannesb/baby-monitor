# from cam.pycam import MotionDetector

from flask.templating import render_template
from imutils.video import VideoStream
from datetime import datetime as dt
from flask import Response
from flask import Flask
import threading
import argparse
import imutils
import locale
import cv2

WIDTH = 640
HEIGHT = 480

# Init output and thread lock
output_frame = None
lock = threading.Lock()

app = Flask(__name__)
vs = VideoStream(src=0).start()

# locale.setlocale(locale.LC_TIME, "sv_SE")

def detect_motion(frame_count):
    global vs, output_frame, lock 

    md = MotionDetector(accumWeight=0.1)
    frames_read = 0

    while True:
        frame = vs.read()
        frame = imutils.resize(frame, height=720)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (7, 7), 0)

        ts = dt.now()
        cv2.putText(frame, f"{ts:%a %d %b %Y %H:%M:%S}",
                    (10, frame.shape[0] - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.35, (50, 50, 255), 1)
        
        if frames_read > frame_count:
            motion = md.detect(gray)

            if motion is not None:
                (threshold, (min_x, min_y, max_x, max_y)) = motion
                cv2.rectangle(frame, (min_x, min_y), (max_x, max_y),
                (50, 50, 255), 2)
        
        md.update(gray)
        frames_read += 1

        with lock:
            output_frame = frame.copy()

def get_frame():
    global output_frame, lock

    while True:
        frame = vs.read()

        # Add timestamp to video feed (disabled for now)
        # ts = dt.now()
        # cv2.rectangle(frame, (0, HEIGHT), (220, 460), (0,0,0), -1)
        # cv2.putText(frame, f"{ts:%a %d %b %Y %H:%M:%S}", (5, HEIGHT - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
        
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

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("-i", "--ip", type=str, required=True, help="IP Address of the device")
    ap.add_argument("-o", "--port", type=int, required=True, help="Port number of the server (1024 to 65535)")
    ap.add_argument("-f", "--frame-count", type=int, default=32, help="If using motion detection, # of frames used to construct the background model")
    args = vars(ap.parse_args())
    print(args)
    
    # Initiate thread
    t = threading.Thread(target=get_frame)
    t.daemon = True
    t.start()

    # Start Flask 
    app.run(host=args["ip"], port=args["port"], debug=True, threaded=True, use_reloader=False)

# Release VideoStream pointer
# vs.stop()