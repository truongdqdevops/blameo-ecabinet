import { ACTION_TYPES } from '../types';

const initialState = {
    listFiles: [],
    listNotebookMenu: [],
    resultMove: false,
    resultCopy: false,
    resultDelete: false,
    resultFavorite: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.GET_STORAGE_FILE: {
            const { listFiles = {} } = action;
            return {
                ...state,
                listFiles,
            };
        }
        case ACTION_TYPES.GET_LIST_NOTEBOOK_MENU: {
            const { listNotebookMenu = {} } = action;
            return {
                ...state,
                listNotebookMenu,
            };
        }
        case ACTION_TYPES.MOVE_FILES_TO_FOLDER: {
            const { result = false } = action;
            return {
                ...state,
                resultMove: result,
            };
        }
        case ACTION_TYPES.SAVE_FAVORITE_FILE: {
            const { result = false } = action;
            return {
                ...state,
                resultFavorite: result,
            };
        }
        case ACTION_TYPES.COPY_FILES_TO_FOLDER: {
            const { result = false } = action;
            return {
                ...state,
                resultCopy: result,
            };
        }
        case ACTION_TYPES.DELETE_FILES: {
            const { result = false } = action;
            return {
                ...state,
                resultDelete: result,
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
