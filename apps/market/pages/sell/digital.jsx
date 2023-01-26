import { GenericLayout } from "@layouts/HeaderFooterGenericLayout";
import { DigitalUploadForm } from "@layouts/SellLayouts/DigitalSellLayout";

export default function sell() {
	return(
		<GenericLayout chat>
			<DigitalUploadForm />
		</GenericLayout>
	)
}