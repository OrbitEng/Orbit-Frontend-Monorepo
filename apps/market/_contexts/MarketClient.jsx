const { createContext } = require("react");

const MarketCtx = createContext({
    MarketClient: {},
    setMarketClient: () => {}
})

export default MarketCtx;