const { createContext } = require("react");

const ProductCacheCtx = createContext({
    productCache: {},
    setProductCache: () => {}
})

export default ProductCacheCtx;