import { ACTION_TYPES } from '../types';
// import { getErrors, clearErrors } from './errors.action';
import { getErrors } from './errors.action';
import {
    getStorageFilesService,
    getListNotebookMenuService,
    saveFavoriteFilesService,
    copyFileToFolderService,
    deleteFilesService,
    moveFilesToFolderService,
} from '../../services/service';

const getStorageFilesAction = (data) => {
    return {
        type: ACTION_TYPES.GET_STORAGE_FILE,
        listFiles: data,
    };
};
const getListNotebookMenuAction = (data) => {
    return {
        type: ACTION_TYPES.GET_LIST_NOTEBOOK_MENU,
        listFiles: data,
    };
};
const saveFavoriteFilesAction = (result) => {
    return {
        type: ACTION_TYPES.SAVE_FAVORITE_FILE,
        result
    };
};

const copyFileToFolderAction = (result) => {
    return {
        type: ACTION_TYPES.COPY_FILES_TO_FOLDER,
        result
    };
};

const deleteFilesAction = (result) => {
    return {
        type: ACTION_TYPES.DELETE_FILES,
        result
    };
};

const moveFilesToFolderAction = (result) => {
    return {
        type: ACTION_TYPES.MOVE_FILES_TO_FOLDER,
        result
    };
};

export const getStorageFiles = (body) => async (dispatch) => {
    await defaultCallFunc(body, getStorageFilesService, getStorageFilesAction, dispatch);
};
export const getListNotebookMenu = (body) => async (dispatch) => {
    await defaultCallFunc(body, getListNotebookMenuService, getListNotebookMenuAction, dispatch);
};

export const saveFavoriteFiles = (body) => async (dispatch) => {
    await defaultCallFunc(body, saveFavoriteFilesService, saveFavoriteFilesAction, dispatch);
};

export const copyFileToFolder = (body) => async (dispatch) => {
    await defaultCallFunc(body, copyFileToFolderService, copyFileToFolderAction, dispatch);
};

export const deleteFiles = (body) => async (dispatch) => {
    await defaultCallFunc(body, deleteFilesService, deleteFilesAction, dispatch);
};

export const moveFilesToFolder = (body) => async (dispatch) => {
    await defaultCallFunc(body, moveFilesToFolderService, moveFilesToFolderAction, dispatch);
};

const defaultCallFunc = async (body, service, action, dispatch) => {
    try {
        // await dispatch(clearErrors());

        const res = await service(body);
        const { mess = {} } = res;
        const { messCode, messDetail = '' } = mess;

        if (messCode === 1) {
            const data = JSON.parse(res.data);
            dispatch(action(data));
        } else {
            await dispatch(getErrors(messDetail));
        }
    } catch (error) {
        dispatch(getErrors(error));
        console.log(error);
    }
};
