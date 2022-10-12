import { SellerAccountDisplay } from "@includes/SellerAccountDisplay";
import { GenericLayout } from "@layouts/HeaderFooterGenericLayout";
import { useRouter } from "next/router";

export default function SellerPage() {
	let router = useRouter();
	const { sellerAccountAddr } = router.query;

	return(
		<GenericLayout>
			<SellerAccountDisplay items={["bruh"]} sellerAddr={sellerAccountAddr} />
		</GenericLayout>
	)
}