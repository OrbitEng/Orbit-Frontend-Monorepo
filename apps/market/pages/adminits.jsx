import { GenericLayout } from "@layouts/HeaderFooterGenericLayout"
import AdminLayout from "@layouts/PageLayouts/AdminLayout"

export default function adminits() {
	return (
		<GenericLayout>
			<AdminLayout/>
		</GenericLayout>
	)
}