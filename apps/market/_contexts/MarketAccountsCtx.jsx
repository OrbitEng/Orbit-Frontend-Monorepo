const { createContext } = require("react");

const MarketAccountsCtx = createContext({
    marketAccountsClient: {},
    setMarketAccountsClient: () => {}
})

export default MarketAccountsCtx;