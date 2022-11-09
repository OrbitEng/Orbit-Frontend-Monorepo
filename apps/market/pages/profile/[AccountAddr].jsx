import { ProfileLayout } from "@layouts/ProfileLayout";
import { GenericLayout } from "@layouts/HeaderFooterGenericLayout";
import { useRouter } from "next/router";

export default function AccountPage() {
	let router = useRouter();
	const { AccountAddr } = router.query;

	return(
		<GenericLayout chat>
			<ProfileLayout accountAddr={AccountAddr} />
		</GenericLayout>
	)
}