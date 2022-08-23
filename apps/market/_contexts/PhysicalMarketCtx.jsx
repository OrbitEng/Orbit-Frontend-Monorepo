const { createContext } = require("react");

const PhysicalMarketCtx = createContext({
    physicalMarketClient: {},
    setPhysicalMarketClient: () => {}
})

export default PhysicalMarketCtx;