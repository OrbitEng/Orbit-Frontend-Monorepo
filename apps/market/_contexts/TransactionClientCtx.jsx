const { createContext } = require("react");

const TransactionClientCtx = createContext({
    transactionClient: {},
    setTransactionClient: () => {}
})

export default TransactionClientCtx;