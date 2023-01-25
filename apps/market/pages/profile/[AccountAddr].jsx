import { ProfileLayout } from "@layouts/PageLayouts/ProfileLayout";
import { GenericLayout } from "@layouts/HeaderFooterGenericLayout";
import { useRouter } from "next/router";
import SemiSpanLayoutTemplate from "@includes/templates/Spans/SemiLayoutSpanTemplate";

export default function AccountPage() {
	let router = useRouter();
	const { AccountAddr } = router.query;

	return(
		<GenericLayout chat>
			<ProfileLayout accountAddr={AccountAddr} />
		</GenericLayout>
	)
}