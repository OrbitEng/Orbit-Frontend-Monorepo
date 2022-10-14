const { createContext } = require("react");

const CartCtx = createContext({
    cart: {},
    setCart: () => {}
})

export default CartCtx;