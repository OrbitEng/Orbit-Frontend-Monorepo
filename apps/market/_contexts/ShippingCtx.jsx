const { createContext } = require("react");

const ShippingCtx = createContext({
    shipping: {},
    setShipping: () => {}
})

export default ShippingCtx;