import { useContext, useState } from "react";
import PhysicalMarketCtx from "@contexts/PhysicalMarketCtx";
import DigitalMarketCtx from "@contexts/DigitalMarketCtx";
import { useCallback } from "react";
import { PublicKey } from "@solana/web3.js";

export function TransactionsPage(){
    const {physicalMarketClient} = useContext(PhysicalMarketCtx);
    const {digitalMarketClient} = useContext(DigitalMarketCtx);

    const [openPhysicalTransactions, setOpenPhysicalTransactions] = useState();
    const [openDigitalTransactions, setOpenDigitalTransactions] = useState();
    const [openServices, setOpenServices] = useState();

    const [pastPhysicalTransactions, setPastPhysicalTransactions] = useState();
    const [pastTransactions, setPastDigitalTransactions] = useState();
    const [pastServices, setPastServices] = useState();

    const GetOpenTransactions = useCallback(async ()=>{
        setOpenPhysicalTransactions(
            await physicalMarketClient.GetMultipleTransactions(
                await physicalMarketClient.GetOpenTransactionAddresses()
            )
        );

        let digital_txs = await digitalMarketClient.GetMultipleTransactions(
            await digitalMarketClient.GetOpenTransactionAddresses()
        );

        let prods = await digitalMarketClient.GetOpenTransactionsValues();

        console.log("products: ", prods);

        setOpenDigitalTransactions(
            digital_txs.filter((a, ind) => {
                return (prods[ind]["digital_type"]["Template"] != undefined)
            })
        );

        setOpenServices(
            digital_txs.filter((a, ind) => {
                return (prods[ind]["digital_type"]["Commission"] != undefined)
            })
        )
        
    },[physicalMarketClient, digitalMarketClient])

    const GetPastTransactions = useCallback(async ()=>{
        let [pastPhysTx, pastPhysTxProds] = await physicalMarketClient.GetClosedTransactionsProducts();
        let pastPhysProds = await this.physicalMarketClient.GetMultiplePhyiscalProducts(pastPhysTxProds);
        
        setPastPhysicalTransactions(
            pastPhysTx.map((tx_addr, ind) => {
                return {
                    tx_addr: tx_addr,
                    product: pastPhysProds[ind]
                }
            })
        );

        let [pastDigitalTxs, pastDigitalTxProds] = await digitalMarketClient.GetClosedTransactionsProducts();
        let pastDigitalProds = await this.digitalMarketClient.GetMultiplePhyiscalProducts(pastDigitalTxProds);

        pastDigitalTxs = pastDigitalTxs.map((tx_addr, ind) => {
            return {
                tx_addr: tx_addr,
                product: pastDigitalProds[ind]
            }
        })

        let pastDigitalProdsIDB = await this.digitalMarketClient.GetClosedTransactionsValues();


        setPastDigitalTransactions(
            pastDigitalTxs.filter((a, ind) => {
                return (pastDigitalProdsIDB[ind]["digital_type"]["Template"] != undefined)
            })
        );

        setPastServices(
            pastDigitalTxs.filter((a, ind) => {
                return (pastDigitalProdsIDB[ind]["digital_type"]["Commission"] != undefined)
            })
        )

        
    },[physicalMarketClient, digitalMarketClient])

}