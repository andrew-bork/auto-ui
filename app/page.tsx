"use client"
import styles from './page.module.css'
import { FullAngleGauge, HalfAngleGauge } from './widgets/outputs/AngleGauges'
import { useEffect, useState } from 'react'
import { HorizontalLinearGauge, VerticalLinearGauge } from './widgets/outputs/LinearGauges';
import { Widget } from './widgets/internals/Widget';
import { HorizontalRangeSlider } from './widgets/inputs/LinearRangeSlider';

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
        <Widget title="Orientation">
            <HalfAngleGauge value={test} title="Roll" gauge="#665CE0"/>
            <HalfAngleGauge value={1 - test} title="Pitch" max={2}/>
            <HalfAngleGauge value={1 - test} title="Yaw" start={0.5}/>
        </Widget>
        <HalfAngleGauge value={1 - test} title="Speed" start={0.2} min={-1} max={2}/>
        <FullAngleGauge value={test - 0.5} min={-0.5} max={0.5}/>
        <HorizontalLinearGauge value={test} title="Vroom"/>
        <Widget title="Acceleration">
            <VerticalLinearGauge value={1 - test} title="x"/>
            <VerticalLinearGauge value={test + -0.5} title="y"/>
            <VerticalLinearGauge value={test * 0.5} title="z"/>
        </Widget>
        <Widget title="Controls">
            <HorizontalRangeSlider value={x} setValue={setX} title="x"/>
            <HorizontalRangeSlider value={y} setValue={setY} title="y"/>
        </Widget>
        <Widget title="Output">
            <VerticalLinearGauge value={x} title="x"/>
            <VerticalLinearGauge value={y} title="y"/>
            <VerticalLinearGauge value={x-y} min={-1} max={1} title="x-y" gauge={((x-y) < 0 ? "#E05C5C" : "#5EE05C")}/>
        </Widget>
    </main>)
}
