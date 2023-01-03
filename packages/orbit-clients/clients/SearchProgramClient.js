import * as anchor from '@project-serum/anchor';
import {PublicKey} from "@solana/web3.js";
import {TOKEN_PROGRAM_ID, getAssociatedTokenAddress} from "@solana/spl-token";
import {PRODUCT_PROGRAM_ID} from "./product-program";
import {TRANSACTION_PROGRAM_ID} from "./transaction-program";
import {MARKET_ACCOUNTS_PROGRAM_ID} from "./accounts-program";
import { getMultisigWallet, MULTISIG_WALLET_ADDRESS} from "orbit-clients/multisig";
import { GenListingsAddress, GenProductAddress } from './OrbitProductClient';

const idl = require("../idls/orbit_search");

export const SEARCH_PROGRAM_ID = new PublicKey(idl.metadata.address);
export const SEARCH_PROGRAM = new anchor.Program(idl, idl.metadata.address);

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
    let cache_node = (await FetchBucketCacheRoot(cache_addr)).data.slice(51);
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
    let cache_node = (await FetchBucketCacheRoot(cache_addr)).data.slice(51);
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
    let cache_node = (await FetchBucketCacheRoot(cache_addr)).data.slice(51);
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
export async function SyncPhysicalKwdsCache (word, payer_wallet){
    word = word.toLowerCase();
    
    let num_words = remaining_kwds.length+1
    let cache_addr = GenKwdTreeCacheAddress(word, num_words, "physical");
    let tree_cache = (await FetchKwdsTreeCache(cache_addr)).data.slice(8);
    let entry_byte_len = (num_words*16)+4;
    for(let i = 0; i < 15; i++){
        let words = [word];
        for(let j = 0; j < num_words; j++){
            words.push(String.fromCharCode(...tree_cache.slice(entry_byte_len*i, (entry_byte_len*i)+entry_byte_len)));
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
    let min_len = 5*((bucket_size*16)+encoding_head_len+1);
    while(curr_node_data.length < min_len){
        let base = 8;
        let left_head = 0;
        for(let i = 0; i < encoding_head_len; i++){
            left_head += new anchor.BN(curr_node_data[base + i] >> 4) + new anchor.BN(curr_node_data[base + i] & 15)
        };
        let left_head_word = String.fromCharCode(...curr_node_data.slice(base+encoding_head_len, base+encoding_head_len+left_head));
        base += left_head;
        let left_tail = 0;
        for(let i = 0; i < encoding_head_len; i++){
            left_tail += new anchor.BN(curr_node_data[base + i] >> 4) + new anchor.BN(curr_node_data[base + i] & 15)
        };
        let left_tail_word = String.fromCharCode(...curr_node_data.slice(base+encoding_head_len, base+encoding_head_len+left_tail));
        base += right_head;
        let left_index = new anchor.BN(curr_node_data.slice(base,base+2));


        let right_head = 0;
        for(let i = 0; i < encoding_head_len; i++){
            right_head += new anchor.BN(curr_node_data[base + i] >> 4) + new anchor.BN(curr_node_data[base + i] & 15)
        };
        let right_head_word = String.fromCharCode(...curr_node_data.slice(base+encoding_head_len, base+encoding_head_len+right_head));
        base += right_head;
        let right_tail = 0;
        for(let i = 0; i < encoding_head_len; i++){
            right_tail += new anchor.BN(curr_node_data[base + i] >> 4) + new anchor.BN(curr_node_data[base + i] & 15)
        };
        let right_tail_word = String.fromCharCode(...curr_node_data.slice(base+encoding_head_len, base+encoding_head_len+right_tail));
        base += right_head;
        let right_index = new anchor.BN(curr_node_data.slice(base,base+2));

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

    if(to_append){
        let tail_offset = new anchor.BN(curr_node_data.slice(8,10));
        middle = tail_offset;
        start = tail_offset-1;
        // let end = 0;
        while(curr_node_data[start] != 0){
            start--;
        }
        // while(curr_node_data[end] != 0){
        //     end++;
        // }

    }else{
        start = 10;
        while((start < curr_node_data.length) && (middle != 0) && (end != 0)){
            for(let i = 0; i < encoding_head_len; i++){
                middle += new anchor.BN(curr_node_data[start + i] >> 4) + new anchor.BN(curr_node_data[start + i] & 15)
            };
            let prev_word = String.fromCharCode(...curr_node_data.slice(start+encoding_head_len, start+encoding_head_len+middle));

            // if our word is greater than the word we just traversed: insert here // break case
            if(joined_kwds > prev_word){
                let mid_base = start+middle+encoding_head_len + 1;
                for(let i = 0; i < encoding_head_len; i++){
                    end += new anchor.BN(curr_node_data[mid_base + i] >> 4) + new anchor.BN(curr_node_data[mid_base + i] & 15)
                };
                break;
            }

            start += encoding_head_len + middle+1;
            middle = 0
            end = 0;
        }
    }

    return SEARCH_PROGRAM.methods.addPhysicalKwdsNode(word, remaining_kwds, curr_index, start, middle, end)
    .accounts({
        treeNode: GenKwdTreeNodeAddress(word, bucket_size, curr_index, "physical"),
        payer: payer_wallet.publicKey
    })
    .instruction()
}
export async function SplitPhysicalTreeNode (word, remaining_kwds, payer_wallet){
    word = word.toLowerCase();
    remaining_kwds = remaining_kwds.map((w)=>w.toLowerCase());
    remaining_kwds.sort();
}

/// DIGITAL

export async function InitDigitalKwdsTreeCache (){}
export async function PopulateDigitalKwdsToCache (){}
export async function SyncDigitalKwdsCache (){}
export async function UpdateDigitalKwdsCache (){}
export async function InitDigitalKwdsNode (){}
export async function AddDigitalKwdsNode (){}
export async function SplitDigitalTreeNode (){}

/// COMMISSION

export async function InitCommissionKwdsTreeCache (){}
export async function PopulateCommissionKwdsToCache (){}
export async function SyncCommissionKwdsCache (){}
export async function UpdateCommissionKwdsCache (){}
export async function InitCommissionKwdsNode (){}
export async function AddCommissionKwdsNode (){}
export async function SplitCommissionTreeNode (){}


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

FetchKwdsTreeCache = async (address) => {
    address = typeof address == "string" ? PublicKey(address) : address;
    return SEARCH_PROGRAM.account.kwdsTreeCache.getAccountInfo(address);
}

FetchKwdsTreeIndex = async (address) => {
    address = typeof address == "string" ? PublicKey(address) : address;
    return SEARCH_PROGRAM.account.kwdsTreeIndex.getAccountInfo(address);
}

FetchKwdsTreeNode = async (address) => {
    address = typeof address == "string" ? PublicKey(address) : address;
    return SEARCH_PROGRAM.account.kwdsTreeNode.getAccountInfo(address);
}

FetchBucketCacheRoot = async (address) => {
    address = typeof address == "string" ? PublicKey(address) : address;
    return SEARCH_PROGRAM.account.bucketCacheRoot.getAccountInfo(address);
}

FetchBucketDrainVec = async (address) => {
    address = typeof address == "string" ? PublicKey(address) : address;
    return SEARCH_PROGRAM.account.bucketDrainVec.getAccountInfo(address);
}