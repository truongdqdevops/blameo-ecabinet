/* eslint-disable no-console */
import { ACTION_TYPES } from "../types";
// import { getErrors, clearErrors } from './errors.action';
import { getErrors } from "./errors.action";
import {
  getListMeetingService,
  getMeetingByIdService,
  getListMemByIdService,
  getListGuestByIdService,
  updateParticipantService,
  updateConferenceParticipantAndDelegationService,
  insertOrUpdateNotebookService,
  getListAllDeputyForMobileService,
  getListNotebookByUserIdService,
  deleteNotebookService,
  getListSubstituteService,
  getListAllDeputyService,
  deleteOpinionResourcesService,
  getOpinionResourcesService,
  addOpinionResourcesService,
  getListFileAttachByConferenceService,
  getResultByUserIdAndSubjectIdService,
  getCResultBySubjectIdService,
  getCResultBySubjectIdService_2,
  getInventorySubjectService,
  getCVoteResultsService,
  cVoteIssueService,
  cVoteListIssueService,
  getListDepartmentParticipantsService,
  getDepartmentAssignedParticipantsService,
  updateConferenceDetailService,
  insertConferenceParticipantService,
  updateConferenceParticipantService,
  deleteConferenceParticipantService,
  denyDepartmentConferenceParticipantService,
  getListAssignParticipantService,
  getConferenceParticipantService,
  approveAbsentMemberService,
  getListElementMeetingMapService,
  getListElementStatusMeetingMapService,
  getListAssignStatementMeetingMapService,
  getListFinishStatementMeetingMapService,
  removeStatementService,
  getConferenceFileService,
  getParticipantMeetingService,
  getListConferenceOpinionService,
  getListCategoryService,
  getListGopyService,
  deleteGopyService,
  editGopyService,
  createGopyService,
  getDataMeetingDetailService,
} from "../../services/service";
import { Alert } from "react-native";

const chooseMeetingAction = (chosenMeeting, chosenContent) => {
  return {
    type: ACTION_TYPES.CHOOSE_MEETING,
    chosenMeeting,
    chosenContent,
  };
};

const reloadMeetingScreenAction = (needReload) => {
  return {
    type: ACTION_TYPES.RELOAD_MEETING_SCREEN,
    needReload,
  };
};

const getListMeetingAction = (data) => {
  const { list = [], total = 0 } = data;
  return {
    type: ACTION_TYPES.GET_LIST_MEETING,
    list,
    total,
  };
};
const getDataMeetingDetailAction = (data) => {
  const { list = [] } = data;
  return {
    list,
    type: ACTION_TYPES.GET_DATA_MEETING_DETAIL,
    data,
  };
};

const getListGopYAction = (data) => {
  return {
    type: ACTION_TYPES.GET_LIST_GOP_Y,
    data,
  };
};
export const deleteGopY = (body) => async (dispatch) => {
  try {
    const res = await deleteGopyService(body);
    const { mess = {} } = res;
    const { messCode, messDetail = "" } = mess;

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

export const editGopY = (body) => async (dispatch) => {
  try {
    const res = await editGopyService(body);
    const { mess = {} } = res;
    const { messCode, messDetail = "" } = mess;
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
export const createGopY = (body) => async (dispatch) => {
  try {
    console.log("bb body createGopY", body);
    const res = await createGopyService(body);
    const { mess = {} } = res;
    const { messCode, messDetail = "" } = mess;

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

const getMeetingByIdAction = (selectedMeeting) => {
  return {
    type: ACTION_TYPES.GET_MEETING_BY_ID,
    selectedMeeting,
  };
};

const getListMemByIdAction = (listMems) => {
  return {
    type: ACTION_TYPES.GET_MEMS_BY_ID,
    listMems,
  };
};

const getListGuestByIdAction = (listGuests) => {
  return {
    type: ACTION_TYPES.GET_GUESTS_BY_ID,
    listGuests,
  };
};

const getListDepartmentParticipantsAction = (listDepartmentParticipants) => {
  return {
    type: ACTION_TYPES.GET_DEPARTMENT_PARTICIPANTS,
    listDepartmentParticipants,
  };
};

const getDepartmentAssignedParticipantsAction = (
  listDepartmentAssignedParticipants
) => {
  return {
    type: ACTION_TYPES.GET_DEPARTMENT_ASSIGNED_PARTICIPANTS,
    listDepartmentAssignedParticipants,
  };
};

const getListSubstituteAction = (listSubstitude) => {
  return {
    type: ACTION_TYPES.GET_LIST_SUBSTITUTE,
    listSubstitude,
  };
};
const getListAllDeputyForMobileAction = (listAllDeputyForMobile) => {
  return {
    type: ACTION_TYPES.GET_LIST_SUBSTITUTE_FOR_MOBILE,
    listAllDeputyForMobile,
  };
};
const getListNotebookByUserIdAction = (listNotebookByUserId) => {
  return {
    type: ACTION_TYPES.GET_LIST_NOTEBOOK_BY_USER_ID,
    listNotebookByUserId,
  };
};

const getListAllDeputyAction = (listAllDeputy) => {
  return {
    type: ACTION_TYPES.GET_LIST_DEPUTY,
    listAllDeputy,
  };
};

const getOpinionResourcesAction = (list, isPhatBieu) => {
  let type = "";
  if (!isPhatBieu) {
    type = ACTION_TYPES.GET_LIST_OPINE;
  } else {
    type = ACTION_TYPES.GET_LIST_SPEAK;
  }
  return {
    type,
    list,
  };
};

const getListFileAttachByConferenceAction = (listFileAttachByConference) => {
  return {
    type: ACTION_TYPES.GET_LIST_FILE_ATTACH_BY_CONFERENCE,
    listFileAttachByConference,
  };
};

const getResultByUserIdAndSubjectIdAction = (resultByUserIdAndSubjectId) => {
  return {
    type: ACTION_TYPES.GET_RESULT_BY_USERID_AND_SUBJECTID,
    resultByUserIdAndSubjectId,
  };
};

const getCResultBySubjectIdAction = (resultCBySubjectId) => {
  return {
    type: ACTION_TYPES.GET_RESULT_C_BY_SUBJECT,
    resultCBySubjectId,
  };
};

const getCResultBySubjectIdAction_2 = (resultCBySubjectId_2) => {
  return {
    type: ACTION_TYPES.GET_RESULT_C_BY_SUBJECT_2,
    resultCBySubjectId_2,
  };
};

const getInventorySubjectAction = (inventorySubject) => {
  return {
    type: ACTION_TYPES.GET_INVENTORY_SUBJECT,
    inventorySubject,
  };
};

const getCVoteResultsAction = (cVoteResults) => {
  return {
    type: ACTION_TYPES.GET_C_VOTE_RESULTS,
    cVoteResults,
  };
};

const insertConferenceParticipantAction = (insertAssignResult) => {
  return {
    type: ACTION_TYPES.INSERT_CONFERENCE_PARTICIPANT,
    insertAssignResult,
  };
};

const updateConferenceParticipantAction = (updateAssignResult) => {
  return {
    type: ACTION_TYPES.UPDATE_CONFERENCE_PARTICIPANT,
    updateAssignResult,
  };
};

const deleteConferenceParticipantAction = (deleteAssignResult) => {
  return {
    type: ACTION_TYPES.DELETE_CONFERENCE_PARTICIPANT,
    deleteAssignResult,
  };
};
const deleteNotebookAction = (deleteNotebookResult) => {
  return {
    type: ACTION_TYPES.DELETE_NOTEBOOK,
    deleteNotebookResult,
  };
};

const getListAssignParticipantAction = (listAssignParticipant) => {
  return {
    type: ACTION_TYPES.GET_LIST_ASSIGN_PARTICIPANT,
    listAssignParticipant,
  };
};

const denyDepartmentConferenceParticipantAction = (resultDeny) => {
  return {
    type: ACTION_TYPES.DENY_DEPARTMENT_CONFERENCE_PARTICIPANT,
    resultDeny,
  };
};

const updateConferenceDetailAction = (resultUpdateConferenceDetail) => {
  return {
    type: ACTION_TYPES.UDPATE_CONFERENCE_DETAIL,
    resultUpdateConferenceDetail,
  };
};

const getConferenceParticipantAction = (conferenceParticipant) => {
  return {
    type: ACTION_TYPES.GET_CONFERENCE_PARTICIPANT,
    conferenceParticipant,
  };
};

const getListElementMeetingMapAction = (listElementMeetingMap) => {
  return {
    type: ACTION_TYPES.GET_LIST_ELEMENT_MEETING_MAP,
    listElementMeetingMap,
  };
};

const getListElementStatusMeetingMapAction = (listElementStatusMeetingMap) => {
  return {
    type: ACTION_TYPES.GET_LIST_ELEMENT_STATUS_MEETING_MAP,
    listElementStatusMeetingMap,
  };
};

const getListAssignStatementMeetingMapAction = (
  listAssignStatementMeetingMap
) => {
  return {
    type: ACTION_TYPES.GET_LIST_ASSIGN_STATEMENT_MEETING_MAP,
    listAssignStatementMeetingMap,
  };
};

const getListFinishStatementMeetingMapAction = (
  listFinishStatementMeetingMap
) => {
  return {
    type: ACTION_TYPES.GET_LIST_FINISH_STATEMENT_MEETING_MAP,
    listFinishStatementMeetingMap,
  };
};

const getConferenceFileAction = (conferenceFile) => {
  return {
    type: ACTION_TYPES.GET_CONFERENCE_FILE,
    conferenceFile,
  };
};

const getParticipantMeetingAction = (participantMeeting) => {
  return {
    type: ACTION_TYPES.GET_PARTICIPANT_MEETING,
    participantMeeting,
  };
};

const getListConferenceOpinionAction = (listConferenceOpinion) => {
  return {
    type: ACTION_TYPES.GET_LIST_CONFERENCE_OPINION,
    listConferenceOpinion,
  };
};

const getListCategoryAction = (listCategory) => {
  return {
    type: ACTION_TYPES.GET_LIST_CATEGORY,
    listCategory,
  };
};

export const getListMeeting = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getListMeetingService,
    getListMeetingAction,
    dispatch
  );
};
// get infor meeting
export const getListDataMeetingDetail = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getDataMeetingDetailService,
    getDataMeetingDetailAction,
    dispatch
  );
};

export const getListGopY = (body) => async (dispatch) => {
  await defaultCallFunc(body, getListGopyService, getListGopYAction, dispatch);
};

export const getMeetingById = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getMeetingByIdService,
    getMeetingByIdAction,
    dispatch
  );
};

export const getListMemById = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getListMemByIdService,
    getListMemByIdAction,
    dispatch
  );
};

export const getListGuestById = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getListGuestByIdService,
    getListGuestByIdAction,
    dispatch
  );
};

export const getListDepartmentParticipants = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getListDepartmentParticipantsService,
    getListDepartmentParticipantsAction,
    dispatch
  );
};

export const getDepartmentAssignedParticipants = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getDepartmentAssignedParticipantsService,
    getDepartmentAssignedParticipantsAction,
    dispatch
  );
};

export const getListSubstitute = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getListSubstituteService,
    getListSubstituteAction,
    dispatch
  );
};
export const getListAllDeputyForMobile = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getListAllDeputyForMobileService,
    getListAllDeputyForMobileAction,
    dispatch
  );
};
export const getListNotebookByUserId = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getListNotebookByUserIdService,
    getListNotebookByUserIdAction,
    dispatch
  );
};
export const deleteNotebook = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    deleteNotebookService,
    deleteNotebookAction,
    dispatch
  );
};
export const getListDeputy = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getListAllDeputyService,
    getListAllDeputyAction,
    dispatch
  );
};

export const getListFileAttachByConference = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getListFileAttachByConferenceService,
    getListFileAttachByConferenceAction,
    dispatch
  );
};

export const getResultByUserIdAndSubjectId = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getResultByUserIdAndSubjectIdService,
    getResultByUserIdAndSubjectIdAction,
    dispatch
  );
};

export const getCResultBySubjectId = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getCResultBySubjectIdService,
    getCResultBySubjectIdAction,
    dispatch
  );
};

export const getCResultBySubjectId_2 = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getCResultBySubjectIdService_2,
    getCResultBySubjectIdAction_2,
    dispatch
  );
};

// export const getCResultBySubjectId_2 = (body) => async (dispatch) => {
//     try {
//         await dispatch(clearErrors());
//         const res = await getCResultBySubjectIdService_2(body);

//         const { mess = {}, data = '' } = res;
//         const { messCode, messDetail = '' } = mess;

//         if (messCode === 1) {
//             dispatch(getCResultBySubjectIdAction_2(data));
//         }
//         await dispatch(getErrors(messDetail));
//     } catch (error) {
//         dispatch(getErrors(error));
//         console.log(error);
//     }
// };

export const getInventorySubject = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getInventorySubjectService,
    getInventorySubjectAction,
    dispatch
  );
};

export const getCVoteResults = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getCVoteResultsService,
    getCVoteResultsAction,
    dispatch
  );
};

export const updateConferenceDetail = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    updateConferenceDetailService,
    updateConferenceDetailAction,
    dispatch
  );
};

export const insertConferenceParticipant = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    insertConferenceParticipantService,
    insertConferenceParticipantAction,
    dispatch
  );
};

export const updateConferenceParticipant = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    updateConferenceParticipantService,
    updateConferenceParticipantAction,
    dispatch
  );
};

export const deleteConferenceParticipant = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    deleteConferenceParticipantService,
    deleteConferenceParticipantAction,
    dispatch
  );
};

export const getListAssignParticipant = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getListAssignParticipantService,
    getListAssignParticipantAction,
    dispatch
  );
};

export const denyDepartmentConferenceParticipant = (body) => async (
  dispatch
) => {
  await defaultCallFunc(
    body,
    denyDepartmentConferenceParticipantService,
    denyDepartmentConferenceParticipantAction,
    dispatch
  );
};

export const getConferenceParticipant = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getConferenceParticipantService,
    getConferenceParticipantAction,
    dispatch
  );
};

export const getListElementMeetingMap = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getListElementMeetingMapService,
    getListElementMeetingMapAction,
    dispatch
  );
};

export const getListElementStatusMeetingMap = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getListElementStatusMeetingMapService,
    getListElementStatusMeetingMapAction,
    dispatch
  );
};

export const getListAssignStatementMeetingMap = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getListAssignStatementMeetingMapService,
    getListAssignStatementMeetingMapAction,
    dispatch
  );
};

export const getListFinishStatementMeetingMap = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getListFinishStatementMeetingMapService,
    getListFinishStatementMeetingMapAction,
    dispatch
  );
};

export const getConferenceFile = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getConferenceFileService,
    getConferenceFileAction,
    dispatch
  );
};

export const getParticipantMeeting = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getParticipantMeetingService,
    getParticipantMeetingAction,
    dispatch
  );
};

export const getListConferenceOpinion = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getListConferenceOpinionService,
    getListConferenceOpinionAction,
    dispatch
  );
};

export const getListCategory = (body) => async (dispatch) => {
  await defaultCallFunc(
    body,
    getListCategoryService,
    getListCategoryAction,
    dispatch
  );
};

const defaultCallFunc = async (body, service, action, dispatch) => {
  try {
    // await dispatch(clearErrors());

    const res = await service(body);
    const { mess = {} } = res;
    const { messCode, messDetail = "" } = mess;

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

export const approveAbsentMember = (body) => async (dispatch) => {
  try {
    // await dispatch(clearErrors());

    const res = await approveAbsentMemberService(body);
    const { mess = {} } = res;
    const { messCode, messDetail = "" } = mess;

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

export const getOpinionResources = (body) => async (dispatch) => {
  try {
    // await dispatch(clearErrors());

    const res = await getOpinionResourcesService(body);
    const { mess = {} } = res;
    const { messCode, messDetail = "" } = mess;

    if (messCode === 1) {
      const data = JSON.parse(res.data);
      dispatch(getOpinionResourcesAction(data, body.isPhatBieu));
    } else {
      await dispatch(getErrors(messDetail));
    }
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};

export const deleteOpinionResources = (body) => async (dispatch) => {
  try {
    // await dispatch(clearErrors());

    const res = await deleteOpinionResourcesService(body);

    const { mess = {}, data = "" } = res;
    const { messCode, messDetail = "" } = mess;

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

export const updateParticipant = (body) => async (dispatch) => {
  try {
    // await dispatch(clearErrors());

    const res = await updateParticipantService(body);
    const { mess = {}, data = "" } = res;
    const { messCode, messDetail = "" } = mess;

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

export const updateConferenceParticipantAndDelegation = (body) => async (
  dispatch
) => {
  try {
    const res = await updateConferenceParticipantAndDelegationService(body);
    const { mess = {}, data = "" } = res;
    const { messCode, messDetail = "" } = mess;

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

export const insertOrUpdateNotebook = (body) => async (dispatch) => {
  try {
    const res = await insertOrUpdateNotebookService(body);
    const { mess = {}, data = "" } = res;
    const { messCode, messDetail = "" } = mess;

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

export const addOpinionResources = (body) => async (dispatch) => {
  try {
    // await dispatch(clearErrors());

    const res = await addOpinionResourcesService(body);

    const { mess = {}, data = "" } = res;
    const { messCode, messDetail = "" } = mess;

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

export const cVoteIssue = (body) => async (dispatch) => {
  try {
    // await dispatch(clearErrors());

    const res = await cVoteIssueService(body);

    const { mess = {}, data = "" } = res;
    const { messCode, messDetail = "" } = mess;

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

export const cVoteListIssue = (body) => async (dispatch) => {
  try {
    // await dispatch(clearErrors());

    const res = await cVoteListIssueService(body);

    const { mess = {}, data = "" } = res;
    const { messCode, messDetail = "" } = mess;

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

export const removeStatement = (body) => async (dispatch) => {
  try {
    // await dispatch(clearErrors());

    const res = await removeStatementService(body);

    const { mess = {}, data = "" } = res;
    const { messCode, messDetail = "" } = mess;

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

export const chooseMeeting = (chosenMeeting, chosenContent) => async (
  dispatch
) => {
  try {
    // await dispatch(clearErrors());
    dispatch(chooseMeetingAction(chosenMeeting, chosenContent));
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};

export const reloadMeetingScreen = (needReload) => async (dispatch) => {
  try {
    // await dispatch(clearErrors());
    dispatch(reloadMeetingScreenAction(needReload));
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};

export const getNoteList = (body) => async (dispatch) => {
  try {
    dispatch(getDataMeetingDetailService(body));
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};
