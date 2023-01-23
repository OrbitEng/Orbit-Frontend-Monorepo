import { GenericLayout } from "@layouts/HeaderFooterGenericLayout";
import {SignupForm} from "@includes/components/forms/SignupForm";

export default function Signup() {
	return(
		<GenericLayout>
			<SignupForm/>
		</GenericLayout>
	)
}