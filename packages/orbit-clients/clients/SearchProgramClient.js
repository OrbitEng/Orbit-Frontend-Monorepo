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
    let cache_node = (await FetchBucketCacheRoot(cache_addr)).data.slice(54);
    let remaining_accs = [];
    for(let i = 0; i < 25; i++ ){
        let vendor_listings_addr = GenListingsAddress("physical", new anchor.BN(cache_node.slice((14*i)+4,(14*i)+12)));
        remaining_accs.push(GenProductAddress(new anchor.BN(cache_node[(14*i)+12], vendor_listings_addr, "physical")));
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
    let cache_node = (await FetchBucketCacheRoot(cache_addr)).data.slice(54);
    let remaining_accs = [];
    for(let i = 0; i < 25; i++ ){
        let vendor_listings_addr = GenListingsAddress("digital", new anchor.BN(cache_node.slice((14*i)+4,(14*i)+12)));
        remaining_accs.push(GenProductAddress(new anchor.BN(cache_node[(14*i)+12], vendor_listings_addr, "digital")));
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
    let cache_node = (await FetchBucketCacheRoot(cache_addr)).data.slice(54);
    let remaining_accs = [];
    for(let i = 0; i < 25; i++ ){
        let vendor_listings_addr = GenListingsAddress("commission", new anchor.BN(cache_node.slice((14*i)+4,(14*i)+12)));
        remaining_accs.push(GenProductAddress(new anchor.BN(cache_node[(14*i)+12], vendor_listings_addr, "commission")));
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
    let entry_byte_len = (num_words*16)+2;
    let prod_caches = [];
    for(let i = 0; i < 15; i++){
        let words = [word];
        if((new anchor.BN(tree_cache.slice(entry_byte_len*i, (entry_byte_len*i)+2))).toNumber() == 0){
            break;
        }
        for(let j = 0; j < num_words; j++){
            words.push(String.fromCharCode(...tree_cache.slice((entry_byte_len*i)+2, (entry_byte_len*i)+entry_byte_len))).replaceAll("\x00","")
        };
        words.sort();
        prod_caches.push({
            pubkey: GenProductCacheAddress(words, "physical"),
            isWritable: false,
            isSigner: false,
        });
    }

    return SEARCH_PROGRAM.methods.syncPhysicalKwdsCache(word, new anchor.BN(num_words))
    .account({
        kwdsCache: cache_addr
    })
    .remainingAccounts(prod_caches)
    .instruction()
}
export async function UpdatePhysicalKwdsCache (word, remaining_kwds){
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
    
    let curr_index = 0;
    let current_node = GenKwdTreeNodeAddress(word, bucket_size, curr_index, "physical");
    let curr_node_data = FetchKwdsTreeNode(current_node).data;
    let encoding_head_len = bucket_size/2;
    let min_entry_len = ((bucket_size*16)+encoding_head_len+1);
    let min_data_size = 5*min_entry_len;
    while(curr_node_data.length < min_data_size){
        let fork_obj = ReadKeywordFork(curr_node_data, bucket_size);

        if(joined_kwds > fork_obj.entry.join()){
            current_node = GenKwdTreeNodeAddress(word, bucket_size, fork_obj.left_index, "physical");
            curr_index = fork_obj.left_index;
        }else{
            current_node = GenKwdTreeNodeAddress(word, bucket_size, fork_obj.right_index, "physical");
            curr_index = fork_obj.right_index;
        }

        curr_node_data = await FetchKwdsTreeNode(current_node).data;
    }

    let start = 10;
    let middle = 0;
    let end = 0;

    let tail_offset = new anchor.BN(curr_node_data.slice(8,10));
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
export async function SyncDigitalKwdsCache(word){
    word = word.toLowerCase();
    
    let num_words = remaining_kwds.length+1
    let cache_addr = GenKwdTreeCacheAddress(word, num_words, "digital");
    let tree_cache = (await FetchKwdsTreeCache(cache_addr)).data.slice(8);
    let entry_byte_len = (num_words*16)+2;
    let prod_caches = [];
    for(let i = 0; i < 15; i++){
        let words = [word];
        if((new anchor.BN(tree_cache.slice(entry_byte_len*i, (entry_byte_len*i)+2))).toNumber() == 0){
            break;
        }
        for(let j = 0; j < num_words; j++){
            words.push(String.fromCharCode(...tree_cache.slice((entry_byte_len*i)+2, (entry_byte_len*i)+entry_byte_len))).replaceAll("\x00","")
        };
        words.sort();
        prod_caches.push({
            pubkey: GenProductCacheAddress(words, "digital"),
            isWritable: false,
            isSigner: false,
        });
    }

    return SEARCH_PROGRAM.methods.syncDigitalKwdsCache(word, new anchor.BN(num_words))
    .account({
        kwdsCache: cache_addr
    })
    .remainingAccounts(prod_caches)
    .instruction()
}
export async function UpdateDigitalKwdsCache (word, remaining_kwds){
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
    
    let curr_index = 0;
    let current_node = GenKwdTreeNodeAddress(word, bucket_size, curr_index, "digital");
    let curr_node_data = FetchKwdsTreeNode(current_node).data;
    let encoding_head_len = bucket_size/2;
    let min_entry_len = ((bucket_size*16)+encoding_head_len+1);
    let min_data_size = 5*min_entry_len;
    // iter to find the right tree node
    while(curr_node_data.length < min_data_size){
        let fork_obj = ReadKeywordFork(curr_node_data, bucket_size);

        if(joined_kwds > fork_obj.entry.join()){
            current_node = GenKwdTreeNodeAddress(word, bucket_size, fork_obj.left_index, "digital");
            curr_index = fork_obj.left_index;
        }else{
            current_node = GenKwdTreeNodeAddress(word, bucket_size, fork_obj.right_index, "digital");
            curr_index = fork_obj.right_index;
        }

        curr_node_data = await FetchKwdsTreeNode(current_node).data;
    }

    let start = 10;
    let middle = 0;
    let end = 0;

    // do actual computation to node
    let tail_offset = new anchor.BN(curr_node_data.slice(8,10));
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
export async function SyncCommissionKwdsCache (word){
    word = word.toLowerCase();
    
    let num_words = remaining_kwds.length+1
    let cache_addr = GenKwdTreeCacheAddress(word, num_words, "commission");
    let tree_cache = (await FetchKwdsTreeCache(cache_addr)).data.slice(8);
    let entry_byte_len = (num_words*16)+2;
    let prod_caches = [];
    for(let i = 0; i < 15; i++){
        let words = [word];
        if((new anchor.BN(tree_cache.slice(entry_byte_len*i, (entry_byte_len*i)+2))).toNumber() == 0){
            break;
        }
        for(let j = 0; j < num_words; j++){
            words.push(String.fromCharCode(...tree_cache.slice((entry_byte_len*i)+2, (entry_byte_len*i)+entry_byte_len))).replaceAll("\x00","")
        };
        words.sort();
        prod_caches.push({
            pubkey: GenProductCacheAddress(words, "commission"),
            isWritable: false,
            isSigner: false,
        });
    }

    return SEARCH_PROGRAM.methods.syncCommissionKwdsCache(word, new anchor.BN(num_words))
    .account({
        kwdsCache: cache_addr
    })
    .remainingAccounts(prod_caches)
    .instruction()
}
export async function UpdateCommissionKwdsCache (word, remaining_kwds){
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
    
    let curr_index = 0;
    let current_node = GenKwdTreeNodeAddress(word, bucket_size, curr_index, "commission");
    let curr_node_data = FetchKwdsTreeNode(current_node).data;
    let encoding_head_len = bucket_size/2;
    let min_entry_len = ((bucket_size*16)+encoding_head_len+1);
    let min_data_size = 5*min_entry_len;
    while(curr_node_data.length < min_data_size){
        let fork_obj = ReadKeywordFork(curr_node_data, bucket_size);

        if(joined_kwds > fork_obj.entry.join()){
            current_node = GenKwdTreeNodeAddress(word, bucket_size, fork_obj.left_index, "commission");
            curr_index = fork_obj.left_index;
        }else{
            current_node = GenKwdTreeNodeAddress(word, bucket_size, fork_obj.right_index, "commission");
            curr_index = fork_obj.right_index;
        }

        curr_node_data = await FetchKwdsTreeNode(current_node).data;
    }

    let start = 10;
    let middle = 0;
    let end = 0;

    let tail_offset = new anchor.BN(curr_node_data.slice(8,10));
    let filled_data_len = curr_node_data.length - tail_offset.toNumber();
    // start: first byte of [lengths, str bytes], middle: 2nd 0 offset from start, end: last 0 offset from middle
    let last_entry = "";

    // scan first word
    let next_zero = 10;
    while(curr_node_data[next_zero] != 0){
        next_zero += 1;
    }
    next_zero += 1;

    for(let i = 0; i < encoding_head_len; i++){
        middle += new anchor.BN(curr_node_data[start + i] >> 4) + new anchor.BN(curr_node_data[start + i] & 15)
    };
    middle += 1;
    let next_word = String.fromCharCode(...curr_node_data.slice(start+encoding_head_len, start+middle)).replaceAll("\x00","")

    // while word is > than next word
    while((start < filled_data_len) && joined_kwds>next_word){
        
        start += middle+1;
        middle = encoding_head_len;
        end = 0;
    }

    // if our word is greater than the word we just traversed: insert here // break case
    // TODO: fix this logic (eg, when kwds < prev word AND > next word, insert. else, continue)
    if(joined_kwds < prev_word){
        end = encoding_head_len;
        for(let i = 0; i < encoding_head_len; i++){
            end += new anchor.BN(curr_node_data[middle + i] >> 4) + new anchor.BN(curr_node_data[middle + i] & 15)
        };
        end += 1;
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
    let ar_link = String.fromCharCode(...rb.slice(10, 54));
    let base = 53;
    let timessold = [];
    let prod_addrs = [];
    
    for(let i = 0; i < 25; i++){
        let sold_amt = rb.slice(base, base+=4);
        
        let voterid = rb.slice(base, base+=8);
        if(voterid == 0){
            break
        }
        timessold.push(sold_amt)
        let catalog_index_pos = rb.slice(base, base+=2)[0];
        prod_addrs.push(
            GenProductAddress(catalog_index_pos, GenListingsAddress(prod_type, voterid), prod_type)
        )
    };

    let prods = [];
    switch(prod_type){
        case "physical":
            prods = await GetMultipleDigitalProducts(prod_addrs)
            break
        case "digital":
            prods = await GetMultipleDigitalProducts(prod_addrs);
            break
        case "commission":
            prods = await GetMultipleCommissionProducts(prod_addrs)
            break
    }

    prods.forEach((prod, i) => prod.times_sold = timessold[i]);

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
export async function DeserKwdsNode(rb, base_word, bucket_size){
    let len_info = (bucket_size) >> 1;
    let end_byte = rb.length - (new anchor.BN(rb.slice(8,10))).toNumber();
    let entries = []
    let base = 10;
    while(base < end_byte){
        let nb = base;
        while(rb[nb] != 0){
            nb += 1
        }
        entries.push(ReadKwdsEntry(rb.slice(base, nb), len_info, base_word));

        base = nb+1;
    }
    return entries;
}

//////////////////////////////////////////////////////////////////
/// SEARCH UTILS

async function FindByKeywords(keywords, product_type){
    keywords = keywords.map(kw => kw.toLowerCase());
    keywords.sort();

    let matches = {
        sub:[],
        exact: undefined,
        sup: {},
    }

    // try fetching direct node
    let direct_node = await FetchBucketCacheRoot(
        GenProductQueueAddress(keywords, product_type)
    );
    if(direct_node.data.length != 0){
        matches.exact = direct_node;
    }

    if(keywords.length > 3){
        for(let i = 3; i < keywords.length; i++){
            let combos = GenerateCombination(keywords, [], i);
            matches.sub.push(...FetchMultipleKwdsTreeCache(combos.map(combo => GenProductCacheAddress(combo, product_type))));
        }
    }
    
    if(keywords.length < 7){
        for(let bucket_size = keywords.length; bucket_size < 8; bucket_size++){
            for(let word_ind = 0; word_ind < keywords.length; word_ind++){
                let base_word = (remaining_kwds = keywords.slice()) && remaining_kwds.splice(word_ind, 1);
                let retnode = await FetchNode(base_word, bucket_size, keywords, product_type, 0);
                if(retnode.max > 0){
                    matches.sup[bucket_size] = retnode.entries
                }
            }
        }
    }
    return matches
}

//////////////////////////////////////////////////////
/// PURE UTILS

async function FetchNode(base_word, bucket_size, remaining_kwds, product_type, curr_index){
    // while the node data is < data size
    let current_node = GenKwdTreeNodeAddress(base_word, bucket_size, curr_index, product_type);
    let curr_node_data = FetchKwdsTreeNode(current_node).data;
    let encoding_head_len = bucket_size/2;
    let min_entry_len = ((bucket_size*16)+encoding_head_len+1);
    let min_data_size = 5*min_entry_len;

    if(curr_node_data.length < min_data_size){
        let entry_obj = ReadKeywordFork(curr_node_data, bucket_size);
        
        if(remaining_kwds[0] > entry_obj.entry[bucket_size-1]){
            return await FetchNode(base_word, bucket_size, remaining_kwds, product_type, entry_obj.right_index);
        }else
        if(remaining_kwds.join("") < entry_obj.entry.join("")){
            let right_node = await FetchNode(base_word, bucket_size, remaining_kwds, product_type, entry_obj.right_index);
            let left_node = await FetchNode(base_word, bucket_size, remaining_kwds, product_type, entry_obj.left_index);
            if(left_node.max > right_node.max){
                return left_node
            }else if(left_node.max == right_node.max){
                left_node.entries.push(...right_node.entries)
                return left_node
            }else{
                return right_node
            }
        }else{
            return await FetchNode(base_word, bucket_size, remaining_kwds, product_type, entry_obj.left_index)
        }
    }else{
        let entries = DeserKwdsNode(curr_node_data, base_word, bucket_size);
        let ret = {max:0, entries: []};
        for(let entry of entries){
            let max = 0;
            for(let word of remaining_kwds){
                if(entry.includes(word)){
                    max += 1;
                }
            };
            if(max > ret.max){
                ret.max = max;
                ret.entries = [entry];
            }else if(max == ret.max){
                ret.entries.push(entry);
            }
        }
        return ret;
    }
}

function ReadKeywordFork(rb, bucket_size){
    let ret_obj = {
        left_index: new anchor.BN(rb.slice(8,10)),
        right_index: new anchor.BN(rb.slice(10,12)),
        entry: ReadKwdsEntry(rb.slice(12), bucket_size>>1)
    };
    return ret_obj
}

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

function ReadKwdsEntry(rb, len_info, base_word){
    let lengths = [];
    let entry = base_word ? [base_word] : [];
    let base = 0;
    for(let i = 0; i < len_info; i++){
        lengths.push(rb[base+i] >> 4, rb[base+i] & 15);
    }
    base += len_info;
    for(let word_lengths in lengths){
        entry.push(String.fromCharCode(rb.slice(base, base += word_lengths)));
    }
    entry.sort()
    return entry
    
}