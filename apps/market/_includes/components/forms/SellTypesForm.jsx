export function PhysicalProductForm(props){
    const [quantity, setQuantity] = useState(0);
    
    return (
        <div>
            <div className="flex flex-col gap-y-6">
					<label htmlFor="description" className="text-white font-semibold text-xl">Stock</label>
					<input
						className="rounded-lg p-3 text-lg focus:outline-0 bg-[#171717] text-[#8E8E8E] placeholder:text-[#4E4E4E]"
						placeholder="Quantity"
						type="number"
						min="1"
						id="qty"
						name="qty"
						onChange={(e)=>{setQuantity(e.target.value)}}
					/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="description" className="text-white font-semibold text-xl">Delivery</label>
					<input
						className="rounded-lg p-3 text-lg focus:outline-0 bg-[#171717] text-[#8E8E8E] placeholder:text-[#4E4E4E]"
						placeholder="Delivery ETA"
						type="number"
						min="1"
						id="delivery"
						name="delivery"
						onChange={(e)=>{setDelivery(e.target.value)}}
					/>
				</div>
        </div>
    )
}

export function DigitalProductForm(props){
    return (
        <div>

        </div>
    )
}

export function CommissionProductForm(props){
    return(
        <div>

        </div>
    )
}