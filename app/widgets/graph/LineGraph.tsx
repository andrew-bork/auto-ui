import { useEffect, useRef } from "react";
import { WidgetGroup } from "../Widget";


interface Bounds {
    min: number,
    max: number,
};

interface BoundsArgs {
    min?: number,
    max?: number,
};

interface Line {
    color: string,
    
}

interface LineGraphArgs {
    title?: string,

    width?: number,
    height?: number,


    xmin?: number,
    xmax?: number,
    
    ymin?: number,
    ymax?: number,



};

export function LineGraph(props : LineGraphArgs) {
    let title = props.title ?? "Line Graph";

    let width = props.width ?? 300;
    let height = props.height ?? 300;

    let xmin = props.xmin ?? -1;
    let xmax = props.xmax ?? 1;
    let ymin = props.ymin ?? -1;
    let ymax = props.ymax ?? 1;

    const canvasRef = useRef<HTMLCanvasElement|null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D|null>(null);



    useEffect(function sizeChanged() {
        if(canvasRef.current == null) return;

        canvasRef.current.width = width;
        canvasRef.current.height = height;

    }, [width, height, canvasRef]);




    useEffect(function repaint() {



    }, [width, height, ctxRef, xmin, xmax, ymin, ymax]);



    useEffect(function getContext() {
        if(canvasRef.current == null) return;
        ctxRef.current = canvasRef.current.getContext("2d");
    }, [canvasRef]);

    return (<WidgetGroup title={title}>
        <canvas ref={canvasRef}></canvas>
    </WidgetGroup>)
}