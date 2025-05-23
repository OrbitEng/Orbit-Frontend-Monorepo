import { useEffect, useState, } from "react"

export default function useOnScreen(ref) {
	const [isIntersecting, setIntersecting] = useState(false)
	
	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => setIntersecting(entry.isIntersecting)
		)

		ref.current && observer.observe(ref.current)
		return () => { observer.disconnect() }
	}, [])
  
	return isIntersecting
}