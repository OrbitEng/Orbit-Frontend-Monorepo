const { createContext } = require("react");

const DisputeProgramCtx = createContext({
    disputeProgramClient: {},
    setDisputeProgramClient: () => {}
})

export default DisputeProgramCtx;