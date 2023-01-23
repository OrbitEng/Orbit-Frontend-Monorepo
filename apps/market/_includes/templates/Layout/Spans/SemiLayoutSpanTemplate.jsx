export default function SemiSpanLayoutTemplate(props){
    return (
        <div className="max-w-6xl w-full h-full mx-auto overflow-hidden">
            {props.children}
        </div>
    )
}