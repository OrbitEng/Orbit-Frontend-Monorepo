import { GenericLayout } from "@layouts/HeaderFooterGenericLayout";
import {SignupForm} from "@includes/components/SignupForm";

export default function Signup() {
	return(
		<GenericLayout>
			<div className="mt-10 mb-20">
				<SignupForm/>
			</div>
		</GenericLayout>
	)
}