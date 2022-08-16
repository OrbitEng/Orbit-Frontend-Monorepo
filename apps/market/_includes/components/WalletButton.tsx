import { FC } from 'react'
import { WalletConnectButton } from '@solana/wallet-adapter-react-ui'
import { CreditCardIcon } from '@heroicons/react/outline'

// just using the credit card icon as a placeholder for other assets
export const WalletInteractionsButton: FC = () => {
	return(
		<div className="border-2 border-[#1A1A23] bg-transparent align-middle rounded-full flex flex-row m-auto px-2 py-1">
			<div className="flex bg-[#191922] p-1 text-white m-auto rounded-full">
				<CreditCardIcon className="h-3 w-3 text-white" />
			</div>
			<div className="flex text-white text-xs bg-transparent whitespace-nowrap m-auto">
				Connect Wallet
			</div>
		</div>
	)
}