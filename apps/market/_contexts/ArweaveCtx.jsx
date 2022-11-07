const { createContext } = require("react");

const ArweaveCtx = createContext({
    arweaveClient: {},
    setArweaveClient: () => {}
})

export default ArweaveCtx;