const { createContext } = require("react");

const ProductClientCtx = createContext({
    productClient: {},
    setProductClient: () => {}
})

export default ProductClientCtx;