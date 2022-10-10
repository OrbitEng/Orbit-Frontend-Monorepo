import { SellerAccountDisplay } from "@includes/SellerAccountDisplay";
import { GenericLayout } from "@layouts/HeaderFooterGenericLayout";

export default function SellerPage() {
	return(
		<GenericLayout>
			<SellerAccountDisplay />
		</GenericLayout>
	)
}