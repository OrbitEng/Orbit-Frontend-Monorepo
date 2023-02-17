import { useDropzone } from "react-dropzone";

export function PhysicalProductForm(props){
    
    return (
        <div >
            <div className="flex flex-col gap-y-6">
					<label htmlFor="description" className="text-white font-semibold text-xl">Stock</label>
					<input
						className="rounded-lg p-3 text-lg focus:outline-0 bg-[#171717] text-[#8E8E8E] placeholder:text-[#4E4E4E]"
						placeholder="Quantity"
						type="number"
						min="1"
						id="qty"
						name="qty"
						onChange={(e)=>{props.setMetaInf(metainf => {metainf.quantity = e.target.value; return metainf})}}
					/>
				</div>
				<div className="flex flex-col gap-y-6">
					<label htmlFor="description" className="text-white font-semibold text-xl">Delivery</label>
					<input
						className="rounded-lg p-3 text-lg focus:outline-0 bg-[#171717] text-[#8E8E8E] placeholder:text-[#4E4E4E]"
						placeholder="Delivery ETA"
						type="number"
						min="1"
						id="delivery"
						name="delivery"
						onChange={(e)=>{props.setMetaInf(metainf => {metainf.delivery = e.target.value; return metainf})}}
					/>
				</div>
        </div>
    )
}

export function DigitalProductForm(props){
	const [files, setFiles] = useState([]);
    const [fileName, setFileNames] = useState([]);

	const addFile = (acceptedFiles) => {
        acceptedFiles.forEach((fin)=>{
            const afr = new FileReader()
            afr.onload = () => {
                setFiles(cf => [...cf, afr.result]);
            }
            afr.readAsDataURL(fin);

            setFileNames(fn => [...fn, fin.name+fin.type]);
        });
	}

	const deleteFile = (filein)=>{
		let index = files.indexOf(filein);
		if(index == -1){
			return;
		}
		setFiles(cf => [...cf.slice(0,index), ...cf.slice(index+1)]);
        setFileNames(fn => [...fn.slice(0,index), ...fn.slice(index+1)]);
	}

	const {getRootProps, getInputProps, open} = useDropzone({onDrop: addFile});

    return (
        <div>
			<div className="flex flex-col gap-y-6">
				<label htmlFor="description" className="text-white font-semibold text-xl">Content Files</label>
				<div {...getRootProps()} className="overflow-x-auto w-full h-52 p-6 bg-[#100e13] rounded-lg border border-dashed">
					<input {...getInputProps()}/>
				</div>
			</div>
        </div>
    )
}

export function CommissionProductForm(props){
    return(
        <div>

        </div>
    )
}