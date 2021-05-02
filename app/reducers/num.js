const initState = {
  //初始化state内容
  value: 0,
};

const setNumState = (state = initState, action) => {
  switch (
    action.type //根据type的不同做出不同的响应
  ) {
    case 'add':
      return {
        ...state,
        value: action.value,
        status: 'add',
      };
    case 'cut':
      return {
        ...state,
        value: action.value,
        status: 'cut',
      };
    default:
      //必须得有default，用于返回非期望的状态
      return state;
  }
};

export default setNumState;
