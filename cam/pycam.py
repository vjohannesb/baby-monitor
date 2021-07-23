import cv2
import numpy as np
import imutils

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
