import url from '../../utils/url';
import { FETCH_DATA } from '../middleware/api';
import { schema, USED_TYPE, TO_PAY_TYPE, AVAILABLE_TYPE, REFUND_TYPE, getOrderById, actions as orderActions, types as orderTypes } from './entities/orders';
import { actions as commentActions } from './entities/comments';
import { combineReducers } from 'redux';

const typeTokey = {
    [TO_PAY_TYPE]: 'toPayIds',
    [AVAILABLE_TYPE]: 'availableIds',
    [REFUND_TYPE]: 'refundIds',
}

const initialState = {
    orders: {
        isFetching: false,
        ids: [],
        toPayIds: [],       // 待付款订单id
        availableIds: [],   // 可使用订单id
        refundIds: [],      // 退款订单id
    },
    currentTab: 0,
    currentOrder: {
        id: null,
        isDeleting: false,
        isCommenting: false,
        comment: '',
        stars: 0,
    }
}

export const types = {
    // 获取订单列表
    FETCH_ORDERS_REQUEST: 'USER/FETCH_ORDERS_REQUEST',
    FETCH_ORDERS_SUCCESS: 'USER/FETCH_ORDERS_SUCCESS',
    FETCH_ORDERS_FAILURE: 'USER/FETCH_ORDERS_FAILURE',
    // 设置当前选中的tab
    SET_CURRENT_TAB: 'USER/SET_CURRENT_TAB',
    // 删除订单
    DELETE_ORDER_REQUEST: 'USER/DELETE_ORDER_REQUEST',
    DELETE_ORDER_SUCCESS: 'USER/DELETE_ORDER_SUCCESS',
    DELETE_ORDER_FAILURE: 'USER/DELETE_ORDER_FAILURE',
    // 删除确认对话框
    SHOW_DELETE_DIALOG: 'USER/SHOW_DELETE_DIALOG',
    HIDE_DELETE_DIALOG: 'USER/HIDE_DELETE_DIALOG',
    // 评价订单编辑
    SHOW_COMMENT_AREA: 'USER/SHOW_COMMENT_AREA',
    HIDE_COMMENT_AREA: 'USER/HIDE_COMMENT_AREA',
    // 编辑评价内容
    SET_COMMENT: 'USER/SET_COMMENT',
    // 打分
    SET_STARS: 'USER/SET_STARS',
    // 提交评价
    POST_COMMENT_REQUEST: 'USER/POST_COMMENT_REQUEST',
    POST_COMMENT_SUCCESS: 'USER/POST_COMMENT_SUCCESS',
    POST_COMMENT_FAILURE: 'USER/POST_COMMENT_FAILURE',
}
//
export const actions = {
    // 获取订单列表
    loadOrders: () => {
        return (dispatch, getState) => {
            const { ids } = getState().user.orders;
            const endpoint = url.getOrders();
            return dispatch(fetchOrders(endpoint));
        }
    },
    // 切换tab
    setCurrentTab: idx => ({
        type: types.SET_CURRENT_TAB,
        idx,
    }),
    // 删除订单
    removeOrder: () => {
        return (dispatch, getState) => {
            const { id } = getState().user.currentOrder;
            if(id) {
                dispatch(deleteOrderRequest());
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        dispatch(deleteOrderSuccess(id));
                        dispatch(orderActions.deleteOrder(id));
                        resolve();
                    }, 500);
                })
            }
        }
    },
    // 显示删除对话框
    showDeleteDialog: orderId => ({
        type: types.SHOW_DELETE_DIALOG,
        orderId,
    }),
    // 隐藏删除对话框
    hideDeleteDialog: () => ({
        type: types.HIDE_DELETE_DIALOG,
    }),
    // 显示订单评价编辑框
    showCommentArea: orderId => ({
        type: types.SHOW_COMMENT_AREA,
        orderId,
    }),
    // 隐藏订单评价编辑框
    hideCommentArea: () => ({
        type: types.HIDE_COMMENT_AREA,
    }),
    // 设置评价信息
    setComment: comment => ({
        type: types.SET_COMMENT,
        comment,
    }),
    // 设置评级等级
    setStars: stars => ({
        type: types.SET_STARS,
        stars,
    }),
    // 提交评价
    submitComment: () => {
        return (dispatch, getState) => {
            dispatch(postCommentRequest());
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const { currentOrder: { id, stars, comment } } = getState().user;
                    const commentObj = {
                        id: +new Date(),
                        stars,
                        content: comment,
                    }
                    dispatch(postCommentSuccess());
                    dispatch(commentActions.addComment(commentObj));
                    dispatch(orderActions.addComment(id, commentObj.id));
                    resolve();
                }, 0);
            })
        }
    }
}

const deleteOrderRequest = () => ({
    type: types.DELETE_ORDER_REQUEST,
})

const deleteOrderSuccess = orderId => ({
    type: types.DELETE_ORDER_SUCCESS,
    orderId,
})

const postCommentRequest = () => ({
    type: types.POST_COMMENT_REQUEST,
})

const postCommentSuccess = () => ({
    type: types.POST_COMMENT_SUCCESS,
})

const fetchOrders = endpoint => ({
    [FETCH_DATA]: {
        types: [
            types.FETCH_ORDERS_REQUEST,
            types.FETCH_ORDERS_SUCCESS,
            types.FETCH_ORDERS_FAILURE,
        ],
        endpoint,
        schema,
    }
})

// reducers
const orders = (state = initialState.orders, action) => {
    switch (action.type) {
        case types.FETCH_ORDERS_REQUEST:
            return { ...state, isFetching: true };
        case types.FETCH_ORDERS_SUCCESS:
            const toPayIds = action.response.ids.filter(id => action.response.orders[id].type === TO_PAY_TYPE);
            const availableIds = action.response.ids.filter(id => action.response.orders[id].type === AVAILABLE_TYPE);
            const refundIds = action.response.ids.filter(id => action.response.orders[id].type === REFUND_TYPE);
            return { 
                ...state, 
                isFetching: false, 
                ids: state.ids.concat(action.response.ids),
                toPayIds: state.toPayIds.concat(toPayIds),
                availableIds: state.availableIds.concat(availableIds),
                refundIds: state.refundIds.concat(refundIds),
            }
        case types.FETCH_ORDERS_FAILURE:
            return { ...state, isFetching: false };
        case types.DELETE_ORDER_SUCCESS:
        case orderTypes.DELETE_ORDER:
            return { 
                ...state,
                ids: removeOrderId(state, 'ids', action.orderId),
                toPayIds: removeOrderId(state, 'toPayIds', action.orderId),
                availableIds: removeOrderId(state, 'availableIds', action.orderId),
                refundIds: removeOrderId(state, 'refundIds', action.orderId),
            };
        case orderTypes.ADD_ORDER:
            const { order } = action;
            const key = typeTokey[order.type];
            return key ? {
                ...state,
                ids: [order.id].concat(state.ids),
                [key]: [order.id].concat(state[key])
            } :
            {
                ...state,
                ids: [order.id].concat(state.ids),
            }
        default:
            return state;
    }
}

// 公共方法
const removeOrderId = (state, key, orderId) => {
    return state[key].filter(id => id !== orderId);
}

const currentTab = (state = initialState.currentTab, action) => {
    switch (action.type) {
        case types.SET_CURRENT_TAB:
            return action.idx;
        default: 
            return state;
    }
}

const currentOrder = (state = initialState.currentOrder, action) => {
    switch (action.type) {
        case types.SHOW_DELETE_DIALOG:
            return {
                ...state,
                id: action.orderId,
                isDeleting: true,
            }
        case types.SHOW_COMMENT_AREA:
            return {
                ...state,
                id: action.orderId,
                isCommenting: true,
            }
        case types.HIDE_COMMENT_AREA:
        case types.HIDE_DELETE_DIALOG:
        case types.DELETE_ORDER_SUCCESS:
        case types.DELETE_ORDER_FAILURE:
        case types.POST_COMMENT_SUCCESS:
        case types.POST_COMMENT_FAILURE:
            return initialState.currentOrder;
        case types.SET_COMMENT:
            return {
                ...state,
                comment: action.comment,
            }
        case types.SET_STARS: 
            return {
                ...state,
                stars: action.stars,
            }
        default:
            return state;
    }
}

const reducer = combineReducers({
    orders,
    currentTab,
    currentOrder,
})

export default reducer;

// selectors
export const getCurrentTab = state => state.user.currentTab;

export const getOrders = state => {
    const key = ['ids', 'toPayIds', 'availableIds', 'refundIds'][state.user.currentTab];
    return state.user.orders[key].map(id => {
        return getOrderById(state, id);
    })
}

// 正在删除的订单id
export const getDeletingOrderId = state => {    
    return state.user.currentOrder && state.user.currentOrder.isDeleting ? state.user.currentOrder.id : null;
}

// 正在评价的订单id
export const getCommentingOrderId = state => {    
    return state.user.currentOrder && state.user.currentOrder.isCommenting ? state.user.currentOrder.id : null;
}

// 评论信息
export const getCurrentOrderComment = state => {
    return state.user.currentOrder ? state.user.currentOrder.comment : '';
}

// 订单评级/打分
export const getCurrentOrderStars = state => {
    return state.user.currentOrder ? state.user.currentOrder.stars : 0;
}