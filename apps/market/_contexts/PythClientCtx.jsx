const { createContext } = require("react");

const PythClientCtx = createContext({
    pythClient: {},
    setPythClient: () => {}
})

export default PythClientCtx;