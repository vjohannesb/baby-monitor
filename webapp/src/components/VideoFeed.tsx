import React, { useEffect, useRef, useState } from "react";
import { Spinner, SpinnerSize } from "@fluentui/react";
import { useAppContext } from "../context/ContextProvider";
import initSocket from "./Socket";

import "./VideoFeed.scss";

const VideoFeed = (): JSX.Element => {
    const {
        filterState: { brightness, contrast, nightVision },
        connectionState: { connected, setConnected },
    } = useAppContext();

    const [fullscreen, setFullscreen] = useState(false);
    const videoFeedContainer = useRef<HTMLDivElement>(null);
    const videoFeed = useRef<HTMLImageElement>(null);

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

    useEffect(() => {
        const socket = initSocket("http://localhost:8000");

        socket.on("motion", () => {
            videoFeed.current?.classList.remove("motion-alert");
            videoFeed.current?.classList.add("motion-alert");
        });
    }, []);

    const toggleFullscreen = () => {
        if (!fullscreen)
            videoFeedContainer.current
                ?.requestFullscreen({ navigationUI: "hide" })
                .then(() => setFullscreen(true))
                .catch((err) => console.error(err));
        else
            document
                .exitFullscreen()
                .then(() => setFullscreen(false))
                .catch((err) => console.error(err));
    };

    const stopAlert = () => {
        videoFeed.current?.classList.remove("motion-alert");
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
                    src="http://localhost:8000/video_feed"
                    onClick={stopAlert}
                    onDoubleClick={toggleFullscreen}
                    onLoad={onCameraLoaded}
                    ref={videoFeed}
                />
            </div>
        </>
    );
};

export default VideoFeed;
