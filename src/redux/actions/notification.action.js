import { ACTION_TYPES } from '../types';
// import { getErrors, clearErrors } from './errors.action';
import { getErrors } from './errors.action';
import {
    getCountUnreadMessageService,
    getAllNotifyService,
    getNotifyPostByIdService,
    updateStatusNotifyObjectService,
    updateReadAllByUserIdService
} from '../../services/service';

const getCountUnreadMessageAction = (countUnreadMessage) => {
    return {
        type: ACTION_TYPES.COUNT_UNREAD_NOTIFICATIONS,
        countUnreadMessage,
    };
};

const getAllNotifyAction = (listUnreadMessage) => {
    const { notifyObjectEntitys = [], total = 0 } = listUnreadMessage;
    return {
        type: ACTION_TYPES.GET_LIST_ALL_NOTIFY,
        listUnreadMessage: notifyObjectEntitys,
        totalNotify: total,
    };
};

const getNotifyPostByIdAction = (detailSelectedNotify) => {
    return {
        type: ACTION_TYPES.GET_NOTIFY_BY_ID,
        detailSelectedNotify,
    };
};

export const getCountUnreadMessage = (body) => async (dispatch) => {
    await defaultCallFunc(body, getCountUnreadMessageService, getCountUnreadMessageAction, dispatch);
};

export const getAllNotify = (body) => async (dispatch) => {
    await defaultCallFunc(body, getAllNotifyService, getAllNotifyAction, dispatch);
};

export const getNotifyPostById = (body) => async (dispatch) => {
    await defaultCallFunc(body, getNotifyPostByIdService, getNotifyPostByIdAction, dispatch);
};

export const updateStatusNotifyObject = (body) => async (dispatch) => {
    try {
        // await dispatch(clearErrors());

        const res = await updateStatusNotifyObjectService(body);

        const { mess = {}, data = '' } = res;
        const { messCode, messDetail = '' } = mess;

        if (messCode === 1) {
            return data;
        }
        await dispatch(getErrors(messDetail));
    } catch (error) {
        dispatch(getErrors(error));
        console.log(error);
    }
    return null;
};

export const updateReadAllByUserId = (body) => async (dispatch) => {
    try {
        // await dispatch(clearErrors());

        const res = await updateReadAllByUserIdService(body);

        const { mess = {}, data = '' } = res;
        const { messCode, messDetail = '' } = mess;

        if (messCode === 1) {
            return data;
        }
        await dispatch(getErrors(messDetail));
    } catch (error) {
        dispatch(getErrors(error));
        console.log(error);
    }
    return null;
};

const defaultCallFunc = async (body, service, action, dispatch) => {
    try {
        // await dispatch(clearErrors());

        const res = await service(body);
        const { mess = {} } = res;
        const { messCode, messDetail = '' } = mess;

        if (messCode === 1) {
            let { data } = res;
            if (data) {
                data = JSON.parse(data);
                dispatch(action(data));
            }
        } else {
            await dispatch(getErrors(messDetail));
        }
    } catch (error) {
        dispatch(getErrors(error));
        console.log(error);
    }
};
