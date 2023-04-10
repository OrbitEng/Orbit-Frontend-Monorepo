import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import UserAccountCtx from "@contexts/UserAccountCtx";
import { SEARCH_PROGRAM } from "orbit-clients";
import { FindByKeywords } from "orbit-clients/clients/SearchProgramClient";

export function SearchResults(props){
    const router = useRouter();
	const query_info = router.query;

    const wallet = useWallet();
    const {userAccount} = useContext(UserAccountCtx);

    const [prods, setProds] = useState([]);

    useEffect(()=>{
        if(!(SEARCH_PROGRAM && SEARCH_PROGRAM.SEARCH_PROGRAM._provider.connection)){
            return
        }

        let category = query_info.category.toLowerCase();
        let kwds = query_info.kwds.split("+");

        let matches = {};

        switch(category){
            case "physical":
            case "digital":
            case "commission":
                matches = FindByKeywords(kwds, category)
                break;
            default:
                matches = FindByKeywords(kwds, category)
        }

    },[SEARCH_PROGRAM.SEARCH_PROGRAM._provider.connection, wallet, userAccount, query_info])
}