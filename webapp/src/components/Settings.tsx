import React, { useState } from "react";
import { PrimaryButton, Slider, Toggle } from "@fluentui/react";
import { useAppContext } from "../context/ContextProvider";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useEffect } from "react";

const Settings = (): JSX.Element => {
    const [notifPermission, setNotifPermission] = useState(false);

    const {
        filterState: {
            brightness,
            setBrightness,
            contrast,
            setContrast,
            nightVision,
            setNightVision,
        },
    } = useAppContext();

    useEffect(
        () => setNotifPermission(Notification.permission === "granted"),
        []
    );

    const onBrightnessChange = (value: number) => setBrightness(value);
    const onContrastChange = (value: number) => setContrast(value);
    const onToggleNightVision = (_: any, toggled?: boolean) =>
        setNightVision(toggled ?? false);

    const resetFilter = () => {
        setBrightness(0);
        setContrast(0);
        setNightVision(false);
    };

    const enableNotifications = () => {
        if (!notifPermission) {
            Notification.requestPermission().then((permission) => {
                setNotifPermission(permission === "granted");
            });
        }
    };

    return (
        <Container fluid="sm" className="mt-3 mb-5">
            <Row className="align-items-center justify-content-center">
                <Col xs={8}>
                    <Slider
                        label="Brightness"
                        min={-100}
                        max={100}
                        step={10}
                        value={brightness}
                        onChange={onBrightnessChange}
                        showValue
                        originFromZero
                    />
                </Col>

                <Col xs={3}>
                    <Toggle
                        label="Nightvision"
                        onText="On"
                        offText="Off"
                        onChange={onToggleNightVision}
                        checked={nightVision}
                    />
                </Col>

                <Col xs={8}>
                    <Slider
                        label="Contrast"
                        min={-100}
                        max={100}
                        step={10}
                        value={contrast}
                        onChange={onContrastChange}
                        showValue
                        originFromZero
                    />
                </Col>
                <Col xs={3}>
                    <PrimaryButton text="Reset" onClick={resetFilter} />
                </Col>

                {!notifPermission && (
                    <Col xs="auto" className="mt-4">
                        <PrimaryButton
                            text="Enable notifications"
                            onClick={enableNotifications}
                        />
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default Settings;
