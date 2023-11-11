"use client"
import styles from './page.module.css'
import { FullAngleGauge, HalfAngleGauge } from './widgets/outputs/AngleGauges'
import { useEffect, useState } from 'react'
import { HorizontalLinearGauge, VerticalLinearGauge } from './widgets/outputs/LinearGauges';
import { Widget } from './widgets/Widget';
import { HorizontalRangeSlider } from './widgets/inputs/LinearRangeSlider';

import { Colors } from "./widgets/WidgetSettings";
import { GridSlider } from './widgets/inputs/GridSlider';
import ArtificialHorizon from './widgets/other/ArtificialHorizon';
import { LivePolarGraph, LiveTimePlot } from './widgets/outputs/Graph';
import { Column } from './widgets/layout/Column';

import { io } from "socket.io-client";


/**
 * @typedef {{
 *      
 * }} DroneData
 * 
 * 
 * 
 * 
 * 
 */
export default function Home() {

    const RAD_TO_DEG = 180 / Math.PI;

    const [ data, setData ] = useState({
        adiru: {
            "mpu6050": {
                acceleration: { x: NaN, y: NaN, z: NaN },
                gyroscope: { x: NaN, y: NaN, z: NaN },
            },
            "filtered": {
                acceleration: { x: NaN, y: NaN, z: NaN },
                gyroscope: { x: NaN, y: NaN, z: NaN },
            },
            orientation_euler: { x: NaN, y: NaN, z: NaN },
            orientation: { w: NaN, x: NaN, y: NaN, z: NaN },
            settings: {
                tau: 0.5,
            },
        },
        throttle: 0.0,
        motors: {
            fl: 0.0, fr: 0.0, bl: 0.0, br: 0.0,
        }
    });

    useEffect(() => {
        const socket = io("http://localhost:2032");

        socket.on("data", (data) => {
            setData(data);
            // console.log(data);
        });

        return () => {
            socket.disconnect();
            // clearInterval(interval)
        };
    }, [])

    // console.log(test)-

    return (<main>
        <ArtificialHorizon roll={data.adiru.orientation_euler.x * RAD_TO_DEG} pitch={data.adiru.orientation_euler.y * RAD_TO_DEG} title="Primary"/>
        <LiveTimePlot values={[data.adiru.filtered.gyroscope.x * RAD_TO_DEG, data.adiru.mpu6050.gyroscope.x * RAD_TO_DEG]} min={-20} max={20}/>
        <Widget title="Orientation">
            <FullAngleGauge value={data.adiru.orientation_euler.x * RAD_TO_DEG} min={-180} max={180} title="Roll"/>
            <FullAngleGauge value={data.adiru.orientation_euler.y * RAD_TO_DEG} min={-180} max={180} title="Pitch"/>
            <FullAngleGauge value={data.adiru.orientation_euler.z * RAD_TO_DEG} min={-180} max={180} title="Yaw"/>
        </Widget>
        <Widget title="Motor Power">
            <Column>
                <HalfAngleGauge value={data.motors.fl} min={0} max={1} title="FL"/>
                <HalfAngleGauge value={data.motors.bl} min={0} max={1} title="BL"/>
            </Column>
            <Column>
                <HalfAngleGauge value={data.motors.fr} min={0} max={1} title="FR"/>
                <HalfAngleGauge value={data.motors.br} min={0} max={1} title="BR"/>
            </Column>
        </Widget>

        <Widget title="Raw Sensor Readings">
            <Widget title="Angular Velocity">
                <VerticalLinearGauge value={data.adiru.mpu6050.gyroscope.x * RAD_TO_DEG} min={-180} max={180} title="Roll"/>
                <VerticalLinearGauge value={data.adiru.mpu6050.gyroscope.y * RAD_TO_DEG} min={-180} max={180} title="Pitch"/>
                <VerticalLinearGauge value={data.adiru.mpu6050.gyroscope.z * RAD_TO_DEG} min={-180} max={180} title="Yaw"/>
            </Widget>
            <Widget title="Linear Acceleration">
                <VerticalLinearGauge value={data.adiru.mpu6050.acceleration.x} min={-20} max={20} title="X"/>
                <VerticalLinearGauge value={data.adiru.mpu6050.acceleration.y} min={-20} max={20} title="Y"/>
                <VerticalLinearGauge value={data.adiru.mpu6050.acceleration.z} min={-20} max={20} title="Z"/>
            </Widget>
        </Widget>

        <Widget title="Filtered Sensor Readings">
            <Widget title="Angular Velocity">
                <VerticalLinearGauge value={data.adiru.filtered.gyroscope.x * RAD_TO_DEG} min={-180} max={180} title="Roll"/>
                <VerticalLinearGauge value={data.adiru.filtered.gyroscope.y * RAD_TO_DEG} min={-180} max={180} title="Pitch"/>
                <VerticalLinearGauge value={data.adiru.filtered.gyroscope.z * RAD_TO_DEG} min={-180} max={180} title="Yaw"/>
            </Widget>
            <Widget title="Linear Acceleration">
                <VerticalLinearGauge value={data.adiru.filtered.acceleration.x} min={-20} max={20} title="X"/>
                <VerticalLinearGauge value={data.adiru.filtered.acceleration.y} min={-20} max={20} title="Y"/>
                <VerticalLinearGauge value={data.adiru.filtered.acceleration.z} min={-20} max={20} title="Z"/>
            </Widget>
        </Widget>
        <Widget title="Control Panel">
            <Column>
                <HorizontalRangeSlider value={0.0} setValue={(a) => {}} title="kP"/>
                <HorizontalRangeSlider value={data.throttle} setValue={(a) => {
                    fetch("http://localhost:2032/execute", {
                        method: "POST",    
                        body: JSON.stringify({
                            command: "set",
                            args: ["throttle", a]
                        }),
                        headers: {
                            "content-type": "application/json"
                        }
                    });
                }} title="Throttle"/>
                <HorizontalRangeSlider value={data.adiru.settings.tau} setValue={(a) => {
                    fetch("http://localhost:2032/execute", {
                        method: "POST",    
                        body: JSON.stringify({
                            command: "set",
                            args: ["adiru.settings.tau", a]
                        }),
                        headers: {
                            "content-type": "application/json"
                        }
                    });
                }} max={1} min={0} title="tau"/>
            </Column>
            <GridSlider values={[{x: 0, y: 0}]} setValue={(a) => {}} title="Axis 1, 2"/>
        </Widget>
    </main>)
}
