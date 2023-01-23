const { createContext } = require("react");

const ModalCtx = createContext({
    currentModal: {},
    setCurrentModal: () => {}
})

export default ModalCtx;