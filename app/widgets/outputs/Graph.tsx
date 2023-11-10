import { useEffect, useRef } from "react";
import { Widget } from "../Widget";
import { Colors } from "../WidgetSettings";

interface LiveTimePlotArgs {
    values: number[]
    min?: number,
    max?: number,
    maxPoints?: number
};
interface LivePolarGraphArgs {
    values: {angle: number, radius: number}[]
    min?: number,
    max?: number,
    maxPoints?: number
};

interface TimePlotData {
    color: string,
    values: number[]
}

function getMinMax(values:number[]) {
    return values.reduce((prev, value) => ({
        min: Math.min(prev.min, value), 
        max: Math.max(prev.max, value)
    }), {min:Infinity, max:-Infinity});;
}

export function LiveTimePlot({values, min, max, maxPoints} : LiveTimePlotArgs) {

    let width = 600;
    let height = 300;

    const canvasRef = useRef<HTMLCanvasElement|null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D|null>(null);

    const minRef = useRef(min);
    const maxRef = useRef(max);

    useEffect(() => {
        minRef.current = min;
        maxRef.current = max;
    }, [min, max]);

    const valuesRef = useRef<number[]>(values);
    const maxPointsRef = useRef<number> (maxPoints ?? 200);


    const colors = Object.values(Colors);
    const initialDataset : TimePlotData[] = values.map((value, i) => ({
        color: colors[i % colors.length],
        values: [value]
    }));

    const datasetRef = useRef<TimePlotData[]>(initialDataset);
    // const chartRef = useRef<Chart>(null);

    
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
            // console.log(dataset);

            repaint();
        }, 10);

        return () => {
            clearInterval(interval)
        };
    }, []);

    useEffect(() => {
        maxPointsRef.current = maxPoints ?? 200;
    }, [maxPoints])

    useEffect(() => {
        valuesRef.current = values;
    }, [values]);

    return (<Widget title="Graph">
        <canvas ref={canvasRef}>

        </canvas>
    </Widget>)
}

interface PolarData {
    color: string,
    values: {
        angle: number,
        radius: number,
    }[]
};

export function LivePolarGraph({ values, max, maxPoints} : LivePolarGraphArgs) {

    let width = 300;
    let height = 300;

    const canvasRef = useRef<HTMLCanvasElement|null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D|null>(null);

    const maxRef = useRef(max);

    useEffect(() => {
        maxRef.current = max;
    }, [max]);

    const valuesRef = useRef(values);
    const maxPointsRef = useRef<number> (maxPoints ?? 200);


    const colors = Object.values(Colors);
    const initialDataset : PolarData[] = values.map((value, i) => ({
        color: colors[i % colors.length],
        values: [value]
    }));

    const datasetRef = useRef<PolarData[]>(initialDataset);
    // const chartRef = useRef<Chart>(null);

    
    // REPAINT
    const repaint = () => {
        if(ctxRef.current === null) return;
        const ctx = ctxRef.current;
        const dataset = datasetRef.current;

        let bounds = {max: 1};
        
        const getMinMaxDataset = () => {
            const {max} = dataset.reduce((prev, data) => {
                const { 
                    max: dataMax 
                } = getMinMax(data.values.map((value) => value.radius));
    
                return { 
                    max: Math.max(prev.max, dataMax)
                };
            }, {max: -Infinity});
            return {
                max: max * 1.1,
            };
        }

        if(maxRef.current == null) {
            const { max } = getMinMaxDataset();
            bounds.max = maxRef.current ?? max;
        }else {
            bounds.max = maxRef.current;
        }

        const map = (value : {angle:number, radius:number}, bounds: {max: number}) => {
            const sin = Math.sin(value.angle);
            const cos = Math.cos(value.angle);
            const unmappedX = sin * value.radius;
            const unmappedY = cos * value.radius;

            return {
                x: 0.5 * width * unmappedX / bounds.max + 0.5 * width,
                y: -0.5 * height * unmappedY / bounds.max  + 0.5 * height,
            };
            // return height - height * (value - bounds.min) / (bounds.max - bounds.min) ;
        }

        // bounds = { min: -1, max: 1 };


        ctx.clearRect(0, 0, width, height);
        
        ctx.strokeStyle = "#888888";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();


        dataset.forEach((data) => {
            if(data.values.length > 1) {
                ctx.beginPath();
                let end = data.values.length - 1;
                let i = end;
                let mapped = map(data.values[i], bounds)
                ctx.moveTo(mapped.x, mapped.y);
                for(; i >= 0; i--) {
                    mapped = map(data.values[i], bounds)
                    ctx.lineTo(mapped.x, mapped.y);
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

    useEffect(() => {
        maxPointsRef.current = maxPoints ?? 200;
    }, [maxPoints])

    useEffect(() => {
        valuesRef.current = values;
    }, [values]);

    return (<Widget title="Graph">
        <canvas ref={canvasRef}>

        </canvas>
    </Widget>)
}

interface PolarGraphArgs {
    data: PolarData[],
    max?: number,
    repaint: React.Ref<() => void>,
    width?: number,
    height?: number,
};

export function PolarGraph({ repaint }:PolarGraphArgs) {

    let width = 300;
    let height = 300;

    const canvasRef = useRef<HTMLCanvasElement|null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D|null>(null);

    const maxRef = useRef(max);

    useEffect(() => {
        maxRef.current = max;
    }, [max]);

    const valuesRef = useRef(values);
    const maxPointsRef = useRef<number> (maxPoints ?? 200);


    const colors = Object.values(Colors);
    const initialDataset : PolarData[] = values.map((value, i) => ({
        color: colors[i % colors.length],
        values: [value]
    }));

    const datasetRef = useRef<PolarData[]>(initialDataset);
    // const chartRef = useRef<Chart>(null);

    
    // REPAINT
    repaint.current = () => {
        if(ctxRef.current === null) return;
        const ctx = ctxRef.current;
        const dataset = datasetRef.current;

        let bounds = {max: 1};
        
        const getMinMaxDataset = () => {
            const {max} = dataset.reduce((prev, data) => {
                const { 
                    max: dataMax 
                } = getMinMax(data.values.map((value) => value.radius));
    
                return { 
                    max: Math.max(prev.max, dataMax)
                };
            }, {max: -Infinity});
            return {
                max: max * 1.1,
            };
        }

        if(maxRef.current == null) {
            const { max } = getMinMaxDataset();
            bounds.max = maxRef.current ?? max;
        }else {
            bounds.max = maxRef.current;
        }

        const map = (value : {angle:number, radius:number}, bounds: {max: number}) => {
            const sin = Math.sin(value.angle);
            const cos = Math.cos(value.angle);
            const unmappedX = sin * value.radius;
            const unmappedY = cos * value.radius;

            return {
                x: 0.5 * width * unmappedX / bounds.max + 0.5 * width,
                y: -0.5 * height * unmappedY / bounds.max  + 0.5 * height,
            };
            // return height - height * (value - bounds.min) / (bounds.max - bounds.min) ;
        }

        // bounds = { min: -1, max: 1 };


        ctx.clearRect(0, 0, width, height);
        
        ctx.strokeStyle = "#888888";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();


        dataset.forEach((data) => {
            if(data.values.length > 1) {
                ctx.beginPath();
                let end = data.values.length - 1;
                let i = end;
                let mapped = map(data.values[i], bounds)
                ctx.moveTo(mapped.x, mapped.y);
                for(; i >= 0; i--) {
                    mapped = map(data.values[i], bounds)
                    ctx.lineTo(mapped.x, mapped.y);
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

    return (<Widget title="Graph">
        <canvas ref={canvasRef}>

        </canvas>
    </Widget>)
}

// 1101
// 1001

// 1001