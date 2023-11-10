import { ACTION_TYPES } from '../types';

export const getErrors = error => dispatch => {
    dispatch({
        type: ACTION_TYPES.GET_ERRORS,
        error
    });
};

export const clearErrors = () => dispatch => {
    dispatch({
        type: ACTION_TYPES.CLEAR_ERRORS
    });
};
