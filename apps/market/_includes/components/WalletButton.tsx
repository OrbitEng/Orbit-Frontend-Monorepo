import { FC } from 'react'
import { WalletConnectButton } from '@solana/wallet-adapter-react-ui'
import { CreditCardIcon } from '@heroicons/react/outline'

// just using the credit card icon as a placeholder for other assets
export const WalletInteractionsButton: FC = () => {
	return(
		<div className="border-2 border-[#1A1A23] bg-transparent align-middle rounded-full flex flex-row mx-4 px-2 py-1 sm:py-2">
			<div className="flex bg-[#191922] p-1 text-white m-auto rounded-full">
				<CreditCardIcon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
			</div>
			<div className="flex text-white font-semibold text-xs sm:text-sm sm:ml-1 bg-transparent whitespace-nowrap m-auto">
				Connect Wallet
			</div>
		</div>
	)
}