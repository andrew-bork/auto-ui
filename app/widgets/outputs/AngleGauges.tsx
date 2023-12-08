import { WidgetGroup } from "../Widget";

interface GaugeArgs {
    value: number,
    start?: number,
    min?: number,
    max?: number,
    gauge?: string,
    color?: string,
    title?: string,
    label?: string,
    size?: number
}

export function HalfAngleGauge({ value, start, min, max, gauge, color, label, size } : GaugeArgs){

    start ??= 0;
    min ??= 0;
    max ??= 1;
    gauge ??= "#5EE05C";
    color ??= "#FFFFFFDD";
    label ??= (Math.round(value * 10)/10).toFixed(1);

    size ??= 1;
    const width = 128 * size;
    const height = 64 * size;

    const viewport = {
        width: 48,
        height: 24
    }

    const r = 20;
    const strokeWidth = 4;
    const gaugeColor = gauge;
    const textColor = color;

    const map = (value : number, min : number, max : number) => {
        value = (value - min) / (max - min);
        value = Math.min(Math.max(value, 0), 1);
        return value;
    }

    let percentStart = map(start, min, max);
    let percentEnd = map(value, min, max);

    const startPoint = {
        x: -r * Math.cos(percentStart * Math.PI) + viewport.width/2,
        y: viewport.height - r * Math.sin(percentStart * Math.PI),
    };

    const endPoint = {
        x: -r * Math.cos(percentEnd * Math.PI) + viewport.width/2,
        y: viewport.height - r * Math.sin(percentEnd * Math.PI),
    }
    const ccwFlag = (percentStart < percentEnd ? 1 : 0);

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${viewport.width} ${viewport.height}`} width={`${width}px`} height={`${height}px`}>
            <path d={`M ${startPoint.x} ${startPoint.y} A ${r} ${r} 0 0 ${ccwFlag} ${endPoint.x} ${endPoint.y}`} stroke={gaugeColor} fill="none" strokeWidth={strokeWidth}></path>
            <text fill={textColor} x={viewport.width/2} y={viewport.height -2} fontSize={viewport.height / 2} textAnchor="middle" fontVariant="tabular-nums">{label}</text>
        </svg>)
}



export function FullAngleGauge({ value, start, min, max, gauge, color, size, label } : GaugeArgs){

    start ??= 0;
    min ??= 0;
    max ??= 1;
    gauge ??= "#5EE05C";
    color ??= "#FFFFFFDD";
    label ??= (Math.round(value * 10)/10).toFixed(1);

    size ??= 1;
    const width = 128 * size;
    const height = 128 * size;

    const viewport = {
        width: 48,
        height: 48
    }

    const r = 20;
    const strokeWidth = 4;
    const gaugeColor = gauge;
    const textColor = color;

    const map = (value : number, min : number, max : number) => {
        value = 2 * (value - min) / (max - min) - 1;
        value = Math.min(Math.max(value, -1), 1);
        return value;
    }

    let percentStart = map(start, min, max);
    let percentEnd = map(value, min, max);

    const startPoint = {
        x: r * Math.sin(percentStart * Math.PI) + viewport.width/2,
        y: viewport.height/2 - r * Math.cos(percentStart * Math.PI),
    };

    const endPoint = {
        x: r * Math.sin(percentEnd * Math.PI) + viewport.width/2,
        y: viewport.height/2 - r * Math.cos(percentEnd * Math.PI),
    }
    const ccwFlag = (percentStart < percentEnd ? 1 : 0);

    return (<svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${viewport.width} ${viewport.height}`} width={`${width}px`} height={`${height}px`}>

            <path d={`M ${startPoint.x} ${startPoint.y} A ${r} ${r} 0 0 ${ccwFlag} ${endPoint.x} ${endPoint.y}`} stroke={gaugeColor} fill="none" strokeWidth={strokeWidth}></path>
            <text fill={textColor} x={viewport.width/2} y={viewport.height/2+1} fontSize={viewport.height / 4} dominantBaseline="middle" textAnchor="middle" fontVariant="tabular-nums">{label}</text>
        </svg>)
}

