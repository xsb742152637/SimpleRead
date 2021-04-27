const initState = {
    isLogin: false,
    userData: {}
}

const setUserState = (state = initState, action) => {
    switch (action.type) {
        case 'login':
            return {
                ...state,
                isLogin: true,
                userData: action.data
            }
        case 'logout':
            return initState;
        default:
            return state;
    }
}

export default setUserState;