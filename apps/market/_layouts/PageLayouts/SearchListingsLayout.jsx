import { LargeProductExplorer } from "@includes/components/product_display/LargeProductExplorer";
import { ProductShowcaseRow } from "@includes/components/product_display/ProductShowcaseRow";
import { FetchBucketCacheRoot, GenProductCacheAddress } from "orbit-clients/clients/SearchProgramClient";
import { useEffect, useState } from "react";

export function SearchSelectedCategoryLayout(props){
    const [matches, setMatches] = useState(props.matches);

    const [cachedBestProds, setCachedBestProds] = useState();
    const [recommendedSearches, setRecommendedSearches] = useState();
    const [allProds, setAllProds] = useState();

    const [allCacheProds, setAllCacheProds] = useState([]);

    useEffect(async ()=>{
        if(matches.exact){
            setAllCacheProds(cp => [...cp, ...matches.exact.prods])
        }
        for(let subCombos of props.matches.sub){
            
        }
        for(let [subBucketSize, subBucketKeywords] of [...Object.entries(props.matches.sup)]){

        }
    }, [matches])

    return(
        <div>
            <ProductShowcaseRow  title="Find Local Products" prod_type={props.category} addresses={recentPhysicals} searchable search_placeholder="Search in Local products"/>
            <LargeProductExplorer  displayOption={[displayOption, setDisplayOption]} items={listingsExplorerCategory} category={displayOption.toLowerCase()} />
        </div>
    )
}

export function SearchAllCategoriesLayout(props){

}