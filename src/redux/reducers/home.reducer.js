import { ACTION_TYPES } from '../types';

const initialState = {
    summary: {},
    conferences: [],
    conference: {},
    totalMeeting: {},
    listMeeting: [],
    summaryData: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ACTION_TYPES.GET_DASHBOARD: {
        const { summary = {}, conferences = [], conference = {}, summaryData = [] } = action;
        return {
            ...state,
            summary,
            conferences,
            conference,
            summaryData
        };
    }
    case ACTION_TYPES.GET_DASHBOARD_CONFIRM: {
        const { totalMeeting = {} } = action;
        return {
            ...state,
            totalMeeting
        };
    }
    case ACTION_TYPES.GET_LIST_CONFERENCE_DASHBOARD: {
        const { listMeeting = [] } = action;
        return {
            ...state,
            listMeeting
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
