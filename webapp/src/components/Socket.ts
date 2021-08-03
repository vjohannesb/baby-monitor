import { SocketOptions } from "dgram";
import { io, ManagerOptions, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const initSocket = (
    address: string | null = null
): Socket<DefaultEventsMap, DefaultEventsMap> => {
    const options: Partial<ManagerOptions & SocketOptions> = {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        requestTimeout: 1000,
    };

    const socket = address ? io(address, options) : io(options);

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
