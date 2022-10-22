export function ClearBgButtonSmall(props){
    return(
        <button className={"bg-transparent h-[15px] w-[15px] rounded-full border-2 flex flex-row place-items-center"}>
            {
                props.checked ?
                <div className="h-[80%] w-full flex flex-col place-items-center">
                    <div className="rounded-full bg-white h-full w-[80%]"/>
                </div>:<></>
            }
        </button>
    )
}