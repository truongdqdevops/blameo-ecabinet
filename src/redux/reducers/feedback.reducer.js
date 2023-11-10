import { ACTION_TYPES } from '../types';

const initialState = {
    selectedFeedback: {},
    selectedContent: -1,
    listFeedback: [],
    attachFile: [],
    contentFile: [],
    helpAttachFile: [],
    optionFeedback: [],
    resultBySubject: [],
    summaryByFileId: {},
    statusFeedback: {},
    totalFeedback: 0,
    resultFeedback: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ACTION_TYPES.SELECTED_FEEDBACK: {
        const { selectedFeedback = {}, selectedContent = -1 } = action;
        return {
            ...state,
            selectedFeedback,
            selectedContent
        };
    }
    case ACTION_TYPES.GET_LIST_FEEDBACK: {
        const { list = [], total } = action;
        return {
            ...state,
            listFeedback: list,
            totalFeedback: total,
        };
    }
    case ACTION_TYPES.GET_FEEDBACK_BY_ID: {
        const { selectedFeedback = {} } = action;
        return {
            ...state,
            selectedFeedback,
        };
    }
    case ACTION_TYPES.GET_ATTACH_FILE: {
        const { list = [] } = action;
        return {
            ...state,
            attachFile: list,
        };
    }
    case ACTION_TYPES.GET_CONTENT_FILE: {
        const { list = [] } = action;
        return {
            ...state,
            contentFile: list,
        };
    }
    case ACTION_TYPES.GET_HELP_ATTACH_FILE: {
        const { list = [] } = action;
        return {
            ...state,
            helpAttachFile: list,
        };
    }
    case ACTION_TYPES.GET_FEEDBACK_OPTION: {
        const { optionFeedback = [] } = action;
        return {
            ...state,
            optionFeedback,
        };
    }
    case ACTION_TYPES.GET_FILE_RESULT_BY_SUBJECT: {
        const { resultBySubject = [] } = action;
        return {
            ...state,
            resultBySubject
        };
    }
    case ACTION_TYPES.GET_SUMMARY_FILE_BY_ID: {
        const { summaryByFileId = {} } = action;
        return {
            ...state,
            summaryByFileId
        };
    }
    case ACTION_TYPES.GET_LIST_STATUS_FEEDBACK: {
        const { statusFeedback = {} } = action;
        return {
            ...state,
            statusFeedback
        };
    }
    case ACTION_TYPES.GET_FEEDBACK_RESULT: {
        const { feedbackResult = {} } = action;
        return {
            ...state,
            feedbackResult
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
