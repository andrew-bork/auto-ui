import { ReactElement } from "react";

interface ColumnArgs {
    children?: ReactElement | ReactElement[];
}

export function Column({ children } : ColumnArgs ) {
    return (<div style={{display: "flex", flexDirection: "column", width: "fit-content"}}>
        {children}
    </div>);
}