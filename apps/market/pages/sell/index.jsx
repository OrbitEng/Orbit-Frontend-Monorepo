import { GenericLayout } from "@layouts/HeaderFooterGenericLayout";
import { SellLayout } from "@layouts/SellLayouts/BaseSellLayout";

export default function sell() {
	return(
		<GenericLayout chat>
			<SellLayout />
		</GenericLayout>
	)
}