import * as PHYSICAL_MARKET from "./clients/PhysicalMarketClient";
import * as DIGITAL_MARKET from "./clients/DigitalMarketClient";
import * as COMMISSION_MARKET from "./clients/CommissionMarketClient";
import * as ACCOUNTS_PROGRAM from "./clients/MarketAccountsClient";
import * as DISPUTE_PROGRAM from "./clients/DisputeClient";
import * as PRODUCT_PROGRAM from "./clients/OrbitProductClient";
import * as TRANSACTION_PROGRAM from "./clients/OrbitTransactionClient";
import * as SEARCH_PROGRAM from "./clients/SearchProgramClient";
// import * as MULTISIG_PROGRAM from "./clients/multisig";
// import * as tokenUtils from "@solana/spl-token";

export {
    PHYSICAL_MARKET,
    DIGITAL_MARKET,
    COMMISSION_MARKET,
    ACCOUNTS_PROGRAM,
    DISPUTE_PROGRAM,
    PRODUCT_PROGRAM,
    TRANSACTION_PROGRAM,
    SEARCH_PROGRAM
    // MULTISIG_PROGRAM
}