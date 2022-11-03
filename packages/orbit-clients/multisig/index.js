import { PublicKey } from "@solana/web3.js";
const MULTISIG_WALLET_ADDRESS = new PublicKey("FH6S6pJtwdYXfRbPE3WXeiBxsqkVBXfAUM2K5WSXtsnU");
const MULTISIG_PROGRAM_ID = new PublicKey("CzfjryDjbvAcWfnFcFq2B8n4iqAueDZzo2dhHj5AUuJn");

const getMultisigWallet = () => {
    return PublicKey.findProgramAddressSync(
        [
            MULTISIG_WALLET_ADDRESS.toBuffer()
        ],
        MULTISIG_PROGRAM_ID
    )
}

export{
    MULTISIG_WALLET_ADDRESS,
    MULTISIG_PROGRAM_ID,
    getMultisigWallet
}