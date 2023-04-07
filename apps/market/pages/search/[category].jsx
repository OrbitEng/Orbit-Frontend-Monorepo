import { useRouter } from "next/router";

export function SearchResults(props){
    const router = useRouter();
	const { productType, productId } = router.query;
}