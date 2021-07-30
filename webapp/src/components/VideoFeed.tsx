import React, { useEffect, useRef, useState } from "react";
import { Spinner, SpinnerSize } from "@fluentui/react";
import { useAppContext } from "../context/ContextProvider";

import "./VideoFeed.scss";

const VideoFeed = (): JSX.Element => {
    const {
        filterState: { brightness, contrast, nightVision },
        connectionState: { connected, setConnected },
    } = useAppContext();

    const videoFeedContainer = useRef<HTMLDivElement>(null);
    const [fullscreen, setFullscreen] = useState(false);

    const [videoFilter, setVideoFilter] = useState(
        `brightness(${brightness + 100}%) 
        contrast(${contrast + 100}%)
        hue-rotate(${nightVision ? "90deg" : "0"})
        saturate(${nightVision ? "10" : "1"})`
    );

    useEffect(() => {
        setVideoFilter(
            `brightness(${brightness + 100}%) 
            contrast(${contrast + 100}%) 
            hue-rotate(${nightVision ? "90deg" : "0"}) 
            saturate(${nightVision ? "10" : "1"})`
        );
    }, [brightness, contrast, nightVision]);

    const toggleFullscreen = () => {
        if (!fullscreen)
            videoFeedContainer.current
                ?.requestFullscreen({ navigationUI: "hide" })
                .then(() => setFullscreen(true));
        else document.exitFullscreen().then(() => setFullscreen(false));
    };

    const onCameraLoaded = () => setConnected(true);

    return (
        <>
            {!connected && (
                <div id="loader">
                    <Spinner
                        label="Connecting to camera..."
                        size={SpinnerSize.large}
                    />
                </div>
            )}

            <div ref={videoFeedContainer}>
                <img
                    id="videoFeed"
                    style={{ filter: videoFilter }}
                    src="https://localhost:8000/video_feed"
                    onDoubleClick={toggleFullscreen}
                    onLoad={onCameraLoaded}
                />
            </div>
        </>
    );
};

export default VideoFeed;
