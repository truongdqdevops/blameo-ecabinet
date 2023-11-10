import { ACTION_TYPES } from '../types';

const initialState = {
    wsConferenceId: null,
    wsCountNotify: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ACTION_TYPES.WS_UPDATE_CONFERENCE: {
        const { conferenceId } = action;
        return {
            ...state,
            wsConferenceId: conferenceId
        };
    }
    case ACTION_TYPES.WS_UPDATE_NOTIFY: {
        const { countNotify } = action;
        return {
            ...state,
            wsCountNotify: countNotify
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