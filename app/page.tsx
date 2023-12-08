"use client"
import styles from './page.module.css'
import { FullAngleGauge, HalfAngleGauge } from './widgets/outputs/AngleGauges'
import { useEffect, useState } from 'react'
import { HorizontalLinearGauge, VerticalLinearGauge } from './widgets/outputs/LinearGauges';
import { LabeledWidget, WidgetGroup } from './widgets/Widget';
import { HorizontalRangeSlider } from './widgets/inputs/LinearRangeSlider';

import { Colors } from "./widgets/WidgetSettings";
import { GridSlider } from './widgets/inputs/GridSlider';
import ArtificialHorizon from './widgets/other/ArtificialHorizon';
import { TimePlot } from './widgets/outputs/Graph';
import { Column } from './widgets/layout/Column';
import { Row } from './widgets/layout/Row';

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
        <Column>
            <HalfAngleGauge value={1 - test} title="Custom Bounds" start={0.2} min={-1} max={2}/>
            <FullAngleGauge value={test - 0.5} min={-0.5} max={0.5} title="Full Angle Gauge"/>
        </Column>
        <WidgetGroup title="Half Angle Gauges">
            <LabeledWidget title="Roll">
                <HalfAngleGauge value={test} title="Roll" gauge={Colors.blue} label={test.toFixed(1) + "°"}/>
            </LabeledWidget>
            <HalfAngleGauge value={1 - test} title="Pitch" max={2}/>
            <HalfAngleGauge value={1 - test} title="Yaw" start={0.5}/>
        </WidgetGroup>
        <HorizontalLinearGauge value={test} title="Horizontal Linear"/>
        <WidgetGroup title="Vertical Linear Gauges">
            <Row>
                <VerticalLinearGauge value={1 - test} title="x"/>
                <VerticalLinearGauge value={test + -0.5} title="y"/>
                <VerticalLinearGauge value={test * 0.5} title="z"/>
                <ArtificialHorizon roll={20 *test} pitch={60*test}/>
            </Row>
        </WidgetGroup>
        <WidgetGroup title="Linked Widgets">

            <WidgetGroup title="Linear Range Sliders">
                <div style={{display: "flex", flexDirection: "column"}}>
                    <HorizontalRangeSlider value={x} setValue={setX} title="x" min={-1} max={1}/>
                    <HorizontalRangeSlider value={y} setValue={setY} title="y" min={-1} max={1}/>
                </div>
            </WidgetGroup>
            <WidgetGroup title="Output">
                <VerticalLinearGauge value={x} title="x" min={-1} max={1}/>
                <VerticalLinearGauge value={y} title="y" min={-1} max={1}/>
                <VerticalLinearGauge value={x-y} min={-1} max={1} title="x - y" gauge={((x-y) < 0 ? Colors.red : Colors.green)}/>
                <VerticalLinearGauge value={Math.sqrt(x*x + y*y)} min={0} max={2} title="Distance" />
            </WidgetGroup>
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
        </WidgetGroup>
        <TimePlot values={[test, -(test-1)]} maxPoints={200} min={-1} max={2}/>
    </main>)
}
