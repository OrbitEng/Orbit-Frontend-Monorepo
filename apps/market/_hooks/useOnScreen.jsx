import { useEffect, useState, } from "react"

export default function useOnScreen(ref) {
	const [isIntersecting, setIntersecting] = useState(false)
	
	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => setIntersecting(entry.isIntersecting)
		)

		try {
			observer.observe(ref.current)
		} catch(e) {
			console.log(e)
		}
		return () => { observer.disconnect() }
	}, [])
  
	return isIntersecting
}