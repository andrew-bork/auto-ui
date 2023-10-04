import { useEffect, useRef } from "react";
import { Widget } from "../Widget";
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement} from "chart.js";
import { Colors } from "../WidgetSettings";
Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement);

interface TimePlotArgs {
    values: number[]
};


function range(start : number, end : number, step : number) {
    const out = [];
    for(let i = start; i < end; i += step) {
        out.push(i);
    }
    return out;
}

export function TimePlot({values} : TimePlotArgs) {
    let maxPoints = 200;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart>(null);
    const animRef = useRef(null);

    useEffect(() => {
        if(canvasRef.current == null) return;
        if(chartRef.current != null) return;
        canvasRef.current.height = 300;
        canvasRef.current.width = 600;
        
        const ctx = canvasRef.current.getContext("2d");
        if(ctx === null) return;

        

        const labels = range(-200, 0, 1);
        const data = {
        labels: labels,
        datasets: []
        };

        chartRef.current = new Chart(ctx, {
            type: "line",
            data: data,
            options: {
                animation: false,
                datasets: {
                    line: {
                        pointRadius: 0 // disable for all `'line'` datasets
                    }
                },
                spanGaps: true,
            }
        });

    }, [canvasRef]);

    useEffect(() => {
        if(chartRef.current == null) return;
        // chartRef.current.data.labels = range(-200, 0, 1);


        const colors = Object.values(Colors);

        let datasets = chartRef.current.data.datasets;
        for(let i = datasets.length; i < values.length; i ++) {
            datasets.push({
                label: "",
                fill: false,
                borderColor: colors[i],
                data: [],
                tension: 0,
                animation: false
            });
        }

        values.map((value, i) => {
            datasets[i].data.push(value)
            if(datasets[i].data.length > maxPoints) datasets[i].data.shift();
        });

        // chartRef.current.update();
        if(animRef.current == null){
            animRef.current = requestAnimationFrame(() => {
                const a = Date.now();
                chartRef.current.update();
                const elapse = Date.now() - a;
                // console.log(elapse);
                animRef.current = null;
            })
        }
    }, [values, maxPoints]);

    return (<Widget title="Graph">
        <canvas ref={canvasRef}>

        </canvas>
    </Widget>)
}