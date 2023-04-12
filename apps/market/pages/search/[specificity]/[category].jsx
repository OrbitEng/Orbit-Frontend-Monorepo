import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import UserAccountCtx from "@contexts/UserAccountCtx";
import { SEARCH_PROGRAM } from "orbit-clients";
import { FindByKeywords } from "orbit-clients/clients/SearchProgramClient";
import { GenericLayout } from "@layouts/HeaderFooterGenericLayout";
import { SearchAllCategoriesLayout, SearchSpecificCategoryLayout } from "@layouts/PageLayouts/SearchListingsLayout";

export function SearchResults(props){
    const router = useRouter();
	const query_info = router.query;

    const wallet = useWallet();
    const {userAccount} = useContext(UserAccountCtx);

    const [matches, setMatches] = useState({});

    useEffect(async ()=>{
        if(!(SEARCH_PROGRAM && SEARCH_PROGRAM.SEARCH_PROGRAM._provider.connection)){
            return
        }

        let category = query_info.category.toLowerCase();
        let kwds = query_info.kwds.split("+");

        switch(category){
            case "physical":
            case "digital":
            case "commission":
                setMatches(await FindByKeywords(kwds, category));
                break;
            default:
                setMatches(
                    await Promise.all(
                        ["physical", "digital", "commission"].map((category) => {
                            return FindByKeywords(kwds, category)
                        })
                    )
                );
                break;
        }

    },[SEARCH_PROGRAM.SEARCH_PROGRAM._provider.connection, wallet, userAccount, query_info, setMatches])

    return (
        <GenericLayout>
            {
             (query_info.category == "All" && <SearchSpecificCategoryLayout category={query_info.category}  />) ||
             (query_info.category == "All" && <SearchAllCategoriesLayout physical={matches[0]} digital={matches[1]} commission={matches[2]} />)
            }
        </GenericLayout>
    )
}