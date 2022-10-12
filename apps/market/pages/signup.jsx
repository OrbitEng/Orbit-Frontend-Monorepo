import { GenericLayout } from "@layouts/HeaderFooterGenericLayout";
import {SignupForum} from "@includes/components/SignupForum";

export default function Signup() {
	return(
		<GenericLayout>
			<div className="mt-10 mb-20">
				<SignupForum/>
			</div>
		</GenericLayout>
	)
}