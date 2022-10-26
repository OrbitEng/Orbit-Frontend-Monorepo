const { createContext } = require("react");

const ChatCtx = createContext({
    chatState: {},
    setChatState: () => {}
})

export default ChatCtx;