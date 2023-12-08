/**
 * TODO Maybe use a jsdom object instead of react dom for canvas objects. That way rendering can be more easily controlled.
 * 
 * 
 */


import { useEffect, useRef } from "react";
import { WidgetGroup } from "../Widget";
import { Colors } from "../WidgetSettings";

interface TimePlotArgs {
    values: number[]
    min?: number,
    max?: number,
    maxPoints?: number
};

interface Data {
    color: string,
    values: number[]
}

function getMinMax(values:number[]) {
    return values.reduce((prev, value) => ({
        min: Math.min(prev.min, value), 
        max: Math.max(prev.max, value)
    }), {min:Infinity, max:-Infinity});;
}


interface Line {
    color: string,
    values: number[]
}

interface TimePlotCanvas {
    mainCanvas: HTMLCanvasElement,
    mainCtx: CanvasRenderingContext2D|null,

    width: number,
    height: number,

    max: number|null,
    min: number|null,

    maxPoints: number,

    lines: Line[],
}
class TimePlotCanvas {
    constructor(width: number, height: number, maxPoints: number, lineAmount: number, colors: string[]) {
        this.mainCanvas = document.createElement("canvas");
        this.mainCtx = this.mainCanvas.getContext("2d");

        this.max = 1;
        this.min = -1;

        this.lines = [];

        this.maxPoints = maxPoints;

        this.setSize(width, height);

        for(let i = 0; i < lineAmount; i ++) {
            this.addLine(colors[i % colors.length]);
        }
    }

    setSize(width: number, height: number) {
        this.mainCanvas.width = this.width = width;
        this.mainCanvas.height = this.height = height;
    }

    addLine(color:string) {
        this.lines.push({
            color,
            values: []
        });
    }

    addValue(line: number, value: number) {
        this.lines[line].values.push(value);
        if(this.lines[line].values. length >= this.maxPoints) {
            this.lines[line].values.shift();
        }
    }



    repaint() {
        if(this.mainCtx == null) return;
        let ctx = this.mainCtx;

        let bounds = { min : -1, max: 1 };

        if(this.max == null || this.min == null) {
            const { min, max } = this.lines.reduce((prev, data) => {
                const { 
                    min: dataMin, 
                    max: dataMax 
                } = getMinMax(data.values);
    
                return { 
                    min: Math.min(prev.min, dataMin), 
                    max: Math.max(prev.max, dataMax)
                };
            }, {min: Infinity, max: -Infinity});

            bounds.min = min;
            bounds.max = max;
        }else {
            bounds.min = this.min;
            bounds.max = this.max;
        }

        
        const yAxisOffset = 30;
        const map = (value : { x:number, y:number }) => {
            return {
                x: (this.width - yAxisOffset) * value.x / 200 + yAxisOffset,
                y: this.height - this.height * (value.y - bounds.min) / (bounds.max - bounds.min) ,
            };
        }

        let origin = map({ x: 0, y: 0});


        ctx.clearRect(0, 0, this.width, this.height);
        
        ctx.strokeStyle = "#888888";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, origin.y);;
        ctx.lineTo(this.width, origin.y);
        ctx.stroke();



        this.lines.forEach((line) => {
            if(line.values.length > 1) {
                ctx.beginPath();
                let end = line.values.length - 1;
                let i = end;
                let mapped = map({x: i, y: line.values[i]});
                ctx.moveTo(mapped.x, mapped.y);
                for(; i >= 0; i--) {
                    mapped = map({x: i, y: line.values[i]});
                    ctx.lineTo(mapped.x, mapped.y);
                }
                ctx.lineWidth = 2;
                ctx.strokeStyle = line.color;
                ctx.stroke();
            }
        });
        
    }

}

export function TimePlot({values, min, max, maxPoints} : TimePlotArgs) {

    
    let width = 600;
    let height = 300;
    
    const colors = Object.values(Colors);
    const canvasRef = useRef<TimePlotCanvas>(new TimePlotCanvas(width, height, maxPoints ?? 200, values.length, colors));

    useEffect(() => {
        canvasRef.current.min = min ?? null;
        canvasRef.current.max = max ?? null;
    }, [min, max]);

    const valuesRef = useRef<number[]>(values);

    
    useEffect(() => {
        canvasRef.current.maxPoints = maxPoints ?? 200;
    }, [maxPoints])

    useEffect(() => {
        valuesRef.current = values;
    }, [values]);


    
    const widgetRef = useRef<HTMLDivElement|null>(null);


    useEffect(() => {
        const interval = setInterval(() => {
            // console.log(canvasRef.current.lines);
            valuesRef.current.forEach((value, i) => {
                canvasRef.current.addValue(i, value);
            });

            canvasRef.current.repaint();
        }, 10);
        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if(widgetRef.current == null) return;
        widgetRef.current.appendChild(canvasRef.current.mainCanvas);
    }, [widgetRef])

    return (<WidgetGroup title="Graph" ref={widgetRef}>
    </WidgetGroup>)
}
/*



    // REPAINT
    const repaint = () => {
        if(ctxRef.current === null) return;
        const ctx = ctxRef.current;
        const dataset = datasetRef.current;

        let bounds = {min: -1, max: 1};
        
        const getMinMaxDataset = () => {
            const {min, max} = dataset.reduce((prev, data) => {
                const { 
                    min: dataMin, 
                    max: dataMax 
                } = getMinMax(data.values);
    
                return { 
                    min: Math.min(prev.min, dataMin), 
                    max: Math.max(prev.max, dataMax)
                };
            }, {min: Infinity, max: -Infinity});
            return {
                min: min * 1.1,
                max: max * 1.1,
            };
        }

        if(minRef.current == null || maxRef.current == null) {
            const { min, max } = getMinMaxDataset();
            bounds.min = minRef.current ?? min;
            bounds.max = maxRef.current ?? max;
        }else {
            bounds.max = maxRef.current;
            bounds.min = minRef.current;
        }

        const map = (value : number, bounds: {min: number, max: number}) => {
            return height - height * (value - bounds.min) / (bounds.max - bounds.min) ;
        }

        // bounds = { min: -1, max: 1 };

        const tAxis = map(0, bounds);

        ctx.clearRect(0, 0, width, height);
        
        ctx.strokeStyle = "#888888";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, tAxis);
        ctx.lineTo(width, tAxis);
        ctx.stroke();


        dataset.forEach((data) => {
            if(data.values.length > 1) {
                ctx.beginPath();
                let end = data.values.length - 1;
                let x = width;
                let dx = width / maxPointsRef.current;
                let i = end;
                ctx.moveTo(x, map(data.values[i], bounds));
                for(; i >= 0; i--) {
                    ctx.lineTo(x, map(data.values[i], bounds));
                    x -= dx;
                }
                ctx.lineWidth = 2;
                ctx.strokeStyle = data.color;
                ctx.stroke();
            }
        });
    };

    useEffect(() => {
        if(canvasRef.current == null) return;
        canvasRef.current.height = height;
        canvasRef.current.width = width;
        
    }, [canvasRef, width, height]);

    useEffect(() => {
        if(canvasRef.current == null) return;
        const ctx = canvasRef.current.getContext("2d");
        if(ctx === null) return;

        ctxRef.current = ctx;
    }, [canvasRef]);

    useEffect(() => {
        const interval = setInterval(() => {
            const dataset = datasetRef.current;

            dataset.forEach((data, i) => {
                data.values.push(valuesRef.current[i]);
                if(data.values.length > maxPointsRef.current) data.values.shift();
            });
            console.log(dataset);

            repaint();
        }, 10);

        return () => {
            clearInterval(interval)
        };
    }, []);

    */