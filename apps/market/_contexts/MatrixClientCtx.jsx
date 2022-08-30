const { createContext } = require("react");

const MatrixClientCtx = createContext({
    matrixClient: {},
    setMatrixClient: () => {}
})

export default MatrixClientCtx;