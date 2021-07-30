import React, { useEffect } from "react";

import Settings from "./components/Settings";
import socketio from "./components/Socket";
import VideoFeed from "./components/VideoFeed";
import { useAppContext } from "./context/ContextProvider";

function App(): JSX.Element {
    useEffect(() => {
        const socket = socketio();
    }, []);

    const {
        connectionState: { connected },
    } = useAppContext();

    return (
        <div className="App">
            <header className="App-header"></header>
            <VideoFeed />
            {connected && <Settings />}
        </div>
    );
}

export default App;
