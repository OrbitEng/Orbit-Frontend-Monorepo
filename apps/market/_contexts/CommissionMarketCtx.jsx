const { createContext } = require("react");

const CommissionMarketCtx = createContext({
    commissionMarketClient: {},
    setCommissionMarketClient: () => {}
})

export default CommissionMarketCtx;