import { useRouter } from "next/router";
import { 
	DigitalProductLayout,
	DigitalServiceLayout,
	PhysicalProductLayout,
} from "@layouts/ProductDisplays";

//dummy products
const dummyPhys

const dummyService

const dummyDigital = {

}

export default function ProductsPage(props) {
	const router = useRouter();
	const { productType, productId } = router.query;

	// fetch product somewhere in here from query

	return (
		<>
			{ !productType === "physical" || <PhysicalProductLayout id={productId} /> }
			{ !productType === "digital" || <DigitalProductLayout id={productId} /> }
			{ !productType === "service" || <DigitalServiceLayout product={} /> }
		</>
	)
}