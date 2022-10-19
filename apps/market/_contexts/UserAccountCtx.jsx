const { createContext } = require("react");

const UserAccountCtx = createContext({
    userAccount: {},
    setUserAccount: () => {}
})

export default UserAccountCtx;