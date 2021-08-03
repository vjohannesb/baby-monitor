import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const initSocket = (): Socket<DefaultEventsMap, DefaultEventsMap> => {
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

    return socket;
};

export default initSocket;
