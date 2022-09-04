import { useRouter } from "next/router";
import { DigitalProductLayout } from "@layouts/DigitalProduct";

export default function ProductsPage() {
	const router = useRouter();
	const { productId } = router.query;

	return (<DigitalProductLayout /> )
}