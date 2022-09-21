const { createContext } = require("react");

const VendorCacheCtx = createContext({
    vendorCache: {},
    setVendorCache: () => {}
})

export default VendorCacheCtx;