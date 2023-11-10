import { ACTION_TYPES } from '../types';

const initialState = {
    countUnreadMessage: 0,
    listUnreadMessage: [],
    totalNotify: 0,
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ACTION_TYPES.COUNT_UNREAD_NOTIFICATIONS: {
        const { countUnreadMessage = 0 } = action;
        return {
            ...state,
            countUnreadMessage,
        };
    }
    case ACTION_TYPES.GET_LIST_ALL_NOTIFY: {
        const { listUnreadMessage = [], totalNotify = 0 } = action;
        return {
            ...state,
            listUnreadMessage,
            totalNotify,
        };
    }
    case ACTION_TYPES.GET_NOTIFY_BY_ID: {
        const { detailSelectedNotify } = action;
        return {
            ...state,
            detailSelectedNotify,
        };
    }
    case ACTION_TYPES.LOGOUT: {
        return {
            ...initialState,
        };
    }
    default:
        return state;
    }
};
