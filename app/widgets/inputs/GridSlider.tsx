import { useState } from "react";
import { Widget } from "../Widget";
import { Colors } from "../WidgetSettings";
import Style from "./GridSlider.module.css";

interface GridSliderArgs {
    title?:string,
    values: Point[],
    setValue: (i: number, value: Point) => void,
    xbounds?: {min?: number, max?:number},
    ybounds?: {min?: number, max?:number},
};
interface Point {
    x: number, y: number
}

export function GridSlider({ title, values, setValue, xbounds, ybounds } : GridSliderArgs) {

    title ??= "";

    xbounds ??= { min: -1, max: 1};
    ybounds ??= { min: -1, max: 1};

    xbounds.min ??= -1;
    ybounds.min ??= -1;
    xbounds.max ??= 1;
    ybounds.max ??= 1;

    // let _values = [{x: 0, y:0}, {x: 1, y: 1}];

    // const [ values, setValues ] = useState(_values);

    let [ hovering, setHovering ] = useState(-1);
    let [ dragging, setDragging ] = useState(-1);

    const viewport = {
        width: 48,
        height: 48
    }


    const map = (value: Point) => {
        return {
            x: viewport.width * (value.x - xbounds.min) / (xbounds.max - xbounds.min),
            y: viewport.height * (1 - (value.y - ybounds.min) / (ybounds.max - ybounds.min)), 
        }
    }

    const unmap = (mapped: Point) => {
        return {
            x: xbounds.min + mapped.x * (xbounds.max - xbounds.min) / viewport.width,
            y: ybounds.min + (1 - mapped.y / viewport.height) * (ybounds.max - ybounds.min)
        }
    }

    const colors = Object.values(Colors);
    const ellipsePoints = values.map((value, i) => {

        let r = 1;
        if(hovering === i || dragging === i) {
            r = 1.1;
        }
        const mapped = map(value);

        return (<ellipse key={i}
            cx={mapped.x} cy={mapped.y} 
            rx={r} ry={r} 
            fill={colors[i % colors.length]} stroke="none" 
            onMouseEnter={() => {setHovering(i)}}
            onMouseLeave={() => {setHovering(-1)}}
            onMouseDown={() => {
                setDragging(i);
            }}
        />)
    });

    
    const mappedOrigin = map({x: 0, y: 0});
    const xAxis = (0 < mappedOrigin.y && mappedOrigin.y < viewport.height ? 
        <>
            <line x1={0} y1={mappedOrigin.y} x2={viewport.width} y2={mappedOrigin.y} stroke="#ffffff" strokeWidth={0.1}></line>
            <text x={1} y={mappedOrigin.y + 1} fontSize="2px" fill="#ffffff44" stroke="none" dominantBaseline="hanging">{xbounds.min.toFixed(1)}</text>
            <text x={viewport.width - 1} y={mappedOrigin.y + 1} fontSize="2px" fill="#ffffff44" stroke="none" dominantBaseline="hanging" textAnchor="end">{xbounds.max.toFixed(1)}</text>
        </>
        : <></>)
    const yAxis = (0 < mappedOrigin.x && mappedOrigin.x < viewport.width ? 
    <>
        <line x1={mappedOrigin.x} y1={0} x2={mappedOrigin.x} y2={viewport.height} stroke="#ffffff" strokeWidth={0.1}></line>
        <text x={mappedOrigin.x + 1} y={viewport.height - 1} fontSize="2px" fill="#ffffff44" stroke="none">{ybounds.min.toFixed(1)}</text>
        <text x={mappedOrigin.x + 1} y={ 1} fontSize="2px" fill="#ffffff44" stroke="none" dominantBaseline="hanging">{ybounds.max.toFixed(1)}</text>
    </>
        : <></>)


    return (<Widget title={title}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${viewport.width} ${viewport.height}`}  width="300px" height="300px"
            onMouseUp={() => {
                setDragging(-1);
            }}
            onMouseMove={(e) => {
                if(dragging !== -1) {
                    // console.log(e.pageX - rect.x - viewport.width / 2, e.pageY - rect.y - viewport.height / 2);
                    if(e.target.clientWidth !== 0 && e.target.clientHeight !== 0){
                        const rect = e.target.getBoundingClientRect();
                        const mapped = { x: viewport.width * (e.clientX - rect.left) / rect.width, y: viewport.height * (e.clientY - rect.top) / rect.height };
                        setValue(dragging, unmap(mapped));
                    }
                }
            }}
            >
            {xAxis}
            {yAxis}
            {ellipsePoints}
            <rect x={0} y={0} width={viewport.width} height={viewport.height} fill="none" stroke="#ffffff33" strokeWidth={0.3}></rect>
        </svg>
    </Widget>)

}