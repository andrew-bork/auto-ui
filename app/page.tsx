"use client"
import styles from './page.module.css'
import { FullAngleGauge, HalfAngleGauge } from './widgets/outputs/AngleGauges'
import { useEffect, useState } from 'react'

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

    // console.log(test);

    return (<main style={styles}>
        <HalfAngleGauge value={test} title="Roll" gauge="#665CE0"/>
        <HalfAngleGauge value={1 - test} title="Pitch" max={2}/>
        <HalfAngleGauge value={1 - test} title="Yaw" start={0.5}/>
        <HalfAngleGauge value={1 - test} title="Speed" start={0.2} min={-1} max={2}/>
        <FullAngleGauge value={test - 0.5} min={-0.5} max={0.5}/>
    </main>)
}
