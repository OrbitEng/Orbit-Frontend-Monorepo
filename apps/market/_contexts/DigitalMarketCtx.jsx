const { createContext } = require("react");

const DigitalMarketCtx = createContext({
    digitalMarketClient: {},
    setDigitalMarketClient: () => {}
})

export default DigitalMarketCtx;