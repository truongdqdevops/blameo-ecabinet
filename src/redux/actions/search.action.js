import { ACTION_TYPES } from '../types';
// import { getErrors, clearErrors } from './errors.action';
import { getErrors } from './errors.action';
import { 
    searchKeywordService,
    getDocumentDetailService
} from '../../services/service';

const searchKeywordAction = (data) => {
    return {
        type: ACTION_TYPES.SEARCH_DOCUMENT,
        data
    };
};

const getDocumentDetailAction = (data) => {
    return {
        type: ACTION_TYPES.GET_DOCUMENT_DETAIL,
        data
    };
};

export const getKeyword = (body) => async dispatch => {
    try {
        // await dispatch(clearErrors());

        const res = await searchKeywordService(body);
        const { mess = {} } = res;
        const { messCode, messDetail = '' } = mess;

        if (messCode === 1) {
            const data = JSON.parse(res.data);
            dispatch(searchKeywordAction(data));
        } else {
            await dispatch(getErrors(messDetail));
        }
    } catch (error) {
        dispatch(getErrors(error));
        console.log(error);
    }
};

export const getDocumentDetail = (body) => async dispatch => {
    try {
        // await dispatch(clearErrors());

        const res = await getDocumentDetailService(body);
        const { mess = {} } = res;
        const { messCode, messDetail = '' } = mess;

        if (messCode === 1) {
            const data = JSON.parse(res.data);
            dispatch(getDocumentDetailAction(data));
        } else {
            await dispatch(getErrors(messDetail));
        }
    } catch (error) {
        dispatch(getErrors(error));
        console.log(error);
    }
};