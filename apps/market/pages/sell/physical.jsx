import { GenericLayout } from "@layouts/HeaderFooterGenericLayout";
import { PhysicalUploadForm } from "@layouts/SellLayouts/PhysicalSellLayout";

export default function sell() {
	return(
		<GenericLayout chat>
			<PhysicalUploadForm />
		</GenericLayout>
	)
}