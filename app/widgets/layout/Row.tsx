
interface LayoutArgs {
    children?: React.ReactElement|React.ReactElement[],
};

export function Row({ children } : LayoutArgs) {
    return <div style={{display: "flex", flexDirection: "row"}}>
        {children}
    </div>
}