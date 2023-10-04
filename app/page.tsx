"use client"
import styles from './page.module.css'
import { FullAngleGauge, HalfAngleGauge } from './widgets/outputs/AngleGauges'
import { useEffect, useState } from 'react'
import { HorizontalLinearGauge, VerticalLinearGauge } from './widgets/outputs/LinearGauges';
import { Widget } from './widgets/Widget';
import { HorizontalRangeSlider } from './widgets/inputs/LinearRangeSlider';

import { Colors } from "./widgets/WidgetSettings";
import { GridSlider } from './widgets/inputs/GridSlider';
import PrimaryFlightDisplay from './widgets/other/PrimaryFlightDisplay';

export default function Home() {

    const [ test, setTest ] = useState(0);

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            // console.log(i);
            setTest((Math.sin(i) * 0.5) + 0.5);

            i += 0.05;
        }, 10);

        return () => {
            clearInterval(interval)
        };
    }, [])

    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    // console.log(test);

    return (<main style={styles}>
        <Widget title="Half Angle Gauges">
            <HalfAngleGauge value={test} title="Roll" gauge={Colors.blue}/>
            <HalfAngleGauge value={1 - test} title="Pitch" max={2}/>
            <HalfAngleGauge value={1 - test} title="Yaw" start={0.5}/>
        </Widget>
        <HalfAngleGauge value={1 - test} title="Custom Bounds" start={0.2} min={-1} max={2}/>
        <FullAngleGauge value={test - 0.5} min={-0.5} max={0.5} title="Full Angle Gauge"/>
        <HorizontalLinearGauge value={test} title="Horizontal Linear"/>
        <Widget title="Vertical Linear Gauges">
            <VerticalLinearGauge value={1 - test} title="x"/>
            <VerticalLinearGauge value={test + -0.5} title="y"/>
            <VerticalLinearGauge value={test * 0.5} title="z"/>
        </Widget>
        <Widget title="Linked Widgets">
            <Widget title="Linear Range Sliders">
                <div style={{display: "flex", flexDirection: "column"}}>
                    <HorizontalRangeSlider value={x} setValue={setX} title="x" min={-1} max={1}/>
                    <HorizontalRangeSlider value={y} setValue={setY} title="y" min={-1} max={1}/>
                </div>
            </Widget>
            <Widget title="Output">
                <VerticalLinearGauge value={x} title="x" min={-1} max={1}/>
                <VerticalLinearGauge value={y} title="y" min={-1} max={1}/>
                <VerticalLinearGauge value={x-y} min={-1} max={1} title="x - y" gauge={((x-y) < 0 ? Colors.red : Colors.green)}/>
                <VerticalLinearGauge value={Math.sqrt(x*x + y*y)} min={0} max={2} title="Distance" />
            </Widget>
            <GridSlider title="Grid Slider" 
                values={[{x: x, y: y}]} 
                setValue={(i, value) => {
                    setX(value.x);
                    setY(value.y);
                }}
                xbounds={{
                    min: -1.5,
                    max: 1.5
                }}
            />
            {/* <PrimaryFlightDisplay roll={x * 30} pitch={y * 30}/> */}
        </Widget>
    </main>)
}
