export const ACTION_TYPES = {
  // ERROR
  GET_ERRORS: 'GET_ERRORS',
  CLEAR_ERRORS: 'CLEAR_ERRORS',

  // AUTHEN
  GET_PUBLIC_KEY: 'GET_PUBLIC_KEY',
  GET_AES_KEY: 'GET_AES_KEY',
  ENCODE_DATA_CHAT: 'ENCODE_DATA_CHAT',
  LOGIN: 'LOGIN',
  GET_LIST_DONVI: 'GET_LIST_DONVI',
  CREATE_OTP: 'CREATE_OTP',
  VALIDATE_OTP: 'VALIDATE_OTP',
  SET_SERVER: 'SET_SERVER',
  LOGOUT: 'LOGOUT',

  // MEETINGS
  GET_LIST_MEETING: 'GET_LIST_MEETING',
  GET_LIST_GOP_Y: 'GET_LIST_GOP_Y',
  GET_MEETING_BY_ID: 'GET_MEETING_BY_ID',
  GET_MEMS_BY_ID: 'GET_MEMS_BY_ID',
  GET_GUESTS_BY_ID: 'GET_GUESTS_BY_ID',
  GET_DEPARTMENT_PARTICIPANTS: 'GET_DEPARTMENT_PARTICIPANTS',
  GET_DEPARTMENT_ASSIGNED_PARTICIPANTS: 'GET_DEPARTMENT_ASSIGNED_PARTICIPANTS',
  GET_LIST_SUBSTITUTE: 'GET_LIST_SUBSTITUTE',
  GET_LIST_SUBSTITUTE_FOR_MOBILE: 'GET_LIST_SUBSTITUTE_FOR_MOBILE',
  GET_LIST_NOTEBOOK_BY_USER_ID: 'GET_LIST_NOTEBOOK_BY_USER_ID',
  GET_LIST_DEPUTY: 'GET_LIST_DEPUTY',
  GET_LIST_OPINE: 'GET_LIST_OPINE',
  GET_LIST_SPEAK: 'GET_LIST_SPEAK',
  GET_LIST_FILE_ATTACH_BY_CONFERENCE: 'GET_LIST_FILE_ATTACH_BY_CONFERENCE',
  GET_RESULT_BY_USERID_AND_SUBJECTID: 'GET_RESULT_BY_USERID_AND_SUBJECTID',
  GET_RESULT_C_BY_SUBJECT: 'GET_RESULT_C_BY_SUBJECT',
  GET_RESULT_C_BY_SUBJECT_2: 'GET_RESULT_C_BY_SUBJECT_2',
  GET_INVENTORY_SUBJECT: 'GET_INVENTORY_SUBJECT',
  GET_DATA_MEETING_DETAIL: 'GET_DATA_MEETING_DETAIL',
  CHOOSE_MEETING: 'CHOOSE_MEETING',
  UDPATE_CONFERENCE_DETAIL: 'UDPATE_CONFERENCE_DETAIL',
  GET_LIST_ASSIGN_PARTICIPANT: 'GET_LIST_ASSIGN_PARTICIPANT',
  INSERT_CONFERENCE_PARTICIPANT: 'INSERT_CONFERENCE_PARTICIPANT',
  UPDATE_CONFERENCE_PARTICIPANT: 'UPDATE_CONFERENCE_PARTICIPANT',
  DELETE_CONFERENCE_PARTICIPANT: 'DELETE_CONFERENCE_PARTICIPANT',
  DELETE_NOTEBOOK: 'DELETE_NOTEBOOK',
  DENY_DEPARTMENT_CONFERENCE_PARTICIPANT:
    'DENY_DEPARTMENT_CONFERENCE_PARTICIPANT',
  RELOAD_MEETING_SCREEN: 'RELOAD_MEETING_SCREEN',
  GET_CONFERENCE_PARTICIPANT: 'GET_CONFERENCE_PARTICIPANT',
  GET_LIST_ELEMENT_MEETING_MAP: 'GET_LIST_ELEMENT_MEETING_MAP',
  GET_LIST_ELEMENT_STATUS_MEETING_MAP: 'GET_LIST_ELEMENT_STATUS_MEETING_MAP',
  GET_LIST_ASSIGN_STATEMENT_MEETING_MAP:
    'GET_LIST_ASSIGN_STATEMENT_MEETING_MAP',
  GET_LIST_FINISH_STATEMENT_MEETING_MAP:
    'GET_LIST_FINISH_STATEMENT_MEETING_MAP',
  GET_CONFERENCE_FILE: 'GET_CONFERENCE_FILE',
  GET_PARTICIPANT_MEETING: 'GET_PARTICIPANT_MEETING',
  GET_LIST_CONFERENCE_OPINION: 'GET_LIST_CONFERENCE_OPINION',
  GET_LIST_CATEGORY: 'GET_LIST_CATEGORY',

  // NOTIFICATION
  COUNT_UNREAD_NOTIFICATIONS: 'COUNT_UNREAD_NOTIFICATIONS',
  GET_LIST_ALL_NOTIFY: 'GET_LIST_ALL_NOTIFY',
  GET_NOTIFY_BY_ID: 'GET_NOTIFY_BY_ID',

  // RESOLUTION
  GET_LIST_RESOLUTION: 'GET_LIST_RESOLUTION',
  GET_RESOLUTION_BY_ID: 'GET_RESOLUTION_BY_ID',
  CONFIRM_RESOLUTION_SUCCESS: 'CONFIRM_RESOLUTION_SUCCESS',

  // HOME
  GET_DASHBOARD: 'GET_DASHBOARD',
  GET_DASHBOARD_CONFIRM: 'GET_DASHBOARD_CONFIRM',
  GET_LIST_CONFERENCE_DASHBOARD: 'GET_LIST_CONFERENCE_DASHBOARD',

  // FEEDBACKS
  GET_LIST_FEEDBACK: 'GET_LIST_FEEDBACK',
  SELECTED_FEEDBACK: 'SELECTED_FEEDBACK',
  GET_FEEDBACK_BY_ID: 'GET_FEEDBACK_BY_ID',
  GET_ATTACH_FILE: 'GET_ATTACH_FILE',
  GET_ATTACH_BY_C_FILE: 'GET_ATTACH_BY_C_FILE',
  GET_C_VOTE_RESULTS: 'GET_C_VOTE_RESULTS',
  C_VOTE_ISSUE: 'C_VOTE_ISSUE',
  GET_RESULT: 'GET_RESULT',
  GET_SUMMARY_FILE_BY_ID: 'GET_SUMMARY_FILE_BY_ID',
  GET_LIST_STATUS_FEEDBACK: 'GET_LIST_STATUS_FEEDBACK',
  GET_CONTENT_FILE: 'GET_CONTENT_FILE',
  GET_HELP_ATTACH_FILE: 'GET_HELP_ATTACH_FILE',

  // FEEDBACK-REPLY
  GET_FEEDBACK_OPTION: 'GET_FEEDBACK_OPTION',
  GET_FILE_RESULT_BY_SUBJECT: 'GET_FILE_RESULT_BY_SUBJECT',
  GET_FEEDBACK_RESULT: 'GET_FEEDBACK_RESULT',

  // DOCUMENTS
  GET_STORAGE_FILE: 'GET_STORAGE_FILE',
  GET_LIST_NOTEBOOK_MENU: 'GET_LIST_NOTEBOOK_MENU',
  SAVE_FAVORITE_FILE: 'SAVE_FAVORITE_FILE',
  COPY_FILES_TO_FOLDER: 'COPY_FILES_TO_FOLDER',
  DELETE_FILES: 'DELETE_FILES',
  MOVE_FILES_TO_FOLDER: 'MOVE_FILES_TO_FOLDER',

  // SEARCH
  SEARCH_DOCUMENT: 'SEARCH_DOCUMENT',
  GET_DOCUMENT_DETAIL: 'GET_DOCUMENT_DETAIL',

  // WEB-SOCKET
  WS_UPDATE_CONFERENCE: 'WS_UPDATE_CONFERENCE',
  WS_UPDATE_NOTIFY: 'WS_UPDATE_NOTIFY',
};

export default null;
