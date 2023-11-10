
interface LayoutArgs {
    children?: React.ReactElement|React.ReactElement[],
};

export function Column({ children } : LayoutArgs) {
    return <div style={{display: "flex", flexDirection: "column"}}>
        {children}
    </div>
}