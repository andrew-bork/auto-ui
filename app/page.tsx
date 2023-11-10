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

export default function Home() {

    useEffect(() => {
        let i = 0;

        return () => {
            // clearInterval(interval)
        };
    }, [])

    // console.log(test)-

    return (<main>
        <ArtificialHorizon roll={10} pitch={20} title="Primary"/>
        <LiveTimePlot values={[]} min={-5} max={5}/>
        <Widget title="Orientation">
            <FullAngleGauge value={-10} min={-180} max={180} title="Roll"/>
            <FullAngleGauge value={-20} min={-180} max={180} title="Pitch"/>
            <FullAngleGauge value={10} min={-180} max={180} title="Yaw"/>
        </Widget>
        <Widget title="Motor Power">
            <Column>
                <HalfAngleGauge value={0.1} min={0} max={1} title="FL"/>
                <HalfAngleGauge value={0.1} min={0} max={1} title="BL"/>
            </Column>
            <Column>
                <HalfAngleGauge value={0.1} min={0} max={1} title="FR"/>
                <HalfAngleGauge value={0.1} min={0} max={1} title="BR"/>
            </Column>
        </Widget>

        <Widget title="Raw Sensor Readings">
            <Widget title="Angular Velocity">
                <VerticalLinearGauge value={10} min={-180} max={180} title="Roll"/>
                <VerticalLinearGauge value={20} min={-180} max={180} title="Pitch"/>
                <VerticalLinearGauge value={-10} min={-180} max={180} title="Yaw"/>
            </Widget>
            <Widget title="Linear Acceleration">
                <VerticalLinearGauge value={-0.1} min={-20} max={20} title="X"/>
                <VerticalLinearGauge value={0.1} min={-20} max={20} title="Y"/>
                <VerticalLinearGauge value={10} min={-20} max={20} title="Z"/>
            </Widget>
        </Widget>
        <Widget title="Control Panel">
            <Column>
                <HorizontalRangeSlider value={0.0} setValue={(a) => {}} title="kP"/>
                <HorizontalRangeSlider value={0.0} setValue={(a) => {}} title="Throttle"/>
                <HorizontalRangeSlider value={0.0} setValue={(a) => {}} title="kP"/>
            </Column>
            <GridSlider values={[{x: 0, y: 0}]} setValue={(a) => {}} title="Axis 1, 2"/>
        </Widget>
    </main>)
}
