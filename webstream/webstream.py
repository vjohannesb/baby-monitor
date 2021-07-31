from flask.templating import render_template
from imutils.video import VideoStream
from flask import Response
from flask import Flask
from flask_socketio import SocketIO
import threading
import argparse
import dotenv
import cv2

WIDTH = 640
HEIGHT = 480

# Init output and thread lock
output_frame = None
lock = threading.Lock()

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
vs = VideoStream(src=0).start()

def get_frame():
    global vs, output_frame, lock
    while True:
        frame = vs.read()
        with lock:
            output_frame = frame.copy()
        

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
    args = vars(ap.parse_args())
    print(args)
    
    t = threading.Thread(target=get_frame)
    t.daemon = True
    t.start()

    socketio.run(app, host=args["ip"], port=args["port"], debug=False)

# Release VideoStream pointer
# vs.stop()