import { ACTION_TYPES } from '../types';

const initialState = {
    data: {},
    document: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ACTION_TYPES.SEARCH_DOCUMENT: {
        const { data } = action;
        return {
            ...state,
            data
        };
    }
    case ACTION_TYPES.GET_DOCUMENT_DETAIL: {
        const document = action.data;
        return {
            ...state,
            document
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