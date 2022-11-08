const { createContext } = require("react");

const AnchorProviderCtx = createContext({
    anchorProvider: {},
    setAnchorProvider: () => {}
})

export default AnchorProviderCtx;