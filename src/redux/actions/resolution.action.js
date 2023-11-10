import { ACTION_TYPES } from '../types';
// import { getErrors, clearErrors } from './errors.action';
import { getErrors } from './errors.action';
import { getListResolutionService, getResolutionByIdService, confirmResolutionService, commentResolutionService } from '../../services/service';

const getResolutionByIdAction = (selectedResolution) => {
    return {
        type: ACTION_TYPES.GET_RESOLUTION_BY_ID,
        selectedResolution,
    };
};

const getListResolutionAction = (list) => {
    return {
        type: ACTION_TYPES.GET_LIST_RESOLUTION,
        list,
    };
};

const confirmResolutionSuccessAction = (data) => {
    return {
        type: ACTION_TYPES.CONFIRM_RESOLUTION_SUCCESS,
        data,
    };
};


export const getListResolution = (keyword,pageSize,activePage) => async dispatch => {
    try {
        // await dispatch(clearErrors());
        const param = {
            keyword,
            pageSize,
            activePage,
        };
        const res = await getListResolutionService(param);
        const { mess = {} } = res;
        const { messCode, messDetail = '' } = mess;

        if (messCode === 1) {
            const data = JSON.parse(res.data);
            dispatch(getListResolutionAction(data));
        } else {
            await dispatch(getErrors(messDetail));
        }
    } catch (error) {
        dispatch(getErrors(error));
        console.log(error);
    }
};

export const getResolutionById = (id) => async dispatch => {
    try {
        // await dispatch(clearErrors());
        const param = { conclusionId: id };
        const res = await getResolutionByIdService(param);
        const { mess = {} } = res;
        const { messCode, messDetail = '' } = mess;

        if (messCode === 1) {
            const data = JSON.parse(res.data);
            dispatch(getResolutionByIdAction(data));
        } else {
            await dispatch(getErrors(messDetail));
        }
    } catch (error) {
        dispatch(getErrors(error));
        console.log(error);
    }
};

export const confirmResolution = (conclusionId, conclusionResultId, status) => async dispatch => {
    try {
        // await dispatch(clearErrors());
        await dispatch(confirmResolutionSuccessAction(false));
        const param = { conclusionId, conclusionResultId, status };
        const res = await confirmResolutionService(param);
        const { mess = {} } = res;
        const { messCode, messDetail = '' } = mess;

        if (messCode === 1) {
            const data = JSON.parse(res.data);
            dispatch(confirmResolutionSuccessAction(data));
            // dispatch(getDataLogin(data));
        } else {
            await dispatch(getErrors(messDetail));
        }
    } catch (error) {
        dispatch(getErrors(error));
        console.log(error);
    }
};

export const commentResolution = (conclusionId, content, status) => async dispatch => {
    try {
        // await dispatch(clearErrors());
        const param = { 
            conclusionId,
            content,
            status
        };
        const res = await commentResolutionService(param);
        const { mess = {} } = res;
        const { messCode, messDetail = '' } = mess;

        if (messCode === 1) {
            // const data = JSON.parse(res.data);
            // dispatch(getDataLogin(data));
        } else {
            await dispatch(getErrors(messDetail));
        }
    } catch (error) {
        dispatch(getErrors(error));
        console.log(error);
    }
};