import {ACTION_TYPES} from '../types';

const initialState = {
  chosenMeeting: 0,
  chosenContent: 0,
  selectedMeeting: {},
  listMeeting: [],
  totalMeeting: 0,
  listMems: [],
  listGuests: [],
  listDepartmentParticipants: [],
  listDepartmentAssignedParticipants: [],
  listSubstitute: [],
  listAllDeputyForMobile: [],
  listNotebookByUserId: [],
  listOpine: [],
  listSpeak: [],
  listFileAttachByConference: [],
  resultByUserIdAndSubjectId: [],
  resultCBySubjectId: [],
  resultCBySubjectId_2: [],
  cVoteResults: [],
  resultUpdateConferenceDetail: false,
  listAssignParticipant: {},
  resultDeny: false,
  insertAssignResult: false,
  updateAssignResult: false,
  deleteAssignResult: false,
  deleteNotebookResult: false,
  needReload: false,
  conferenceParticipant: {},
  listElementMeetingMap: [],
  listElementStatusMeetingMap: [],
  listAssignStatementMeetingMap: [],
  listFinishStatementMeetingMap: [],
  conferenceFile: {},
  participantMeeting: {},
  listConferenceOpinion: [],
  listCategory: [],
  listGopY: [],
  totalListGopY: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.CHOOSE_MEETING: {
      const {chosenMeeting = 0, chosenContent = 0} = action;
      return {
        ...state,
        chosenMeeting,
        chosenContent,
      };
    }
    case ACTION_TYPES.RELOAD_MEETING_SCREEN: {
      const {needReload} = action;
      return {
        ...state,
        needReload,
      };
    }
    case ACTION_TYPES.GET_LIST_MEETING: {
      const {list = [], total} = action;
      return {
        ...state,
        listMeeting: list,
        totalMeeting: total,
      };
    }
    case ACTION_TYPES.GET_LIST_GOP_Y: {
      const {data} = action;
      return {
        ...state,
        listGopY: data,
      };
    }
    case ACTION_TYPES.GET_MEETING_BY_ID: {
      const {selectedMeeting = {}} = action;
      return {
        ...state,
        selectedMeeting,
      };
    }
    case ACTION_TYPES.GET_MEMS_BY_ID: {
      const {listMems = []} = action;
      return {
        ...state,
        listMems,
      };
    }
    case ACTION_TYPES.GET_DEPARTMENT_PARTICIPANTS: {
      const {listDepartmentParticipants = []} = action;
      return {
        ...state,
        listDepartmentParticipants,
      };
    }
    case ACTION_TYPES.GET_DEPARTMENT_ASSIGNED_PARTICIPANTS: {
      const {listDepartmentAssignedParticipants = []} = action;
      return {
        ...state,
        listDepartmentAssignedParticipants,
      };
    }
    case ACTION_TYPES.GET_GUESTS_BY_ID: {
      const {listGuests = []} = action;
      return {
        ...state,
        listGuests,
      };
    }
    case ACTION_TYPES.GET_LIST_SUBSTITUTE: {
      const {listSubstitute = []} = action;
      return {
        ...state,
        listSubstitute,
      };
    }
    case ACTION_TYPES.GET_LIST_SUBSTITUTE_FOR_MOBILE: {
      const {listAllDeputyForMobile = []} = action;
      return {
        ...state,
        listAllDeputyForMobile,
      };
    }
    case ACTION_TYPES.GET_LIST_NOTEBOOK_BY_USER_ID: {
      const {listNotebookByUserId = []} = action;
      return {
        ...state,
        listNotebookByUserId,
      };
    }
    case ACTION_TYPES.GET_LIST_DEPUTY: {
      const {listAllDeputy = []} = action;
      return {
        ...state,
        listAllDeputy,
      };
    }
    case ACTION_TYPES.GET_LIST_OPINE: {
      const {list = []} = action;
      return {
        ...state,
        listOpine: list,
      };
    }
    case ACTION_TYPES.GET_LIST_SPEAK: {
      const {list = []} = action;
      return {
        ...state,
        listSpeak: list,
      };
    }
    case ACTION_TYPES.GET_LIST_FILE_ATTACH_BY_CONFERENCE: {
      const {listFileAttachByConference = []} = action;
      return {
        ...state,
        listFileAttachByConference,
      };
    }
    case ACTION_TYPES.GET_RESULT_BY_USERID_AND_SUBJECTID: {
      const {resultByUserIdAndSubjectId = []} = action;
      console.log(`resultByUserIdAndSubjectId: ${resultByUserIdAndSubjectId}`);
      return {
        ...state,
        resultByUserIdAndSubjectId,
      };
    }
    case ACTION_TYPES.GET_RESULT_C_BY_SUBJECT: {
      const {resultCBySubjectId = []} = action;
      return {
        ...state,
        resultCBySubjectId,
      };
    }
    case ACTION_TYPES.GET_RESULT_C_BY_SUBJECT_2: {
      const {resultCBySubjectId_2 = []} = action;
      let {conferenceFileResultItemEntity} = resultCBySubjectId_2;
      let {inventorySubjectEntity} = resultCBySubjectId_2;
      console.log(`resultCBySubjectId_2: ${resultCBySubjectId_2}`);
      return {
        ...state,
        resultCBySubjectId_2,
      };
    }
    case ACTION_TYPES.GET_C_VOTE_RESULTS: {
      const {cVoteResults = []} = action;
      return {
        ...state,
        cVoteResults,
      };
    }
    case ACTION_TYPES.UDPATE_CONFERENCE_DETAIL: {
      const {resultUpdateConferenceDetail} = action;
      return {
        ...state,
        resultUpdateConferenceDetail,
      };
    }
    case ACTION_TYPES.GET_LIST_ASSIGN_PARTICIPANT: {
      const {listAssignParticipant} = action;
      return {
        ...state,
        listAssignParticipant,
      };
    }
    case ACTION_TYPES.INSERT_CONFERENCE_PARTICIPANT: {
      const {insertAssignResult} = action;
      return {
        ...state,
        insertAssignResult,
      };
    }
    case ACTION_TYPES.UPDATE_CONFERENCE_PARTICIPANT: {
      const {updateAssignResult} = action;
      return {
        ...state,
        updateAssignResult,
      };
    }
    case ACTION_TYPES.DELETE_CONFERENCE_PARTICIPANT: {
      const {deleteAssignResult} = action;
      return {
        ...state,
        deleteAssignResult,
      };
    }
    case ACTION_TYPES.DELETE_NOTEBOOK: {
      const {deleteNotebookResult} = action;
      return {
        ...state,
        deleteNotebookResult,
      };
    }
    case ACTION_TYPES.DENY_DEPARTMENT_CONFERENCE_PARTICIPANT: {
      const {resultDeny} = action;
      return {
        ...state,
        resultDeny,
      };
    }
    case ACTION_TYPES.GET_CONFERENCE_PARTICIPANT: {
      const {conferenceParticipant = {}} = action;
      return {
        ...state,
        conferenceParticipant,
      };
    }
    case ACTION_TYPES.GET_LIST_ELEMENT_MEETING_MAP: {
      const {listElementMeetingMap = []} = action;
      return {
        ...state,
        listElementMeetingMap,
      };
    }
    case ACTION_TYPES.GET_LIST_ELEMENT_STATUS_MEETING_MAP: {
      const {listElementStatusMeetingMap = []} = action;
      return {
        ...state,
        listElementStatusMeetingMap,
      };
    }
    case ACTION_TYPES.GET_LIST_ASSIGN_STATEMENT_MEETING_MAP: {
      const {listAssignStatementMeetingMap = []} = action;
      return {
        ...state,
        listAssignStatementMeetingMap,
      };
    }
    case ACTION_TYPES.GET_LIST_FINISH_STATEMENT_MEETING_MAP: {
      const {listFinishStatementMeetingMap = []} = action;
      return {
        ...state,
        listFinishStatementMeetingMap,
      };
    }
    case ACTION_TYPES.GET_CONFERENCE_FILE: {
      let {conferenceFile = []} = action;
      conferenceFile = conferenceFile.length === 0 ? {} : conferenceFile[0];
      return {
        ...state,
        conferenceFile,
      };
    }
    case ACTION_TYPES.GET_PARTICIPANT_MEETING: {
      const {participantMeeting = []} = action;
      return {
        ...state,
        participantMeeting: participantMeeting[0],
      };
    }
    case ACTION_TYPES.GET_LIST_CONFERENCE_OPINION: {
      const {listConferenceOpinion = []} = action;
      return {
        ...state,
        listConferenceOpinion,
      };
    }
    case ACTION_TYPES.GET_LIST_CATEGORY: {
      const {listCategory = []} = action;
      return {
        ...state,
        listCategory,
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
