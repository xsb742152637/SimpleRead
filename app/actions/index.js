export function add(num) { // 每个函数的返回值里面必须得有一个type值，Reducer就是根据type值改变做出相应
    return {
        type: 'add',
        value: ++num
    }
}

export function cut(num) {
    return {
        type: 'cut',
        value: --num
    }
}

export function login(data) {
    return {
        type: 'login',
        data
    }
}

export function logout(data) {
    return {
        type: 'logout',
        data
    }
}