import { GenericLayout } from "@layouts/HeaderFooterGenericLayout";
import { CommissionUploadForm } from "@layouts/SellLayouts/CommissionSellLayout";

export default function sell() {
	return(
		<GenericLayout chat>
			<CommissionUploadForm />
		</GenericLayout>
	)
}