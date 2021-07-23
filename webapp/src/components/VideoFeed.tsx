import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/ContextProvider";

import "./VideoFeed.scss";

const VideoFeed = (): JSX.Element => {
    const {
        brightnessState: { brightness },
        contrastState: { contrast },
        nightVisionState: { nightVision },
    } = useAppContext();

    const videoFeed = useRef<HTMLDivElement>(null);
    const fullscreen = useRef(false);

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
        if (!fullscreen.current)
            videoFeed.current
                ?.requestFullscreen({ navigationUI: "hide" })
                .then(() => (fullscreen.current = true));
        else document.exitFullscreen().then(() => (fullscreen.current = false));
    };

    return (
        <>
            <div ref={videoFeed}>
                <img
                    id="videoFeed"
                    style={{ filter: videoFilter }}
                    src="http://localhost:8000/video_feed"
                    onDoubleClick={toggleFullscreen}
                />
            </div>
        </>
    );
};

export default VideoFeed;
