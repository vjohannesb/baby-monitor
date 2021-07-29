const express = require("express");
const path = require("path");
const cv = require("opencv4nodejs");

const app = express();
const PORT = 9000;

const cap = new cv.VideoCapture(0);
const src = new cv.Mat(height, width, cv.CV_8UC4);

app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
	navigator.mediaDevices
		.getUserMedia({ video: true, audio: false })
		.then((stream) => {
			video.srcObject = stream;
			video.play();
		})
		.catch((err) => {
			console.log(`An error occured! - ${err}`);
		});

	res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/video_feed", (req, res) => {
	return cap.read(src);
});

app.listen(PORT, () => {
	console.log(`Listening at http://localhost:${PORT}`);
});
