const { createContext } = require("react");

const IDBClientCtx = createContext({
    idbClient: {},
    setIdbClient: () => {}
})

export default IDBClientCtx;