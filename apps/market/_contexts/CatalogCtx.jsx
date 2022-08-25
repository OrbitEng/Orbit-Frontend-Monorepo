const { createContext } = require("react");

const CatalogCtx = createContext({
    catalogClient: {},
    setCatalogClient: () => {}
})

export default CatalogCtx;