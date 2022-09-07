import { useRouter } from "next/router";
import { 
	DigitalProductLayout,
	DigitalServiceLayout,
	PhysicalProductLayout,
} from "@layouts/ProductDisplays";

export default function ProductsPage(props) {
	const router = useRouter();
	const { productType, productId } = router.query;

	return (
		<>
			{ !productType === "physical" || <PhysicalProductLayout id={productId} /> }
			{ !productType === "digital" || <DigitalProductLayout id={productId} /> }
			{ !productType === "service" || <DigitalServiceLayout id={productId} /> }
		</>
	)
}