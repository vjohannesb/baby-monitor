<h1 align="center">BabyMonitor v0.1</h1>
<p align="center">A proper readme is coming soon!</p>

## 📜 Description

A BabyMonitor running on my Raspberry Pi Zero W. Built using OpenCV in Python, as well as a web-app built in React for easy viewing by any device on a local network. Uses SocketsIO to communicate motion detection from Python to the webapp, which alerts via CSS-effects. Some settings (such as brightness and contrast) available directly in the webapp utilizing CSS-filters as to not strain the poor Pi any further - if you're using something more robust, there's probably better ways to enhance the picture directly in OpenCV.

Inspired by one of the many tutorials by [PyImageSearch](https://www.pyimagesearch.com/). Check them out :)

I also used [AutoHotspot](https://github.com/RaspberryConnect/AutoHotspot-Installer) to make my Raspberry Pi Zero W launch a hotspot in case it doesn't recognize any WiFi's. I recommend reading up on the repository there, and bloglinks in the readme, if you're interested in a similar solution.

I combined this with a cronjob to start webstream&#46;py with my default input arguments as soon as the Pi starts.

## 🚨 **HEADS UP!**

As a new parent _good enough_ is definitely **good enough**! So be warned, I have not tested this setup in any way more than required to make it _work_. So while this works for me, ***I can in no way guarantee it could, should, or even will work for you!***

## 🔜 Future iterations

1. A proper readme...
2. Feeding and sleeping time-keeping functionality
3. Other one-stop-shop functions such as when the baby _should_ sleep depending on age etc.
4. Gotta do some cleanup, like remove the nightvision-button... :)

## Favicon License

The emoji graphics are from the open source project Twemoji (https://twemoji.twitter.com/). The graphics are copyright 2020 Twitter, Inc and other contributors. The graphics are licensed under CC-BY 4.0
