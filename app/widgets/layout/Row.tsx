import { ReactElement } from "react";

interface RowArgs {
    children?: ReactElement | ReactElement[];
}

export function Row({ children } : RowArgs ) {
    return (<div style={{display: "flex", flexDirection: "row", height: "fit-content"}}>
        {children}
    </div>);
}