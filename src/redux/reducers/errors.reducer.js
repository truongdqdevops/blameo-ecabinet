import { ACTION_TYPES } from '../types';

const initialState = {
    error: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ACTION_TYPES.GET_ERRORS: {
        return {
            ...state,
            error: action.error
        };
    }
    case ACTION_TYPES.CLEAR_ERRORS: {
        return {
            ...state,
            error: {}
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
