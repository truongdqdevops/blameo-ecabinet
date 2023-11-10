import { ACTION_TYPES } from '../types';

const updateConferenceAction = (conferenceId) => {
    return {
        type: ACTION_TYPES.WS_UPDATE_CONFERENCE,
        conferenceId,
    };
};

const updateNotifyAction = (countNotify) => {
    return {
        type: ACTION_TYPES.WS_UPDATE_NOTIFY,
        countNotify,
    };
};

export const updateConferenceWS = (body) => async (dispatch) => {
    await defaultWSUpdateFunc(body, updateConferenceAction, dispatch);
};
export const updateNotifyWS = (body) => async (dispatch) => {
    await defaultWSUpdateFunc(body, updateNotifyAction, dispatch);
};

const defaultWSUpdateFunc  = async (body, action, dispatch) => {
    try {
        dispatch(action(body));
    } catch (error) {
        console.log(error);
    }
};
