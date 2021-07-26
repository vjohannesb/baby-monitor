import React from "react";
import Settings from "./components/Settings";
import VideoFeed from "./components/VideoFeed";
import { useAppContext } from "./context/ContextProvider";

function App(): JSX.Element {
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
