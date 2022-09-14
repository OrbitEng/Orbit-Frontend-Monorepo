const { createContext } = require("react");

const BundlrCtx = createContext({
    bundlrClient: {},
    setBundlrClient: () => {}
})

export default BundlrCtx;