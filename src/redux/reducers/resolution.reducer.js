import { ACTION_TYPES } from '../types';

const initialState = {
    selectedResolution: {},
    listResolution: [],
    confirmSuccess: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ACTION_TYPES.GET_LIST_RESOLUTION: {
        const { list = [] } = action;
        return {
            ...state,
            listResolution: list,
        };
    }
    case ACTION_TYPES.GET_RESOLUTION_BY_ID: {
        const { selectedResolution = {} } = action;
        return {
            ...state,
            selectedResolution,
        };
    }
    case ACTION_TYPES.CONFIRM_RESOLUTION_SUCCESS: {
        const { data = false } = action;
        return {
            ...state,
            confirmSuccess: data,
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
