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
    minWidth?: string,

    size?: number
}

export function HorizontalLinearGauge({ value, start, min, max, gauge, color, title, label, size } : GaugeArgs){

    start ??= 0;
    min ??= 0;
    max ??= 1;
    gauge ??= "#5EE05C";
    color ??= "#FFFFFFDD";
    title ??= "";
    label ??= (Math.round(value * 10)/10).toFixed(1);

    size ??= 1;
    const width = 128 * size;
    const height = 24 * size;


    const viewport = {
        width: 64,
        height: 12
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
        x: percentStart  * viewport.width,
        y: 3,
    };

    const endPoint = {
        x: percentEnd * viewport.width,
        y: 3,
    }
    const ccwFlag = (percentStart < percentEnd ? 1 : 0);

    return (<svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${viewport.width} ${viewport.height}`} width={`${width}px`} height={`${height}px`}>

                <path d={`M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`} stroke={gaugeColor} fill="none" strokeWidth={strokeWidth}></path>
                <text fill={textColor} x={0} y={12} fontSize={5} dominantBaseline="bottom" textAnchor="start" fontVariant="tabular-nums">{label}</text>
            </svg>)
}



export function VerticalLinearGauge({ value, start, min, max, gauge, color, title, label, size, minWidth } : GaugeArgs){

    start ??= 0;
    min ??= 0;
    max ??= 1;
    gauge ??= "#5EE05C";
    color ??= "#FFFFFFDD";
    title ??= "";
    label ??= (Math.round(value * 10)/10).toFixed(1);
    minWidth ??= "60px";


    size ??= 1;
    const width = 16 * size;
    const height = 128 * size;

    const viewport = {
        width: 8,
        height: 64
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
        x: viewport.width / 2,
        y: (1 - percentStart) * viewport.height,
    };

    const endPoint = {
        x: viewport.width / 2,
        y: (1 - percentEnd) * viewport.height,
    }

    return (
        <div style={{display: "inline-flex", alignItems:"flex-end", minWidth: minWidth}}  >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${viewport.width} ${viewport.height}`} width={`${width}px`} height={`${height}px`}>

                <path d={`M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`} stroke={gaugeColor} fill="none" strokeWidth={strokeWidth}></path>
            </svg>
            <div style={{marginLeft:"5px", fontVariantNumeric: "tabular-nums"}}>{label}</div>
        </div>
        )
}

