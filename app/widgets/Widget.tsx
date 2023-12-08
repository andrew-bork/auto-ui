import { LegacyRef, forwardRef } from "react"

interface WidgetArgs {
    children: React.ReactElement|React.ReactElement[],
    title: string,
};

export const WidgetGroup = forwardRef(function Widget({ title, children } : WidgetArgs, ref : LegacyRef<HTMLDivElement>) {

    return (
        <div className="widget-group" ref={ref} style={
            {
                gridTemplateColumns: "100%",
                gridTemplateRows: `min-content auto`,
                margin: "8px",
                border: "1px solid #ffffff44",
                display: "inline-grid",
                borderRadius: "5px"
            }}>
            <div style={{
                borderBottom: "1px solid #ffffff44",
                padding: "8px"
            }}>
                <span style={{fontWeight: "bold"}}>{title}</span>
            </div>
            <div style={{padding: "8px"}}>

            {children}
            </div>
        </div>
    )
});

export const LabeledWidget = function ({ title, children } : WidgetArgs) {
    return (<div className="widget" style={
        {
            flexDirection: "column",

            margin: "8px",
            display: "inline-flex",
        }}>
        <div> {children} </div>
        <div>{title}</div>
    </div>)
}