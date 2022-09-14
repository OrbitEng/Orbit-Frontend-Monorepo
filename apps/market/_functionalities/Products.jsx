import { useContext, useState, useCallback } from "react";

import DigitalMarketCtx from "@contexts/DigitalMarketCtx";
import PhysicalMarketCtx from "@contexts/PhysicalMarketCtx";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";

export function DigitalProductFunctionalities(props){
    const {physicalMarketClient} = useContext(PhysicalMarketCtx);
    const {digitalMarketClient} = useContext(DigitalMarketCtx);
    const {marketAccountsClient} = useContext(MarketAccountsCtx);

}