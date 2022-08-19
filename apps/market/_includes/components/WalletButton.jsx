import { WalletConnectButton } from '@solana/wallet-adapter-react-ui'
import { CreditCardIcon } from '@heroicons/react/outline'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { WalletDisconnectButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'

require('@solana/wallet-adapter-react-ui/styles.css');

// TODO: FIX THE WALLET IMPLEMENTATION HERE!
export function WalletInteractionsButton(props) {
	return(
		<button className="border-2 border-[#1A1A23] bg-transparent align-middle rounded-full flex flex-row mx-4 px-2 py-1 sm:py-2">
			<div className="flex bg-[#191922] p-1 text-white m-auto rounded-full">
				<CreditCardIcon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
			</div>
			<div>
				<WalletMultiButton />
				{/*
				<WalletDisconnectButton />
				*/}
			</div>
		</button>
	)
}