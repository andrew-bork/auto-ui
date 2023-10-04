import { Widget } from "../Widget"

interface RangeSliderArgs {
    value: number,
    min?: number,
    max?: number,
    step?: number,
    title?: string,
    setValue: (newValue:number) => void,
};


export function HorizontalRangeSlider({value, setValue, min, max, title, step} : RangeSliderArgs) {
    // start ??= 0;
    min ??= 0;
    max ??= 1;
    step ??= 0.01;
    // gauge ??= "#5EE05C";
    // color ??= "#FFFFFFDD";
    title ??= "";
    // label ??= (Math.round(value * 10)*10).toFixed(0);


    return (<Widget title={title}>
        <input type="range" onChange={(e) => {setValue(parseFloat(e.target.value))}} min={min} max={max} value={value} step={step}/>
    </Widget>)
}