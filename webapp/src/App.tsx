import React from "react";
import Settings from "./components/Settings";
import VideoFeed from "./components/VideoFeed";

function App(): JSX.Element {
    return (
        <div className="App">
            <header className="App-header"></header>
            <VideoFeed />
            <Settings />
        </div>
    );
}

export default App;
