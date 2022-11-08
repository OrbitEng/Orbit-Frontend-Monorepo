import { useContext, useState } from 'react'
import MatrixClientCtx from "@contexts/MatrixClientCtx"
import { WideGenericLayout } from '@layouts/HeaderFooterGenericLayout'
import FullScreenChat from '@includes/components/chat/FullScreen'

export default function chat(props) {
	return(
		<WideGenericLayout>
			<FullScreenChat/>
		</WideGenericLayout>
	)
}