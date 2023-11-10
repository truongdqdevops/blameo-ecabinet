import {ACTION_TYPES} from '../types';
// import { getErrors, clearErrors } from './errors.action';
import {getErrors} from './errors.action';
import {
  getListFeedbackService,
  getFeedbackByIdService,
  getAttachFileService,
  getResultBySubjectService,
  sendFileToVoOfficeService,
  getSummaryByFileIdService,
  getListStatusFeedbackService,
  getFeedbackResultService,
  saveFeedbackAnswerService,
  sendFeedBackService,
  recallDuyetFeedBackService,
  recallTrinhFeedBackService,
  approveOrRejectFeedBack,
} from '../../services/service';

const selectedFeedbackAction = (selectedFeedback, selectedContent) => {
  return {
    type: ACTION_TYPES.SELECTED_FEEDBACK,
    selectedFeedback,
    selectedContent,
  };
};

const getListFeedbackAction = (data) => {
  const {list = [], total = 0} = data;
  return {
    type: ACTION_TYPES.GET_LIST_FEEDBACK,
    list,
    total,
  };
};

const getFeedbackByIdAction = (selectedFeedback) => {
  return {
    type: ACTION_TYPES.GET_FEEDBACK_BY_ID,
    selectedFeedback,
  };
};

const getAttachFileAction = (list, type) => {
  let typeAttach = '';
  if (type === 'FILE_DINH_KEM') {
    typeAttach = ACTION_TYPES.GET_ATTACH_FILE;
  }
  if (type === 'FILE_NOI_DUNG') {
    typeAttach = ACTION_TYPES.GET_CONTENT_FILE;
  }
  if (type === 'FILE_GUI_CAP_TREN') {
    typeAttach = ACTION_TYPES.GET_HELP_ATTACH_FILE;
  }
  return {
    type: typeAttach,
    list,
  };
};

const getResultBySubjectAction = (resultBySubject) => {
  return {
    type: ACTION_TYPES.GET_FILE_RESULT_BY_SUBJECT,
    resultBySubject,
  };
};

const getSummaryByIdAction = (summaryByFileId) => {
  return {
    type: ACTION_TYPES.GET_SUMMARY_FILE_BY_ID,
    summaryByFileId,
  };
};

const getListStatusFeedbackAction = (statusFeedback) => {
  return {
    type: ACTION_TYPES.GET_LIST_STATUS_FEEDBACK,
    statusFeedback,
  };
};

const getFeedbackResultAction = (feedbackResult) => {
  return {
    type: ACTION_TYPES.GET_FEEDBACK_RESULT,
    feedbackResult,
  };
};

export const getListFeedback = (body) => async (dispatch) => {
  try {
    // await dispatch(clearErrors());

    const res = await getListFeedbackService(body);
    const {mess = {}} = res;
    const {messCode, messDetail = ''} = mess;

    if (messCode === 1) {
      const data = JSON.parse(res.data);
      dispatch(getListFeedbackAction(data));
    } else {
      await dispatch(getErrors(messDetail));
    }
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};

export const getFeedbackById = (body) => async (dispatch) => {
  try {
    // await dispatch(clearErrors());

    const res = await getFeedbackByIdService(body);
    const {mess = {}} = res;
    const {messCode, messDetail = ''} = mess;

    if (messCode === 1) {
      const data = JSON.parse(res.data);
      dispatch(getFeedbackByIdAction(data));
    } else {
      await dispatch(getErrors(messDetail));
    }
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};

export const getAttachFile = (body) => async (dispatch) => {
  try {
    // await dispatch(clearErrors());

    const res = await getAttachFileService(body);
    const {mess = {}} = res;
    const {messCode, messDetail = ''} = mess;

    if (messCode === 1) {
      const data = JSON.parse(res.data);
      dispatch(getAttachFileAction(data, body.type));
    } else {
      await dispatch(getErrors(messDetail));
    }
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};

export const SelectedFeedback = (selectedFeedback, selectedContent) => async (
  dispatch,
) => {
  try {
    // await dispatch(clearErrors());
    dispatch(selectedFeedbackAction(selectedFeedback, selectedContent));
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};

export const getResultBySubject = (body) => async (dispatch) => {
  try {
    // await dispatch(clearErrors());

    const res = await getResultBySubjectService(body);
    const {mess = {}} = res;
    const {messCode, messDetail = ''} = mess;

    if (messCode === 1) {
      const data = JSON.parse(res.data);
      dispatch(getResultBySubjectAction(data));
    } else {
      await dispatch(getErrors(messDetail));
    }
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};

export const sendFileToVoOffice = (body) => async (dispatch) => {
  try {
    // await dispatch(clearErrors());

    const res = await sendFileToVoOfficeService(body);

    const {mess = {}, data = ''} = res;
    const {messCode, messDetail = ''} = mess;

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

export const getSummaryById = (body) => async (dispatch) => {
  try {
    // await dispatch(clearErrors());

    const res = await getSummaryByFileIdService(body);
    const {mess = {}} = res;
    const {messCode, messDetail = ''} = mess;

    if (messCode === 1) {
      const data = JSON.parse(res.data);
      dispatch(getSummaryByIdAction(data));
    } else {
      await dispatch(getErrors(messDetail));
    }
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};

export const getListStatusFeedback = (body) => async (dispatch) => {
  try {
    // await dispatch(clearErrors());

    const res = await getListStatusFeedbackService(body);
    const {mess = {}} = res;
    const {messCode, messDetail = ''} = mess;

    if (messCode === 1) {
      const data = JSON.parse(res.data);
      dispatch(getListStatusFeedbackAction(data));
    } else {
      await dispatch(getErrors(messDetail));
    }
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};

export const getFeedbackResult = (body) => async (dispatch) => {
  try {
    // await dispatch(clearErrors());

    const res = await getFeedbackResultService(body);
    const {mess = {}} = res;
    const {messCode, messDetail = ''} = mess;

    if (messCode === 1) {
      const data = JSON.parse(res.data);
      dispatch(getFeedbackResultAction(data));
    } else {
      await dispatch(getErrors(messDetail));
    }
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};

export const saveFeedbackAnswer = (body) => async (dispatch) => {
  try {
    const res = await saveFeedbackAnswerService(body);
    const {mess = {}} = res;
    const {messCode, messDetail = ''} = mess;

    if (messCode === 1) {
      const data = JSON.parse(res?.data);
      return data;
    }
    await dispatch(getErrors(messDetail));
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
  return false;
};
export const sendApproveFeedback = (body) => async (dispatch) => {
  try {
    const res = await sendFeedBackService(body);
    const {mess = {}} = res;
    const {messCode, messDetail = ''} = mess;

    if (messCode === 1) {
      const data = JSON.parse(res.data);
      return data;
    }
    await dispatch(getErrors(messDetail));
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
  return false;
};
export const recallTrinhFeedback = (body) => async (dispatch) => {
  try {
    const res = await recallTrinhFeedBackService(body);
    const {mess = {}} = res;
    const {messCode, messDetail = ''} = mess;

    if (messCode === 1) {
      const data = JSON.parse(res.data);
      return data;
    }
    await dispatch(getErrors(messDetail));
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
  return false;
};
export const recallDuyetFeedBack = (body) => async (dispatch) => {
  try {
    const res = await recallDuyetFeedBackService(body);
    const {mess = {}} = res;
    const {messCode, messDetail = ''} = mess;

    if (messCode === 1) {
      const data = JSON.parse(res.data);
      return data;
    }
    await dispatch(getErrors(messDetail));
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
  return false;
};

export const approveORDeFB = (body) => async (dispatch) => {
  try {
    const res = await approveOrRejectFeedBack(body);
    const {mess = {}} = res;
    const {messCode, messDetail = ''} = mess;

    if (messCode === 1) {
      const data = JSON.parse(res.data);
      return data;
    }
    await dispatch(getErrors(messDetail));
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
  return false;
};
