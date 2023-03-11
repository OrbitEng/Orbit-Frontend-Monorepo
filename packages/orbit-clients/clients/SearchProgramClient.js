import * as anchor from '@coral-xyz/anchor';
import {PublicKey} from "@solana/web3.js";
import {PRODUCT_PROGRAM_ID} from "./OrbitProductClient";
import { GenListingsAddress, GenProductAddress } from './OrbitProductClient';
import { GetMultipleDigitalProducts } from './OrbitProductClient';
import { GetMultipleCommissionProducts } from './OrbitProductClient';
import { rpc } from '@coral-xyz/anchor/dist/cjs/utils';

const idl = require("../idls/orbit_search");

export var SEARCH_PROGRAM_ID = new PublicKey(idl.metadata.address);
export var SEARCH_PROGRAM = new anchor.Program(idl, idl.metadata.address, {});

export function SetProgramWallet(prov){
    SEARCH_PROGRAM = new anchor.Program(idl, idl.metadata.address, prov);
}

///////////////////////////////////////////////////////////////
/// PRODUCT QUEUES

/// PHYSICAL

export async function InitPhysicalProductCache (kwds, product_addr, market_account, payer_wallet){
    kwds = kwds.toLowerCase();
    kwds.sort();
    return SEARCH_PROGRAM.methods.initPhysicalBucketCache(kwds)
    .accounts({
        initBucket: GenProductCacheAddress(kwds, "physical"),
        product: typeof product_addr == "string" ? new PublicKey(product_addr) : product_addr,
        marketAccount: typeof market_account == "string" ? new PublicKey(market_account) : market_account,
        payer: payer_wallet.publicKey
    })
    .instruction()
}
export async function PopulatePhysicalProductCache (kwds, product_addr, market_account, payer_wallet){
    kwds = kwds.map((w)=>w.toLowerCase());
    kwds.sort();
    return SEARCH_PROGRAM.methods.populatePhysicalProductCache()
    .accounts({
        bucketCache: GenProductCacheAddress(kwds, "physical"),
        product: typeof product_addr == "string" ? new PublicKey(product_addr) : product_addr,
        marketAccount: typeof market_account == "string" ? new PublicKey(market_account) : market_account,
        payer: payer_wallet.publicKey,
        productProgram: PRODUCT_PROGRAM_ID
    })
    .instruction()
}
export async function SyncPhysicalProductCache (kwds){
    kwds = kwds.map((w)=>w.toLowerCase());
    kwds.sort();
    let cache_addr = GenProductCacheAddress(kwds, "physical");
    let cache_node = (await FetchBucketCacheRoot(cache_addr)).data.slice(53);
    let remaining_accs = [];
    for(let i = 0; i < 25; i++ ){
        let vendor_listings_addr = GenListingsAddress("physical", new anchor.BN(cache_node.slice((13*i)+4,(13*i)+12)));
        remaining_accs.push(GenProductAddress(new anchor.BN(cache_node.slice(0,4)), vendor_listings_addr, "physical"));
    }
    return SEARCH_PROGRAM.methods.syncPhysicalBucketCache()
    .accounts({
        bucketCache: cache_addr,
    })
    .remainingAccounts(remaining_accs)
    .instruction()
}
export async function UpdatePhysicalProductCache (kwds, product_addr){
    kwds = kwds.map((w)=>w.toLowerCase());
    kwds.sort();
    return SEARCH_PROGRAM.methods.updatePhysicalBucketCache()
    .accounts({
        bucketCache: GenProductCacheAddress(kwds, "physical"),
        product: typeof product_addr == "string" ? new PublicKey(product_addr) : product_addr,
    })
    .instruction()
}

export async function InitPhysicalBucketQueue (kwds, product_addr, market_account, payer_wallet){
    kwds = kwds.map((w)=>w.toLowerCase());
    kwds.sort();
    return SEARCH_PROGRAM.methods.initPhysicalBucketQueue(kwds)
    .accounts({
        bucketQueue: GenProductQueueAddress(kwds, "physical"),
        bucketRoot: GenProductCacheAddress(kwds, "physical"),
        product: typeof product_addr == "string" ? new PublicKey(product_addr) : product_addr,
        marketAccount: typeof market_account == "string" ? new PublicKey(market_account) : market_account,
        payer: payer_wallet.publicKey
    })
    .instruction()
}
export async function AddPhysicalProductQueue (kwds, product_addr, market_account, payer_wallet){
    kwds = kwds.map((w)=>w.toLowerCase());
    kwds.sort();
    return SEARCH_PROGRAM.methods.addPhysicalProductQueue()
    .accounts({
        bucketQueue: GenProductQueueAddress(kwds, "physical"),
        product: typeof product_addr == "string" ? new PublicKey(product_addr) : product_addr,
        marketAccount: typeof market_account == "string" ? new PublicKey(market_account) : market_account,
        payer: payer_wallet.publicKey,
        productProgram: PRODUCT_PROGRAM_ID
    })
    .instruction()
}

export async function DrainPhysicalQueue (kwds, arweave_url){
    kwds = kwds.map((w)=>w.toLowerCase());
    kwds.sort();
    if((typeof arweave_url != "string") || (arweave_url.length != 43)){
        return ""
    }
    return SEARCH_PROGRAM.methods.drainPhysicalQueue(kwds, arweave_url)
    .accounts({
        bucketCache: GenProductCacheAddress(kwds, "physical"),
        bucketQueue: GenProductQueueAddress(kwds, "physical")
    })
    .instruction()
}

/// DIGITAL

export async function InitDigitalProductCache (kwds, product_addr, market_account, payer_wallet){
    kwds = kwds.toLowerCase();
    kwds.sort();
    return SEARCH_PROGRAM.methods.initDigitalBucketCache(kwds)
    .accounts({
        initBucket: GenProductCacheAddress(kwds, "digital"),
        product: typeof product_addr == "string" ? new PublicKey(product_addr) : product_addr,
        marketAccount: typeof market_account == "string" ? new PublicKey(market_account) : market_account,
        payer: payer_wallet.publicKey
    })
    .instruction()
}
export async function PopulateDigitalProductCache (kwds, product_addr, market_account, payer_wallet){
    kwds = kwds.map((w)=>w.toLowerCase());
    kwds.sort();
    return SEARCH_PROGRAM.methods.populateDigitalProductCache()
    .accounts({
        bucketCache: GenProductCacheAddress(kwds, "digital"),
        product: typeof product_addr == "string" ? new PublicKey(product_addr) : product_addr,
        marketAccount: typeof market_account == "string" ? new PublicKey(market_account) : market_account,
        payer: payer_wallet.publicKey,
        productProgram: PRODUCT_PROGRAM_ID
    })
    .instruction()
}
export async function SyncDigitalProductCache (kwds){
    kwds = kwds.map((w)=>w.toLowerCase());
    kwds.sort();
    let cache_addr = GenProductCacheAddress(kwds, "digital");
    let cache_node = (await FetchBucketCacheRoot(cache_addr)).data.slice(53);
    let remaining_accs = [];
    for(let i = 0; i < 25; i++ ){
        let vendor_listings_addr = GenListingsAddress("digital", new anchor.BN(cache_node.slice((13*i)+4,(13*i)+12)));
        remaining_accs.push(GenProductAddress(new anchor.BN(cache_node.slice(0,4)), vendor_listings_addr, "digital"));
    }
    return SEARCH_PROGRAM.methods.syncDigitalBucketCache()
    .accounts({
        bucketCache: cache_addr,
    })
    .remainingAccounts(remaining_accs)
    .instruction()
}
export async function UpdateDigitalProductCache (kwds, product_addr){
    kwds = kwds.map((w)=>w.toLowerCase());
    kwds.sort();
    return SEARCH_PROGRAM.methods.updateDigitalBucketCache()
    .accounts({
        bucketCache: GenProductCacheAddress(kwds, "digital"),
        product: typeof product_addr == "string" ? new PublicKey(product_addr) : product_addr,
    })
    .instruction()
}

export async function InitDigitalBucketQueue (kwds, product_addr, market_account, payer_wallet){
    kwds = kwds.map((w)=>w.toLowerCase());
    kwds.sort();
    return SEARCH_PROGRAM.methods.initDigitalBucketQueue(kwds)
    .accounts({
        bucketQueue: GenProductQueueAddress(kwds, "digital"),
        bucketRoot: GenProductCacheAddress(kwds, "digital"),
        product: typeof product_addr == "string" ? new PublicKey(product_addr) : product_addr,
        marketAccount: typeof market_account == "string" ? new PublicKey(market_account) : market_account,
        payer: payer_wallet.publicKey
    })
    .instruction()
}
export async function AddDigitalProductQueue (kwds, product_addr, market_account, payer_wallet){
    kwds = kwds.map((w)=>w.toLowerCase());
    kwds.sort();
    return SEARCH_PROGRAM.methods.addDigitalProductQueue()
    .accounts({
        bucketQueue: GenProductQueueAddress(kwds, "digital"),
        product: typeof product_addr == "string" ? new PublicKey(product_addr) : product_addr,
        marketAccount: typeof market_account == "string" ? new PublicKey(market_account) : market_account,
        payer: payer_wallet.publicKey,
        productProgram: PRODUCT_PROGRAM_ID
    })
    .instruction()
}

export async function DrainDigitalQueue (kwds, arweave_url){
    kwds = kwds.map((w)=>w.toLowerCase());
    kwds.sort();
    if((typeof arweave_url != "string") || (arweave_url.length != 43)){
        return ""
    }
    return SEARCH_PROGRAM.methods.drainDigitalQueue(kwds, arweave_url)
    .accounts({
        bucketCache: GenProductCacheAddress(kwds, "digital"),
        bucketQueue: GenProductQueueAddress(kwds, "digital")
    })
    .instruction()
}

/// COMMISSION

export async function InitCommissionProductCache (kwds, product_addr, market_account, payer_wallet){
    kwds = kwds.toLowerCase();
    kwds.sort();
    return SEARCH_PROGRAM.methods.initCommissionBucketCache(kwds)
    .accounts({
        initBucket: GenProductCacheAddress(kwds, "commission"),
        product: typeof product_addr == "string" ? new PublicKey(product_addr) : product_addr,
        marketAccount: typeof market_account == "string" ? new PublicKey(market_account) : market_account,
        payer: payer_wallet.publicKey
    })
    .instruction()
}
export async function PopulateCommissionProductCache (kwds, product_addr, market_account, payer_wallet){
    kwds = kwds.map((w)=>w.toLowerCase());
    kwds.sort();
    return SEARCH_PROGRAM.methods.populateCommissionProductCache()
    .accounts({
        bucketCache: GenProductCacheAddress(kwds, "commission"),
        product: typeof product_addr == "string" ? new PublicKey(product_addr) : product_addr,
        marketAccount: typeof market_account == "string" ? new PublicKey(market_account) : market_account,
        payer: payer_wallet.publicKey,
        productProgram: PRODUCT_PROGRAM_ID
    })
    .instruction()
}
export async function SyncCommissionProductCache (kwds){
    kwds = kwds.map((w)=>w.toLowerCase());
    kwds.sort();
    let cache_addr = GenProductCacheAddress(kwds, "commission");
    let cache_node = (await FetchBucketCacheRoot(cache_addr)).data.slice(53);
    let remaining_accs = [];
    for(let i = 0; i < 25; i++ ){
        let vendor_listings_addr = GenListingsAddress("commission", new anchor.BN(cache_node.slice((13*i)+4,(13*i)+12)));
        remaining_accs.push(GenProductAddress(new anchor.BN(cache_node.slice(0,4)), vendor_listings_addr, "commission"));
    }
    return SEARCH_PROGRAM.methods.syncCommissionBucketCache()
    .accounts({
        bucketCache: cache_addr,
    })
    .remainingAccounts(remaining_accs)
    .instruction()
}
export async function UpdateCommissionProductCache (kwds, product_addr){
    kwds = kwds.map((w)=>w.toLowerCase());
    kwds.sort();
    return SEARCH_PROGRAM.methods.updateCommissionBucketCache()
    .accounts({
        bucketCache: GenProductCacheAddress(kwds, "commission"),
        product: typeof product_addr == "string" ? new PublicKey(product_addr) : product_addr,
    })
    .instruction()
}

export async function InitCommissionBucketQueue (kwds, product_addr, market_account, payer_wallet){
    kwds = kwds.map((w)=>w.toLowerCase());
    kwds.sort();
    return SEARCH_PROGRAM.methods.initCommissionBucketQueue(kwds)
    .accounts({
        bucketQueue: GenProductQueueAddress(kwds, "commission"),
        bucketRoot: GenProductCacheAddress(kwds, "commission"),
        product: typeof product_addr == "string" ? new PublicKey(product_addr) : product_addr,
        marketAccount: typeof market_account == "string" ? new PublicKey(market_account) : market_account,
        payer: payer_wallet.publicKey
    })
    .instruction()
}
export async function AddCommissionProductQueue (kwds, product_addr, market_account, payer_wallet){
    kwds = kwds.map((w)=>w.toLowerCase());
    kwds.sort();
    return SEARCH_PROGRAM.methods.addCommissionProductQueue()
    .accounts({
        bucketQueue: GenProductQueueAddress(kwds, "commission"),
        product: typeof product_addr == "string" ? new PublicKey(product_addr) : product_addr,
        marketAccount: typeof market_account == "string" ? new PublicKey(market_account) : market_account,
        payer: payer_wallet.publicKey,
        productProgram: PRODUCT_PROGRAM_ID
    })
    .instruction()
}

export async function DrainCommissionQueue (kwds, arweave_url){
    kwds = kwds.map((w)=>w.toLowerCase());
    kwds.sort();
    if((typeof arweave_url != "string") || (arweave_url.length != 43)){
        return ""
    }
    return SEARCH_PROGRAM.methods.drainCommissionQueue(kwds, arweave_url)
    .accounts({
        bucketCache: GenProductCacheAddress(kwds, "commission"),
        bucketQueue: GenProductQueueAddress(kwds, "commission")
    })
    .instruction()
}

///////////////////////////////////////////////////////////////
/// KWD TREES

/// PHSYICAL

export async function InitPhysicalKwdsTreeCache (word, remaining_kwds, payer_wallet){
    word = word.toLowerCase();
    remaining_kwds = remaining_kwds.map((w)=>w.toLowerCase());
    remaining_kwds.sort();
    return SEARCH_PROGRAM.methods.initPhysicalKwdsTreeCache(word, remaining_kwds)
    .accounts({
        kwdCache: GenKwdTreeCacheAddress(word, remaining_kwds.length + 1, "physical"),
        payer: payer_wallet.publicKey
    })
    .instruction()
}
export async function PopulatePhysicalKwdsToCache (word, remaining_kwds, payer_wallet){
    word = word.toLowerCase();
    remaining_kwds = remaining_kwds.map((w)=>w.toLowerCase());
    remaining_kwds.sort();

    return SEARCH_PROGRAM.methods.populatePhysicalKwdsToCache(word, remaining_kwds)
    .accounts({
        kwdsCache: GenKwdTreeCacheAddress(word, remaining_kwds.length + 1, "physical"),
        payer: payer_wallet.publicKey
    })
    .instruction()
}
export async function SyncPhysicalKwdsCache (word){
    word = word.toLowerCase();
    
    let num_words = remaining_kwds.length+1
    let cache_addr = GenKwdTreeCacheAddress(word, num_words, "physical");
    let tree_cache = (await FetchKwdsTreeCache(cache_addr)).data.slice(8);
    let entry_byte_len = (num_words*16)+4;
    for(let i = 0; i < 15; i++){
        let words = [word];
        for(let j = 0; j < num_words; j++){
            words.push(String.fromCharCode(...tree_cache.slice(entry_byte_len*i, (entry_byte_len*i)+entry_byte_len))).replaceAll("\x00","")
        };
        words.sort();
        GenProductCacheAddress(words, "physical");
    }

    return SEARCH_PROGRAM.methods.syncPhysicalKwdsCache(word, new anchor.BN(num_words))
    .account({
        kwdsCache: cache_addr
    })
    .instruction()
}
export async function UpdatePhysicalKwdsCache (word, remaining_kwds, payer_wallet){
    word = word.toLowerCase();
    remaining_kwds = remaining_kwds.map((w)=>w.toLowerCase());
    remaining_kwds.push(word);
    remaining_kwds.sort();

    return SEARCH_PROGRAM.methods.updatePhysicalKwdsCache(word, remaining_kwds)
    .accounts({
        kwdsCache: GenKwdTreeCacheAddress(word, remaining_kwds.length+1),
        newBucket: GenProductCacheAddress(remaining_kwds, "physical")
    })
    .instruction()
}
export async function InitPhysicalKwdsNode (word, remaining_kwds, payer_wallet){
    word = word.toLowerCase();
    remaining_kwds = remaining_kwds.map((w)=>w.toLowerCase());
    remaining_kwds.sort();

    let bucket_size = remaining_kwds.length + 1;

    return SEARCH_PROGRAM.methods.initPhysicalKwdsNode(word, remaining_kwds)
    .accounts({
        indexer: GenKwdIndexerAddress(word, bucket_size, "physical"),
        treeNode: GenKwdTreeNodeAddress(word, bucket_size, "physical"),
        cacheNode: GenKwdTreeCacheAddress(word, bucket_size, "physical"),
        payer: payer_wallet.publicKey
    })
    .instruction()
}
export async function AddPhysicalKwdsNode (word, remaining_kwds, payer_wallet){
    word = word.toLowerCase();
    remaining_kwds = remaining_kwds.map((w)=>w.toLowerCase());
    remaining_kwds.sort();

    let joined_kwds = remaining_kwds.join("");

    let bucket_size = remaining_kwds.length + 1;

    let to_append = false;
    
    let curr_index = 0;
    let current_node = GenKwdTreeNodeAddress(word, bucket_size, curr_index, "physical");
    let curr_node_data = FetchKwdsTreeNode(current_node).data;
    let encoding_head_len = bucket_size/2;
    let min_entry_len = ((bucket_size*16)+encoding_head_len+1);
    let min_data_size = 5*min_entry_len;
    while(curr_node_data.length < min_data_size){
        let base = 12;
        let left_head = 0;
        for(let i = 0; i < encoding_head_len; i++){
            left_head += new anchor.BN(curr_node_data[base + i] >> 4) + new anchor.BN(curr_node_data[base + i] & 15)
        };
        let left_head_word = String.fromCharCode(...curr_node_data.slice(base+encoding_head_len, base+encoding_head_len+left_head)).replaceAll("\x00","")
        base += left_head;
        let left_tail = 0;
        for(let i = 0; i < encoding_head_len; i++){
            left_tail += new anchor.BN(curr_node_data[base + i] >> 4) + new anchor.BN(curr_node_data[base + i] & 15)
        };
        let left_tail_word = String.fromCharCode(...curr_node_data.slice(base+encoding_head_len, base+encoding_head_len+left_tail)).replaceAll("\x00","")
        base += right_head;
        let left_index = new anchor.BN(curr_node_data.slice(8,10));


        let right_head = 0;
        for(let i = 0; i < encoding_head_len; i++){
            right_head += new anchor.BN(curr_node_data[base + i] >> 4) + new anchor.BN(curr_node_data[base + i] & 15)
        };
        let right_head_word = String.fromCharCode(...curr_node_data.slice(base+encoding_head_len, base+encoding_head_len+right_head)).replaceAll("\x00","")
        base += right_head;
        let right_tail = 0;
        for(let i = 0; i < encoding_head_len; i++){
            right_tail += new anchor.BN(curr_node_data[base + i] >> 4) + new anchor.BN(curr_node_data[base + i] & 15)
        };
        let right_tail_word = String.fromCharCode(...curr_node_data.slice(base+encoding_head_len, base+encoding_head_len+right_tail)).replaceAll("\x00","")
        base += right_head;
        let right_index = new anchor.BN(curr_node_data.slice(10,12));

        if(joined_kwds > left_head_word && joined_kwds < right_head_word){
            current_node = GenKwdTreeNodeAddress(word, bucket_size, left_index, "physical");
            if(left_tail_word < joined_kwds) to_append = true;
            curr_index = left_index;
        }else{
            current_node = GenKwdTreeNodeAddress(word, bucket_size, right_index, "physical");
            if(right_tail_word < joined_kwds) to_append = true;
            curr_index = right_index;
        }

        curr_node_data = await FetchKwdsTreeNode(current_node).data;
    }

    let start = 0;
    let middle = 0;
    let end = 0;

    let tail_offset = new anchor.BN(curr_node_data.slice(8,10));
    if(to_append){
        middle = tail_offset-1;
        start = middle-1;
        // let end = 0;
        while(curr_node_data[start] != 0){
            start--;
        }
        // while(curr_node_data[end] != 0){
        //     end++;
        // }

    }else{
        start = 10;
        // start: first byte of [lengths, str bytes], middle: 2nd 0 offset from start, end: last 0 offset from middle
        while((start < curr_node_data.length) && (middle <= encoding_head_len) && (end != 0)){
            for(let i = 0; i < encoding_head_len; i++){
                middle += new anchor.BN(curr_node_data[start + i] >> 4) + new anchor.BN(curr_node_data[start + i] & 15)
            };
            middle += 1;
            let prev_word = String.fromCharCode(...curr_node_data.slice(start+encoding_head_len, start+middle)).replaceAll("\x00","")

            // if our word is greater than the word we just traversed: insert here // break case
            if(joined_kwds > prev_word){
                end = encoding_head_len;
                for(let i = 0; i < encoding_head_len; i++){
                    end += new anchor.BN(curr_node_data[mid_base + i] >> 4) + new anchor.BN(curr_node_data[mid_base + i] & 15)
                };
                end += 1;
                break;
            }

            start += middle+1;
            middle = encoding_head_len;
            end = 0;
        }
    }

    
    let ret = [
        SEARCH_PROGRAM.methods.addPhysicalKwdsNode(word, remaining_kwds, curr_index, [start & 255,  start << 8, middle, end])
        .accounts({
            treeNode: GenKwdTreeNodeAddress(word, bucket_size, curr_index, "physical"),
            payer: payer_wallet.publicKey
        })
        .instruction()
    ];
    
    if ((tail_offset < min_entry_len) && ((min_entry_len + curr_node_data.length) > 8192)) {
        ret.push(
            await SplitPhysicalTreeNode(word, bucket_size, curr_index, payer_wallet)
        );
    }

    return ret;
}
export async function SplitPhysicalTreeNode (word, bucket_len, bucket_index, payer_wallet){
    word = word.toLowerCase();

    let indexer_addr = GenKwdIndexerAddress(word, bucket_size, "physical");
    let indexer = await FetchKwdsTreeIndex(indexer_addr);

    let left_index = indexer.treeLength + 1;
    let right_index = indexer.treeLength + 2;

    return SEARCH_PROGRAM.methods.splitPhysicalTreeNode(word, bucket_len, bucket_index)
    .accounts({
        indexer: indexer_addr,
        treeNode: GenKwdTreeNodeAddress(word, bucket_len, bucket_index, "physical"),
        leftBranch: GenKwdTreeNodeAddress(word, bucket_len, left_index, "physical"),
        rightBranch: GenKwdTreeNodeAddress(word, bucket_len, right_index, "physical"),
        payer: payer_wallet.publicKey
    })
    .instruction()
}

/// DIGITAL

export async function InitDigitalKwdsTreeCache (word, remaining_kwds, payer_wallet){
    word = word.toLowerCase();
    remaining_kwds = remaining_kwds.map((w)=>w.toLowerCase());
    remaining_kwds.sort();
    return SEARCH_PROGRAM.methods.initDigitalKwdsTreeCache(word, remaining_kwds)
    .accounts({
        kwdCache: GenKwdTreeCacheAddress(word, remaining_kwds.length + 1, "digital"),
        payer: payer_wallet.publicKey
    })
    .instruction()
}
export async function PopulateDigitalKwdsToCache (word, remaining_kwds, payer_wallet){
    word = word.toLowerCase();
    remaining_kwds = remaining_kwds.map((w)=>w.toLowerCase());
    remaining_kwds.sort();

    return SEARCH_PROGRAM.methods.populateDigitalKwdsToCache(word, remaining_kwds)
    .accounts({
        kwdsCache: GenKwdTreeCacheAddress(word, remaining_kwds.length + 1, "digital"),
        payer: payer_wallet.publicKey
    })
    .instruction()
}
export async function SyncDigitalKwdsCache (word, payer_wallet){
    word = word.toLowerCase();
    
    let num_words = remaining_kwds.length+1
    let cache_addr = GenKwdTreeCacheAddress(word, num_words, "digital");
    let tree_cache = (await FetchKwdsTreeCache(cache_addr)).data.slice(8);
    let entry_byte_len = (num_words*16)+4;
    for(let i = 0; i < 15; i++){
        let words = [word];
        for(let j = 0; j < num_words; j++){
            words.push(String.fromCharCode(...tree_cache.slice(entry_byte_len*i, (entry_byte_len*i)+entry_byte_len))).replaceAll("\x00","")
        };
        words.sort();
        GenProductCacheAddress(words, "digital");
    }

    return SEARCH_PROGRAM.methods.syncDigitalKwdsCache(word, new anchor.BN(num_words))
    .account({
        kwdsCache: cache_addr
    })
    .instruction()
}
export async function UpdateDigitalKwdsCache (word, remaining_kwds, payer_wallet){
    word = word.toLowerCase();
    remaining_kwds = remaining_kwds.map((w)=>w.toLowerCase());
    remaining_kwds.push(word);
    remaining_kwds.sort();

    return SEARCH_PROGRAM.methods.updateDigitalKwdsCache(word, remaining_kwds)
    .accounts({
        kwdsCache: GenKwdTreeCacheAddress(word, remaining_kwds.length+1),
        newBucket: GenProductCacheAddress(remaining_kwds, "digital")
    })
    .instruction()
}
export async function InitDigitalKwdsNode (word, remaining_kwds, payer_wallet){
    word = word.toLowerCase();
    remaining_kwds = remaining_kwds.map((w)=>w.toLowerCase());
    remaining_kwds.sort();

    let bucket_size = remaining_kwds.length + 1;

    return SEARCH_PROGRAM.methods.initDigitalKwdsNode(word, remaining_kwds)
    .accounts({
        indexer: GenKwdIndexerAddress(word, bucket_size, "digital"),
        treeNode: GenKwdTreeNodeAddress(word, bucket_size, "digital"),
        cacheNode: GenKwdTreeCacheAddress(word, bucket_size, "digital"),
        payer: payer_wallet.publicKey
    })
    .instruction()
}
export async function AddDigitalKwdsNode (word, remaining_kwds, payer_wallet){
    word = word.toLowerCase();
    remaining_kwds = remaining_kwds.map((w)=>w.toLowerCase());
    remaining_kwds.sort();

    let joined_kwds = remaining_kwds.join("");

    let bucket_size = remaining_kwds.length + 1;

    let to_append = false;
    
    let curr_index = 0;
    let current_node = GenKwdTreeNodeAddress(word, bucket_size, curr_index, "digital");
    let curr_node_data = FetchKwdsTreeNode(current_node).data;
    let encoding_head_len = bucket_size/2;
    let min_entry_len = ((bucket_size*16)+encoding_head_len+1);
    let min_data_size = 5*min_entry_len;
    // iter to find the right tree node
    while(curr_node_data.length < min_data_size){
        let base = 12;
        let left_head = 0;
        for(let i = 0; i < encoding_head_len; i++){
            left_head += new anchor.BN(curr_node_data[base + i] >> 4) + new anchor.BN(curr_node_data[base + i] & 15)
        };
        let left_head_word = String.fromCharCode(...curr_node_data.slice(base+encoding_head_len, base+encoding_head_len+left_head)).replaceAll("\x00","")
        base += left_head;
        let left_tail = 0;
        for(let i = 0; i < encoding_head_len; i++){
            left_tail += new anchor.BN(curr_node_data[base + i] >> 4) + new anchor.BN(curr_node_data[base + i] & 15)
        };
        let left_tail_word = String.fromCharCode(...curr_node_data.slice(base+encoding_head_len, base+encoding_head_len+left_tail)).replaceAll("\x00","")
        base += left_tail;
        let left_index = new anchor.BN(curr_node_data.slice(8,10));


        let right_head = 0;
        for(let i = 0; i < encoding_head_len; i++){
            right_head += new anchor.BN(curr_node_data[base + i] >> 4) + new anchor.BN(curr_node_data[base + i] & 15)
        };
        let right_head_word = String.fromCharCode(...curr_node_data.slice(base+encoding_head_len, base+encoding_head_len+right_head)).replaceAll("\x00","")
        base += right_head;
        let right_tail = 0;
        for(let i = 0; i < encoding_head_len; i++){
            right_tail += new anchor.BN(curr_node_data[base + i] >> 4) + new anchor.BN(curr_node_data[base + i] & 15)
        };
        let right_tail_word = String.fromCharCode(...curr_node_data.slice(base+encoding_head_len, base+encoding_head_len+right_tail)).replaceAll("\x00","")
        base += right_head;
        let right_index = new anchor.BN(curr_node_data.slice(10,12));

        if(joined_kwds > left_head_word && joined_kwds < right_head_word){
            current_node = GenKwdTreeNodeAddress(word, bucket_size, left_index, "digital");
            if(left_tail_word < joined_kwds) to_append = true;
            curr_index = left_index;
        }else{
            current_node = GenKwdTreeNodeAddress(word, bucket_size, right_index, "digital");
            if(right_tail_word < joined_kwds) to_append = true;
            curr_index = right_index;
        }

        curr_node_data = await FetchKwdsTreeNode(current_node).data;
    }

    let start = 0;
    let middle = 0;
    let end = 0;

    // do actual computation to node
    let tail_offset = new anchor.BN(curr_node_data.slice(8,10));
    if(to_append){
        middle = tail_offset-1;
        start = middle-1;
        while(curr_node_data[start] != 0){
            start--;
        }

    }else{
        start = 10;
        // start: first byte of [lengths, str bytes], middle: 2nd 0 offset from start, end: last 0 offset from middle
        while((start < curr_node_data.length) && (middle <= encoding_head_len) && (end != 0)){
            for(let i = 0; i < encoding_head_len; i++){
                middle += new anchor.BN(curr_node_data[start + i] >> 4) + new anchor.BN(curr_node_data[start + i] & 15)
            };
            middle += 1;
            let prev_word = String.fromCharCode(...curr_node_data.slice(start+encoding_head_len, start+middle)).replaceAll("\x00","")

            // if our word is greater than the word we just traversed: insert here // break case
            if(joined_kwds > prev_word){
                end = encoding_head_len;
                for(let i = 0; i < encoding_head_len; i++){
                    end += new anchor.BN(curr_node_data[mid_base + i] >> 4) + new anchor.BN(curr_node_data[mid_base + i] & 15)
                };
                end += 1;
                break;
            }

            start += middle+1;
            middle = encoding_head_len;
            end = 0;
        }
    }

    
    let ret = [
        SEARCH_PROGRAM.methods.addDigitalKwdsNode(word, remaining_kwds, curr_index, [start & 255,  start << 8, middle, end])
        .accounts({
            treeNode: GenKwdTreeNodeAddress(word, bucket_size, curr_index, "digital"),
            payer: payer_wallet.publicKey
        })
        .instruction()
    ];
    
    if ((tail_offset < min_entry_len) && ((min_entry_len + curr_node_data.length) > 8192)) {
        ret.push(
            await SplitDigitalTreeNode(word, bucket_size, curr_index, payer_wallet)
        );
    }

    return ret;
}
export async function SplitDigitalTreeNode (word, bucket_len, bucket_index, payer_wallet){
    word = word.toLowerCase();

    let indexer_addr = GenKwdIndexerAddress(word, bucket_size, "digital");
    let indexer = await FetchKwdsTreeIndex(indexer_addr);

    let left_index = indexer.treeLength + 1;
    let right_index = indexer.treeLength + 2;

    return SEARCH_PROGRAM.methods.splitDigitalTreeNode(word, bucket_len, bucket_index)
    .accounts({
        indexer: indexer_addr,
        treeNode: GenKwdTreeNodeAddress(word, bucket_len, bucket_index, "digital"),
        leftBranch: GenKwdTreeNodeAddress(word, bucket_len, left_index, "digital"),
        rightBranch: GenKwdTreeNodeAddress(word, bucket_len, right_index, "digital"),
        payer: payer_wallet.publicKey
    })
    .instruction()
}

/// COMMISSION

export async function InitCommissionKwdsTreeCache (word, remaining_kwds, payer_wallet){
    word = word.toLowerCase();
    remaining_kwds = remaining_kwds.map((w)=>w.toLowerCase());
    remaining_kwds.sort();
    return SEARCH_PROGRAM.methods.initCommissionKwdsTreeCache(word, remaining_kwds)
    .accounts({
        kwdCache: GenKwdTreeCacheAddress(word, remaining_kwds.length + 1, "commission"),
        payer: payer_wallet.publicKey
    })
    .instruction()
}
export async function PopulateCommissionKwdsToCache (word, remaining_kwds, payer_wallet){
    word = word.toLowerCase();
    remaining_kwds = remaining_kwds.map((w)=>w.toLowerCase());
    remaining_kwds.sort();

    return SEARCH_PROGRAM.methods.populateCommissionKwdsToCache(word, remaining_kwds)
    .accounts({
        kwdsCache: GenKwdTreeCacheAddress(word, remaining_kwds.length + 1, "commission"),
        payer: payer_wallet.publicKey
    })
    .instruction()
}
export async function SyncCommissionKwdsCache (word, payer_wallet){
    word = word.toLowerCase();
    
    let num_words = remaining_kwds.length+1
    let cache_addr = GenKwdTreeCacheAddress(word, num_words, "commission");
    let tree_cache = (await FetchKwdsTreeCache(cache_addr)).data.slice(8);
    let entry_byte_len = (num_words*16)+4;
    for(let i = 0; i < 15; i++){
        let words = [word];
        for(let j = 0; j < num_words; j++){
            words.push(String.fromCharCode(...tree_cache.slice(entry_byte_len*i, (entry_byte_len*i)+entry_byte_len))).replaceAll("\x00","")
        };
        words.sort();
        GenProductCacheAddress(words, "commission");
    }

    return SEARCH_PROGRAM.methods.syncCommissionKwdsCache(word, new anchor.BN(num_words))
    .account({
        kwdsCache: cache_addr
    })
    .instruction()
}
export async function UpdateCommissionKwdsCache (word, remaining_kwds, payer_wallet){
    word = word.toLowerCase();
    remaining_kwds = remaining_kwds.map((w)=>w.toLowerCase());
    remaining_kwds.push(word);
    remaining_kwds.sort();

    return SEARCH_PROGRAM.methods.updateCommissionKwdsCache(word, remaining_kwds)
    .accounts({
        kwdsCache: GenKwdTreeCacheAddress(word, remaining_kwds.length+1),
        newBucket: GenProductCacheAddress(remaining_kwds, "commission")
    })
    .instruction()
}
export async function InitCommissionKwdsNode (word, remaining_kwds, payer_wallet){
    word = word.toLowerCase();
    remaining_kwds = remaining_kwds.map((w)=>w.toLowerCase());
    remaining_kwds.sort();

    let bucket_size = remaining_kwds.length + 1;

    return SEARCH_PROGRAM.methods.initCommissionKwdsNode(word, remaining_kwds)
    .accounts({
        indexer: GenKwdIndexerAddress(word, bucket_size, "commission"),
        treeNode: GenKwdTreeNodeAddress(word, bucket_size, "commission"),
        cacheNode: GenKwdTreeCacheAddress(word, bucket_size, "commission"),
        payer: payer_wallet.publicKey
    })
    .instruction()
}
export async function AddCommissionKwdsNode (word, remaining_kwds, payer_wallet){
    word = word.toLowerCase();
    remaining_kwds = remaining_kwds.map((w)=>w.toLowerCase());
    remaining_kwds.sort();

    let joined_kwds = remaining_kwds.join("");

    let bucket_size = remaining_kwds.length + 1;

    let to_append = false;
    
    let curr_index = 0;
    let current_node = GenKwdTreeNodeAddress(word, bucket_size, curr_index, "commission");
    let curr_node_data = FetchKwdsTreeNode(current_node).data;
    let encoding_head_len = bucket_size/2;
    let min_entry_len = ((bucket_size*16)+encoding_head_len+1);
    let min_data_size = 5*min_entry_len;
    while(curr_node_data.length < min_data_size){
        let base = 12;
        let left_head = 0;
        for(let i = 0; i < encoding_head_len; i++){
            left_head += new anchor.BN(curr_node_data[base + i] >> 4) + new anchor.BN(curr_node_data[base + i] & 15)
        };
        let left_head_word = String.fromCharCode(...curr_node_data.slice(base+encoding_head_len, base+encoding_head_len+left_head)).replaceAll("\x00","")
        base += left_head;
        let left_tail = 0;
        for(let i = 0; i < encoding_head_len; i++){
            left_tail += new anchor.BN(curr_node_data[base + i] >> 4) + new anchor.BN(curr_node_data[base + i] & 15)
        };
        let left_tail_word = String.fromCharCode(...curr_node_data.slice(base+encoding_head_len, base+encoding_head_len+left_tail)).replaceAll("\x00","")
        base += right_head;
        let left_index = new anchor.BN(curr_node_data.slice(8,10));


        let right_head = 0;
        for(let i = 0; i < encoding_head_len; i++){
            right_head += new anchor.BN(curr_node_data[base + i] >> 4) + new anchor.BN(curr_node_data[base + i] & 15)
        };
        let right_head_word = String.fromCharCode(...curr_node_data.slice(base+encoding_head_len, base+encoding_head_len+right_head)).replaceAll("\x00","")
        base += right_head;
        let right_tail = 0;
        for(let i = 0; i < encoding_head_len; i++){
            right_tail += new anchor.BN(curr_node_data[base + i] >> 4) + new anchor.BN(curr_node_data[base + i] & 15)
        };
        let right_tail_word = String.fromCharCode(...curr_node_data.slice(base+encoding_head_len, base+encoding_head_len+right_tail)).replaceAll("\x00","")
        base += right_head;
        let right_index = new anchor.BN(curr_node_data.slice(10,12));

        if(joined_kwds > left_head_word && joined_kwds < right_head_word){
            current_node = GenKwdTreeNodeAddress(word, bucket_size, left_index, "commission");
            if(left_tail_word < joined_kwds) to_append = true;
            curr_index = left_index;
        }else{
            current_node = GenKwdTreeNodeAddress(word, bucket_size, right_index, "commission");
            if(right_tail_word < joined_kwds) to_append = true;
            curr_index = right_index;
        }

        curr_node_data = await FetchKwdsTreeNode(current_node).data;
    }

    let start = 0;
    let middle = 0;
    let end = 0;

    let tail_offset = new anchor.BN(curr_node_data.slice(8,10));
    if(to_append){
        middle = tail_offset-1;
        start = middle-1;
        while(curr_node_data[start] != 0){
            start--;
        }

    }else{
        start = 10;
        // start: first byte of [lengths, str bytes], middle: 2nd 0 offset from start, end: last 0 offset from middle
        while((start < curr_node_data.length) && (middle <= encoding_head_len) && (end != 0)){
            for(let i = 0; i < encoding_head_len; i++){
                middle += new anchor.BN(curr_node_data[start + i] >> 4) + new anchor.BN(curr_node_data[start + i] & 15)
            };
            middle += 1;
            let prev_word = String.fromCharCode(...curr_node_data.slice(start+encoding_head_len, start+middle)).replaceAll("\x00","")

            // if our word is greater than the word we just traversed: insert here // break case
            if(joined_kwds > prev_word){
                end = encoding_head_len;
                for(let i = 0; i < encoding_head_len; i++){
                    end += new anchor.BN(curr_node_data[mid_base + i] >> 4) + new anchor.BN(curr_node_data[mid_base + i] & 15)
                };
                end += 1;
                break;
            }

            start += middle+1;
            middle = encoding_head_len;
            end = 0;
        }
    }

    
    let ret = [
        SEARCH_PROGRAM.methods.addCommissionKwdsNode(word, remaining_kwds, curr_index, [start & 255,  start << 8, middle, end])
        .accounts({
            treeNode: GenKwdTreeNodeAddress(word, bucket_size, curr_index, "commission"),
            payer: payer_wallet.publicKey
        })
        .instruction()
    ];
    
    if ((tail_offset < min_entry_len) && ((min_entry_len + curr_node_data.length) > 8192)) {
        ret.push(
            await SplitCommissionTreeNode(word, bucket_size, curr_index, payer_wallet)
        );
    }

    return ret;
}
export async function SplitCommissionTreeNode (word, bucket_len, bucket_index, payer_wallet){
    word = word.toLowerCase();

    let indexer_addr = GenKwdIndexerAddress(word, bucket_size, "commission");
    let indexer = await FetchKwdsTreeIndex(indexer_addr);

    let left_index = indexer.treeLength + 1;
    let right_index = indexer.treeLength + 2;

    return SEARCH_PROGRAM.methods.splitCommissionTreeNode(word, bucket_len, bucket_index)
    .accounts({
        indexer: indexer_addr,
        treeNode: GenKwdTreeNodeAddress(word, bucket_len, bucket_index, "commission"),
        leftBranch: GenKwdTreeNodeAddress(word, bucket_len, left_index, "commission"),
        rightBranch: GenKwdTreeNodeAddress(word, bucket_len, right_index, "commission"),
        payer: payer_wallet.publicKey
    })
    .instruction()
}


////////////////////////////////////////////
/// ADDRESS HELPERS

export function GenKwdTreeCacheAddress (word, bucket_size, market_type){
    word = word.toLowerCase();
    let seeds = [
        Buffer.from("orbit_search_kwds_cache"),
        bucket_size.toBuffer(),
        Buffer.from(word),
        Buffer.from(market_type)
    ];

    return PublicKey.findProgramAddressSync(seeds,SEARCH_PROGRAM_ID)
}

export function GenKwdTreeNodeAddress (word, bucket_size, node_index, market_type){
    word = word.toLowerCase();
    let seeds = [
        Buffer.from("orbit_search_kwds_node"),
        bucket_size.toBuffer(),
        Buffer.from(word),
        node_index.toBuffer(),
        Buffer.from(market_type)
    ];

    return PublicKey.findProgramAddressSync(seeds, SEARCH_PROGRAM_ID);
}

export function GenKwdIndexerAddress (word, bucket_size, market_type){
    word = word.toLowerCase();
    let seeds = [
        Buffer.from("orbit_search_kwds_indexer"),
        bucket_size.toBuffer(),
        Buffer.from(word),
        Buffer.from(market_type)
    ];

    return PublicKey.findProgramAddressSync(seeds, SEARCH_PROGRAM_ID)
}

export function GenProductCacheAddress (kwds, market_type) {
    kwds = kwds.map((w)=>w.toLowerCase());
    kwds.sort();
    let seeds = [
        Buffer.from("orbit_search_bucket_cache"),
        Buffer.from(kwds.join("")),
        Buffer.from(market_type)
    ];

    return PublicKey.findProgramAddressSync(seeds,SEARCH_PROGRAM_ID)
}

export function GenProductQueueAddress (kwds, market_type){
    kwds = kwds.map((w)=>w.toLowerCase());
    kwds.sort();
    let seeds = [
        Buffer.from("orbit_search_bucket_queue"),
        Buffer.from(kwds.join("")),
        Buffer.from(market_type)
    ];

    return PublicKey.findProgramAddressSync(seeds,SEARCH_PROGRAM_ID)
}

///////////////////////////////////////////
/// FETCH UTILS

export async function FetchKwdsTreeCache (address){
    address = typeof address == "string" ? PublicKey(address) : address;
    let disc = await SEARCH_PROGRAM.coder._coder.accountDiscriminator(SEARCH_PROGRAM.account.kwdsTreeCache.idlAccount().name);
    let accinfo = SEARCH_PROGRAM.account.kwdsTreeCache.getAccountInfo(address);
    if(accinfo.data.slice(0,8) != disc){
        return "invalid discriminator"
    }
    return accinfo
}

export async function FetchMultipleKwdsTreeCache(addresses){
    let disc = await SEARCH_PROGRAM.coder._coder.accountDiscriminator(SEARCH_PROGRAM.account.kwdsTreeCache.idlAccount().name);
    return await rpc.getMultipleAccounts(
        SEARCH_PROGRAM.provider.connection,
        addresses
    ).filter(accinfo => {
        if((accinfo.data.length <= 0) || (accinfo.data.slice(0,8) != disc)){
            return "invalid discriminator"
        }
        return accinfo
    })
}

/**
 * return the object rather than account info
 */
export async function FetchKwdsTreeIndex (address){
    address = typeof address == "string" ? PublicKey(address) : address;
    return SEARCH_PROGRAM.account.kwdsTreeIndex.fetch(address);
}

export async function FetchKwdsTreeNode (address){
    address = typeof address == "string" ? PublicKey(address) : address;
    let disc = await SEARCH_PROGRAM.coder._coder.accountDiscriminator(SEARCH_PROGRAM.account.kwdsTreeNode.idlAccount().name);
    let accinfo = SEARCH_PROGRAM.account.kwdsTreeNode.getAccountInfo(address);
    if(accinfo.data.slice(0,8) != disc){
        return "invalid discriminator"
    }
    return accinfo
}

export async function FetchBucketCacheRoot (address){
    address = typeof address == "string" ? PublicKey(address) : address;
    let disc = await SEARCH_PROGRAM.coder._coder.accountDiscriminator(SEARCH_PROGRAM.account.bucketCacheRoot.idlAccount().name);
    let accinfo = SEARCH_PROGRAM.account.bucketCacheRoot.getAccountInfo(address);
    if(accinfo.data.slice(0,8) != disc){
        return "invalid discriminator"
    }
    return accinfo
}

export async function FetchBucketDrainVec (address){
    address = typeof address == "string" ? PublicKey(address) : address;
    let disc = await SEARCH_PROGRAM.coder._coder.accountDiscriminator(SEARCH_PROGRAM.account.bucketDrainVec.idlAccount().name);
    let accinfo = SEARCH_PROGRAM.account.bucketDrainVec.getAccountInfo(address);
    if(accinfo.data.slice(0,8) != disc){
        return "invalid discriminator"
    }
    return accinfo
}

////////////////////////////////////////////////////////////////////////
/// OBJECT PARSERS

export async function DeserBucketCache(rb, prod_type){
    let page = new anchor.BN(rb.slice(8,10));
    let ar_link = String.fromCharCode(...rb.slice(10, 53));
    let base = 53;
    let prod_addrs = [];
    for(let i = 0; i < 25; i++){
        let timessold = rb.slice(base, base+=4);
        let voterid = rb.slice(base, base+=8);
        let catalog_index_pos = rb.slice(base, base+=1);
        prod_addrs.push(
            GenProductAddress(catalog_index_pos, GenListingsAddress(prod_type, voterid), prod_type)
        )
    }
    let prods = [];
    switch(prod_type){
        case "physical":
            prods = await GetMultipleDigitalProducts(prods_addrs)
            break
        case "digital":
            prods = await GetMultipleDigitalProducts(prods_addrs);
            break
        case "commission":
            prods = await GetMultipleCommissionProducts(prods_addrs)
            break
    }
    return {
        page: page,
        arweave_url: ar_link,
        products: prods
    }
}
/**
 * 
 * @param {[]bytes} rb
 * @param {String} product_type 
 * @returns {[]PhysicalProduct | DigitalProduct | CommissionProduct}
 */
export async function DeserBucketVec(rb, product_type){
    let curr_ind = rb[8];
    let base = 9;
    let prods_addrs = [];
    for(let i = 0; i < curr_ind; i++){
        let voter_id = rb.slice(base, base += 8);
        let catalog_index = rb.slice(base+=1);
        prods_addrs.push(GenProductAddress(catalog_index, GenListingsAddress(product_type, voter_id), product_type));
    }
    switch(product_type){
        case "physical":
            return await GetMultipleDigitalProducts(prods_addrs);
        case "digital":
            return await GetMultipleDigitalProducts(prods_addrs);
        case "commission":
            return await GetMultipleCommissionProducts(prods_addrs);
    }
}

/** 
 * @returns {[][]String}
*/
export async function DeserKwdsCache(rb, base_word, nw){
    let entry_byte_len = (nw*16)+4;
    rb = rb.slice(8);
    let entries = [];
    for(let i = 0; i < 15; i++){
        let entry_words = [base_word];
        for(let j = 0; j < nw; j++){
            entry_words.push(String.fromCharCode(...rb.slice((entry_byte_len*i)+4, (entry_byte_len*i)+entry_byte_len))).replaceAll("\x00","")
        };
        entry_words.sort();
        entries.push(entry_words);
    }
    return entries
}
/**
 * 
 * @param {[]byte} rb 
 * @param {String} base_word 
 * @param {[]String} coupled_words 
 * @returns {[][]String} entries
 */
export async function DeserKwdsNode(rb, base_word, coupled_words){
    let len_info = (coupled_words.len_info+1) >> 1;
    let end_byte = rb.length - (new anchor.BN(rb.slice(8,10))).toNumber();
    let base = 10;
    let entries = []
    while(base < end_byte){
        let lengths = [];
        let entry = [base_word]
        for(let i = 0; i < len_info; i++){
            lengths.push(rb[base+i] >> 4, rb[base+i] & 15);
        }
        base += len_info;
        for(let word_lengths in lengths){
            entry.push(String.fromCharCode(rb.slice(base, base += word_lengths)));
        }
        entry.sort()
        entries.push(entry);
        base += 1;
    }
    return entries;
}

/// helper util funcs

async function FindByKeywords(keywords, product_type){
    keywords.sort();

    let matches = [];

    // try fetching direct node
    let direct_node = await FetchBucketCacheRoot(
        GenProductQueueAddress(keywords, product_type)
    );
    if(direct_node.data.length != 0){
        matches.push(direct_node)
    }

    if(keywords.length > 3){
        for(let i = 3; i < keywords.length; i++){
            let combos = GenerateCombination(keywords, [], i);
            matches.push(...FetchMultipleKwdsTreeCache(combos.map(combo => GenProductCacheAddress(combo, product_type))));
            
        }
    }
    
    for(let bucket_size = keywords.length+1; bucket_size < 8; bucket_size++){
        let current_node = GenKwdTreeNodeAddress(base_word, bucket_size, curr_index, "commission");
        let curr_index = 0;
        let curr_node_data = FetchKwdsTreeNode(current_node).data;
        let encoding_head_len = bucket_size/2;
        let min_entry_len = ((bucket_size*16)+encoding_head_len+1);
        let min_data_size = 5*min_entry_len;
        // 3 cases
        // assume bucket size 5

        while(curr_node_data.length < min_data_size){
            let left_index = new anchor.BN(curr_node_data.slice(8,10));
            let right_index = new anchor.BN(curr_node_data.slice(10,12));
            let left_head = [];
            let left_tail = [];
            let right_head = [];
            let right_tail = [];

            let sign_word_data = cn.slice(12);
            let segments = sign_word_data.split(0);

            // left head
            for(let i = 0; i < encoding_head_len; i++){
                left_head.push(String.fromCharCode(segments[0].slice(encoding_head_len, encoding_head_len + (segments[0][i] >> 4))));
                if ((segments[0][i] & 15) != 0){
                    left_head.push(String.fromCharCode(segments[0].slice(encoding_head_len, encoding_head_len + (segments[0][i] & 15))));
                }
            }
            left_head.sort()
            // left tail
            for(let i = 0; i < encoding_head_len; i++){
                left_tail.push(String.fromCharCode(segments[1].slice(encoding_head_len, encoding_head_len + (segments[0][i] >> 4))));
                if ((segments[0][i] & 15) != 0){
                    left_tail.push(String.fromCharCode(segments[1].slice(encoding_head_len, encoding_head_len + (segments[0][i] & 15))));
                }
            }
            left_tail.sort()
            // right head
            for(let i = 0; i < encoding_head_len; i++){
                right_head.push(String.fromCharCode(segments[2].slice(encoding_head_len, encoding_head_len + (segments[0][i] >> 4))));
                if ((segments[0][i] & 15) != 0){
                    right_head.push(String.fromCharCode(segments[2].slice(encoding_head_len, encoding_head_len + (segments[0][i] & 15))));
                }
            }
            right_head.sort()
            // right tail
            for(let i = 0; i < encoding_head_len; i++){
                right_tail.push(String.fromCharCode(segments[3].slice(encoding_head_len, encoding_head_len + (segments[0][i] >> 4))));
                if ((segments[0][i] & 15) != 0){
                    right_tail.push(String.fromCharCode(segments[3].slice(encoding_head_len, encoding_head_len + (segments[0][i] & 15))));
                }
            }
            right_tail.sort()
    
            // todo: actual iter logic
            if(joined_kwds > left_head_word && joined_kwds < right_head_word){
                current_node = GenKwdTreeNodeAddress(word, bucket_size, left_index, "commission");
                curr_index = left_index;
            }else{
                current_node = GenKwdTreeNodeAddress(word, bucket_size, right_index, "commission");
                curr_index = right_index;
            }
    
            curr_node_data = await FetchKwdsTreeNode(current_node).data;
        }


    }
}

async function FindMoreProductsByKeywords(){}

function GenerateCombination(array_in, append_in, target_length){
    switch(target_length){
        case 0:
            return array_in
        case 1:
            return array_in.map(elem => [...append_in, elem])
        default:
            return [...Array((array_in.length - target_length)+1).keys()]
            .map( i => GenerateCombination(array_in.slice(i+1), [...append_in, array_in[i]], target_length-1))
            .flat()
    }
}