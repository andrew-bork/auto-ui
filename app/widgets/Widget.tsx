import { LegacyRef, forwardRef } from "react"

interface WidgetArgs {
    children: React.ReactElement|React.ReactElement[],
    title: string,
};



/**
 * Base class for all Widgets.
 * 
 */
export const Widget = forwardRef(function Widget({ title, children } : WidgetArgs, ref : LegacyRef<HTMLDivElement>) {

    return (
        <div className="widget" ref={ref} style={
            {
                gridTemplateColumns: "100%",
                gridTemplateRows: `min-content auto`,
                margin: "10px",
                border: "1px solid #ffffff44",
                display: "inline-grid",
                borderRadius: "5px"
            }}>
            <div style={{
                borderBottom: "1px solid #ffffff44",
                padding: "10px"
            }}>
                <span style={{fontWeight: "bold"}}>{title}</span>
            </div>
            <div style={{padding: "10px"}}>

            {children}
            </div>
        </div>
    )
});
