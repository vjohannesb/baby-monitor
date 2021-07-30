import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const motionNotifOptions: NotificationOptions = {
    body: "Motion detected! Click here to view baby monitor.",
    icon: "{{ url_for('static', filename='android-chrome-192x192.png') }}",
    renotify: true,
    tag: "babyMonitor",
};

const connectNotifOptions: NotificationOptions = {
    body: "Connected to BabyMonitor notifications.",
    icon: "{{ url_for('static', filename='android-chrome-192x192.png') }}",
    renotify: false,
    tag: "connection",
};

const socketio = (): Socket<DefaultEventsMap, DefaultEventsMap> => {
    const socket = io({
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        requestTimeout: 1000,
    });

    socket.on("connect", () => {
        socket.io.engine.requestTimeout = 0;
        console.log("Socket connected.");
        const notification = new Notification(
            "BabyMonitor connected",
            connectNotifOptions
        );
    });

    socket.on("connect_error", (error) => {
        console.log(`Connection failed... ${error}`);
    });

    socket.on("disconnect", (reason) => {
        console.log(`Socket disconnected. Reason: ${reason}`);
    });

    socket.on("error", (error) => {
        console.log(`Error: ${error}`);
    });

    socket.on("motion", (data) => {
        console.log("Motion detected! " + data);
        const notification = new Notification(
            "BabyMonitor",
            motionNotifOptions
        );
    });

    return socket;
};

export default socketio;
