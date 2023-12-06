import store from "../redux/store";
import {decryptAES, encryptAES} from "../assets/utils/utils";
// const server = {
//     alphaway: 'http://git.alphawaytech.com:20080/Webservice40/webresources',
//     rikkeiPublic: 'http://27.71.225.25:8080/Webservice40/webresources',
//     rikkeiLocal: 'http://172.16.18.128:8080/Webservice40/webresources',
//     sonLa: 'http://27.71.225.25:80/Webservice40/webresources',
//     hueUBND: 'http://203.113.133.76:8080/Webservice40/webresources',
//     hueHDND: 'http://203.113.133.76:8086/Webservice40/webresources',
//     quangNgai: 'http://117.2.64.69:8080/Webservice40/webresources',
// };

export const serverChat = {
  server1: "http://203.113.133.76:3000/home"
};
// export const SERVER = 'http:/ecabinet.thuathienhue.gov.vn';
// export const SERVER = 'http://27.71.230.69:8099';
export const SERVER = "http://118.70.125.195:8202";

export const hostURL = () => {
  const { serverConnect = "" } = store.getState().AuthenReducer;
  if (serverConnect === "http://ecabinet.moit.gov.vn")
    return `${serverConnect}/Webservice40_bct/webresources`;
  else return `${serverConnect}/Webservice40/webresources`;
};

const controller = new AbortController();

const httpOptions = {
  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
};

const httpOptions2 = {
  "Content-Type": "application/json"
};

const convertBodyReq = async body => {
  const { aesKey = "", ivKey = "" } = store.getState().AuthenReducer;
  const bodyEncrypt = await encryptAES(body, aesKey, ivKey);
  return `data=${bodyEncrypt}`;
};

const request = async (apiUrl, method, header, body) => {
  let bodyReq;
  if (apiUrl === `${hostURL()}/Authen/login`) {
    const { aesEncodeKey, data } = body;
    bodyReq = `aesEncodeKey=${aesEncodeKey}&data=${data}`;
  } else if (apiUrl === `${hostURL()}/Authen/encode`) {
    bodyReq = JSON.stringify(body);
  } else if (
    apiUrl === `${hostURL()}/Otp/create` ||
    apiUrl === `${hostURL()}/Otp/validate`
  ) {
    bodyReq = JSON.stringify(body);
  } else if (body) {
    bodyReq = await convertBodyReq(body);
  }
  try {
    console.log("-----------" + apiUrl);
    const res = await fetch(apiUrl, {
      headers: new Headers(header),
      method,
      body: bodyReq,
      signal: controller.signal
    });
    if (res.ok) {
      console.log("-----OK-----" + apiUrl);
      if (
        apiUrl === `${hostURL()}/Authen/getRsaKeyPublic` ||
        apiUrl === `${hostURL()}/Authen/encode`
      ) {
        const resJson = await res.json();
        return resJson;
      }

      const { aesKey = "", ivKey = "" } = store.getState().AuthenReducer;
      const resJson = await res.text();
      if (
        apiUrl === `${hostURL()}/Otp/create` ||
        apiUrl === `${hostURL()}/Otp/validate`
      )
        return resJson;

      const result = await decryptAES(resJson, aesKey, ivKey);
      const newResult = await JSON.parse(result);
      return newResult;
    }
    throw new Error();
  } catch (error) {
    if (controller.signal.aborted) {
      return console.log("Request has been cancelled!");
    }
    console.log(error);
    return {
      result: false,
      message: error.message
    };
  }
};

export async function getAESPublicKey() {
  const apiUrl = `${hostURL()}/Authen/getRsaKeyPublic`;
  const res = await request(apiUrl, "POST", httpOptions, {});
  return res;
}

export async function loginService(body) {
  const apiUrl = `${hostURL()}/Authen/login`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  // console.log("BODY LOGIN is: " + JSON.stringify(body));
  console.log("bb RES LOGIN is: ", res);
  return res;
}

export async function createOTPService(body) {
  const apiUrl = `${hostURL()}/Otp/create`;
  const res = await request(apiUrl, "POST", httpOptions2, body);
  console.log("BODY createOTPService is: " + JSON.stringify(body));
  console.log("createOTPService res is: " + JSON.stringify(res));
  return res;
}

export async function validateOTPService(body) {
  const apiUrl = `${hostURL()}/Otp/validate`;
  const res = await request(apiUrl, "POST", httpOptions2, body);
  console.log("BODY validateOTPService is: " + JSON.stringify(body));
  console.log("validateOTPService res is: " + JSON.stringify(res));
  return res;
}

export async function encodeService(body) {
  const apiUrl = `${hostURL()}/Authen/encode`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function getListMeetingService(body) {
  const apiUrl = `${hostURL()}/Conference/search`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log('bb getListMeetingService RES is:', JSON.stringify(res));
  console.log('bb getListMeetingService BODY is:', JSON.stringify(body));

  return res;
}

export async function getDataMeetingDetailService(body) {
  const apiUrl = `${hostURL()}/Approve/getByIdConferenceAccept_2`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function updatedApprovalService(body) {
  const apiUrl = `${hostURL()}/Approve/updateStatusApproveConference`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("bb updatedApprovalService RES is:", res);
  return res;
}

export async function sendApprovalService(body) {
  const apiUrl = `${hostURL()}/Conference/updateApproveConference`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("bb sendApprovalService RES is:", res);
  return res;
}

export async function getListGopyService(body) {
  const apiUrl = `${hostURL()}/Conference/getListFeedbackByConferenceId`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("bb getListGopyService RES is:", res);
  return res;
}

export async function deleteGopyService(body) {
  const apiUrl = `${hostURL()}/Conference/deleteConferenceFeedback`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("bb deleteGopyService RES is:", res);
  return res;
}

export async function createGopyService(body) {
  const apiUrl = `${hostURL()}/Conference/addConferenceFeedback`;
  // console.log('bb addConferenceFeedback body is:', body);

  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("bb addConferenceFeedback RES is:", res);
  return res;
}

export async function editGopyService(body) {
  const apiUrl = `${hostURL()}/Conference/updateConferenceFeedback`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("bb editGopyService RES is:", JSON.stringify(res));
  return res;
}

export async function getCountUnreadMessageService() {
  const apiUrl = `${hostURL()}/Notifications/countUnreadMessage`;
  const res = await request(apiUrl, "POST", httpOptions, null);
  return res;
}

export async function getAllNotifyService(body) {
  const apiUrl = `${hostURL()}/Notifications/getAllNotifyByUserId`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log(
    "getAllNotifyByUserId RES is:" + JSON.stringify(res).substring(0, 3000)
  );
  console.log("getAllNotifyByUserId BODY is" + JSON.stringify(body));
  return res;
}

export async function getNotifyPostByIdService(body) {
  const apiUrl = `${hostURL()}/Notifications/getNotifyPostById`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function updateStatusNotifyObjectService(body) {
  const apiUrl = `${hostURL()}/Notifications/updateStatusNotifyObject`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function updateReadAllByUserIdService(body) {
  const apiUrl = `${hostURL()}/Notifications/updateReadAllByUserId`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("updateReadAllByUserIdService res is" + JSON.stringify(res));
  return res;
}

export async function getMeetingByIdService(body) {
  const apiUrl = `${hostURL()}/Conference/getById`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("bb getMeetingByIdService RES is:", res);
  console.log("getMeetingByIdService BODY is" + JSON.stringify(body));

  return res;
}

export async function getListFeedbackService(body) {
  const apiUrl = `${hostURL()}/File/search`;
  console.log("bb request", body);
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log(" bb getListFeedbackService RES is:", JSON.parse(res.data));
  return res;
}

/**
 * @AUTHOR: DQT
 * @method POST
 * @body { conferenceId: number }
 * */
export async function getVOfficeFilesService(body) {
  const apiUrl = `${hostURL()}/Conference/getFileFromVofficeByConferenceId`;
  console.log("getVOfficeFilesService.request", body);
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("getVOfficeFilesService.response", JSON.parse(res.data));
  return JSON.parse(res.data);
}


export async function getListMemByIdService(body) {
  const apiUrl = `${hostURL()}/Conference/getParticipants`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("getListMemByIdService RES is" + JSON.stringify(res));
  return res;
}

export async function getFeedbackByIdService(body) {
  const apiUrl = `${hostURL()}/File/findByFileId2`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function getListGuestByIdService(body) {
  const apiUrl = `${hostURL()}/Conference/getListInvitee`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function getListDepartmentParticipantsService(body) {
  const apiUrl = `${hostURL()}/Conference/getDepartmentParticipants`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function getDepartmentAssignedParticipantsService(body) {
  const apiUrl = `${hostURL()}/Conference/getDepartmentAssignedParticipants`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function getConferenceParticipantService(body) {
  const apiUrl = `${hostURL()}/Conference/getParticipants_2`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function approveAbsentMemberService(body) {
  const apiUrl = `${hostURL()}/Conference/absentMember`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function getListElementMeetingMapService(body) {
  const apiUrl = `${hostURL()}/ConfigMeetingMap/getListElementForShow`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("getListElementForShow RES is" + JSON.stringify(res));
  return res;
}

export async function getListElementStatusMeetingMapService(body) {
  const apiUrl = `${hostURL()}/ConfigMeetingMap/getListElementStatus`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function getListAssignStatementMeetingMapService(body) {
  const apiUrl = `${hostURL()}/ConfigMeetingMap/getListAssignStatement`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function getListFinishStatementMeetingMapService(body) {
  const apiUrl = `${hostURL()}/ConfigMeetingMap/getListFinishStatement`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function getConferenceFileService(body) {
  const apiUrl = `${hostURL()}/ConfigMeetingMap/getConferenceFile`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function getParticipantMeetingService(body) {
  const apiUrl = `${hostURL()}/ConfigMeetingMap/getParticipantMeeting`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function getListConferenceOpinionService(body) {
  const apiUrl = `${hostURL()}/ConfigMeetingMap/getListConferenceOpinion`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function removeStatementService(body) {
  const apiUrl = `${hostURL()}/ConfigMeetingMap/removeStatement`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("removeStatementService BODY is" + JSON.stringify(body));
  console.log("removeStatementService RES is" + JSON.stringify(res));
  return res;
}

// #region Resolution

export async function getListResolutionService(body) {
  const apiUrl = `${hostURL()}/Conclusion/search`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function getResolutionByIdService(body) {
  const apiUrl = `${hostURL()}/Conclusion/findConclusionResult`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function confirmResolutionService(body) {
  const apiUrl = `${hostURL()}/Conclusion/createComment`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function commentResolutionService(body) {
  const apiUrl = `${hostURL()}/Conclusion/comment`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}


/**
 * @AUTHOR: DQT
 * @method POST
 * @body { conferenceId: number }
 * */
export async function getVOfficeFilesService(body) {
  const apiUrl = `${hostURL()}/Conference/getFileFromVofficeByConferenceId`;
  console.log("getVOfficeFilesService.request", body);
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("getVOfficeFilesService.response", JSON.parse(res.data));
  return JSON.parse(res.data);
}
// #endregion

export async function getAttachFileService(body) {
  const apiUrl = `${hostURL()}/Attachment/getAttach`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("getAttachFileService RES is" + JSON.stringify(res));
  return res;
}

export async function updateParticipantService(body) {
  const apiUrl = `${hostURL()}/Conference/updateConferenceParticiant`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("updateParticipantService BODY is" + JSON.stringify(body));
  console.log("updateParticipantService RES is" + JSON.stringify(res));
  return res;
}

export async function insertOrUpdateNotebookService(body) {
  const apiUrl = `${hostURL()}/Conference/insertOrUpdateNotebook`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("insertOrUpdateNotebook BODY is" + JSON.stringify(body));
  console.log("insertOrUpdateNotebook RES is" + JSON.stringify(res));
  return res;
}

export async function changePasswordService(body) {
  const apiUrl = `${hostURL()}/SysUser/changePassword`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("changePasswordService BODY is: " + JSON.stringify(body));
  console.log("bb changePasswordService RES is: " + JSON.stringify(res));
  return res;
}

export async function getListDonvi(body) {
  const apiUrl = `${hostURL()}/Account/getListAppByUserNameJoint`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("getListDonvi BODY is: " + JSON.stringify(body));
  console.log("bb getListDonvi RES is: " + JSON.stringify(res));
  return res;
}

export async function submitListDonvi(body) {
  const apiUrl = `${hostURL()}/Authen/access_login_mobile`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("submitListDonvi BODY is: " + JSON.stringify(body));
  console.log("bb submitListDonvi RES is: " + JSON.stringify(res));
  return res;
}

export async function updateConferenceParticipantAndDelegationService(body) {
  const apiUrl = `${hostURL()}/Conference/updateConferenceParticipantAndDelegation`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log(
    "updateConferenceParticipantAndDelegationService BODY is" +
      JSON.stringify(body)
  );
  console.log(
    "updateConferenceParticipantAndDelegationService RES is" +
      JSON.stringify(res)
  );
  return res;
}

export async function getListAllDeputyForMobileService(body) {
  const apiUrl = `${hostURL()}/SysUser/getListAllDeputyForMobile`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("getListAllDeputyForMobile BODY is" + JSON.stringify(body));
  console.log("getListAllDeputyForMobile RES is" + JSON.stringify(res));
  return res;
}

export async function getListNotebookByUserIdService(body) {
  const apiUrl = `${hostURL()}/Conference/getListNotebookByUserId`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("getListNotebookByUserId BODY is" + JSON.stringify(body));
  console.log("getListNotebookByUserId RES is" + JSON.stringify(res));
  return res;
}

export async function deleteNotebookService(body) {
  const apiUrl = `${hostURL()}/Conference/deleteNotebook`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("deleteNotebook BODY is" + JSON.stringify(body));
  console.log("deleteNotebook RES is" + JSON.stringify(res));
  return res;
}

export async function getListSubstituteService() {
  const apiUrl = `${hostURL()}/SysUser/getListUserByParentId`;
  const res = await request(apiUrl, "POST", httpOptions, {});
  // console.log("getListSubstituteService Body is" + JSON.stringify(res));
  console.log("getListSubstituteService RES is" + JSON.stringify(res));
  return res;
}

export async function getListUserApproverService() {
  const apiUrl = `${hostURL()}/SysUser/getListUserApprover`;
  const res = await request(apiUrl, "POST", httpOptions, {});
  // console.log("getUserApproverService Body is" + JSON.stringify(res));
  console.log("getUserApprover RES is" + JSON.stringify(res));
  return res;
}

export async function getInformationMeetingsAreApproved(body) {
  const apiUrl = `${hostURL()}/Approve/getApproveNearestByIdConference`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  // console.log("getApproveNearestById Body is" + JSON.stringify(body));
  console.log("getApproveNearestById RES is" + JSON.stringify(res));
  return res;
}

export async function getListAllDeputyService() {
  const apiUrl = `${hostURL()}/SysUser/getListAllDeputy`;
  const res = await request(apiUrl, "POST", httpOptions, {});
  return res;
}

export async function getOpinionResourcesService(body) {
  const apiUrl = `${hostURL()}/ConferenceOpinionResource/getList`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("ConferenceOpinionResource BODY is" + JSON.stringify(body));
  console.log("bb ConferenceOpinionResource RES is" + JSON.stringify(res));
  return res;
}

export async function deleteOpinionResourcesService(body) {
  const apiUrl = `${hostURL()}/ConferenceOpinionResource/deleteOpinion`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("deleteOpinion BODY is" + JSON.stringify(body));
  console.log("deleteOpinion RES is" + JSON.stringify(res));
  return res;
}

export async function getDashboardService() {
  const apiUrl = `${hostURL()}/Dashboard/getDashboard`;
  const res = await request(apiUrl, "POST", httpOptions, {});
  console.log("bb getDashboardService RES is" + JSON.stringify(res));
  return res;
}

export async function getDashboardConfirmeService(body) {
  const apiUrl = `${hostURL()}/Dashboard/getDashboardConfirme`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("getDashboardConfirmeService RES is" + JSON.stringify(res));
  return res;
}

export async function getListConfernceService(body) {
  const apiUrl = `${hostURL()}/Dashboard/getListConfernce`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("getListConfernceService RES is" + JSON.stringify(res));
  return res;
}

export async function addOpinionResourcesService(body) {
  const apiUrl = `${hostURL()}/ConferenceOpinionResource/add`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("addOpinionResourcesService body is" + JSON.stringify(body));
  console.log("addOpinionResourcesService RES is" + JSON.stringify(res));
  return res;
}

export async function getFeedbackResultService(body) {
  const apiUrl = `${hostURL()}/File/getResult`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log(" bb File/getResult RES is", res);
  return res;
}

export async function getListFileAttachByConferenceService(body) {
  const apiUrl = `${hostURL()}/Attachment/getAttachByCFile`;
  const res = await request(apiUrl, "POST", httpOptions, body);

  console.log("getAttachByCFile RES is" + JSON.stringify(res));
  // setTimeout(() => {
  //     console.log("getAttachByCFile RES is" + JSON.stringify(res));
  // }, 5000);
  return res;
}

export async function getResultByUserIdAndSubjectIdService(body) {
  const apiUrl = `${hostURL()}/Conference/getResultByUserIdAndSubjectId`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log(
    "getResultByUserIdAndSubjectIdService BODY is" + JSON.stringify(body)
  );
  console.log(
    "bb getResultByUserIdAndSubjectIdService RES is" + JSON.stringify(res)
  );
  return res;
}

export async function getCResultBySubjectIdService(body) {
  const apiUrl = `${hostURL()}/Conference/getVoteStatistics`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("getCResultBySubjectIdService RES is" + JSON.stringify(res));
  return res;
}

export async function getCResultBySubjectIdService_2(body) {
  const apiUrl = `${hostURL()}/Conference/getVoteStatistics_2`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("getCResultBySubjectIdService_2 body is" + JSON.stringify(body));
  console.log("getCResultBySubjectIdService_2 RES is" + JSON.stringify(res));
  return res;
}

export async function getInventorySubjectService(body) {
  const apiUrl = `${hostURL()}/Conference/inventorySubject`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("getInventorySubjectService RES is" + JSON.stringify(res));
  return res;
}

export async function getCVoteResultsService(body) {
  const apiUrl = `${hostURL()}/Conference/getConferenceResult`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function cVoteIssueService(body) {
  const apiUrl = `${hostURL()}/Conference/addConferenceResult`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("bb cVoteIssueService RES is" + JSON.stringify(res));
  return res;
}

export async function cVoteListIssueService(body) {
  const apiUrl = `${hostURL()}/Conference/addConferenceListResult`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("cVoteListIssueService BODY is" + JSON.stringify(body));
  console.log("cVoteListIssueService RES is" + JSON.stringify(res));
  return res;
}

export async function getResultBySubjectService(body) {
  const apiUrl = `${hostURL()}/File/getFileResultBySubjectId`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function getListCategoryService() {
  const apiUrl = `${hostURL()}/Category/getListCat`;
  const res = await request(apiUrl, "POST", httpOptions, {});
  console.log("getListCategoryService RES is" + JSON.stringify(res));
  return res;
}

// VĂN KIỆN
export async function getStorageFilesService(body) {
  const apiUrl = `${hostURL()}/FileStore/searchFileIpad`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("getStorageFiles RES is" + JSON.stringify(res));
  return res;
}

export async function getListNotebookMenuService(body) {
  const apiUrl = `${hostURL()}/Conference/getListNotebookMenu`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  // console.log("getListNotebookMenuService RES is" + JSON.stringify(res));
  return res;
}

export async function saveFavoriteFilesService(body) {
  const apiUrl = `${hostURL()}/FileStore/saveFavorite`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function copyFileToFolderService(body) {
  const apiUrl = `${hostURL()}/FileStore/copy`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function deleteFilesService(body) {
  const apiUrl = `${hostURL()}/FileStore/deleteFile`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function moveFilesToFolderService(body) {
  const apiUrl = `${hostURL()}/FileStore/move`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function sendFileToVoOfficeService(body) {
  const apiUrl = `${hostURL()}/File/sendToVoffice`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function getSummaryByFileIdService(body) {
  const apiUrl = `${hostURL()}/File/getSummaryByFileId`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function getListStatusFeedbackService(body) {
  const apiUrl = `${hostURL()}/File/countStatus`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function searchKeywordService(body) {
  const apiUrl = `${hostURL()}/Attachment/search`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("body is" + JSON.stringify(body));
  console.log("RES is" + JSON.stringify(res));
  return res;
}

export async function getDocumentDetailService(body) {
  const apiUrl = `${hostURL()}/Document/detail`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function saveFeedbackAnswerService(body) {
  const apiUrl = `${hostURL()}/File/saveResult`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function sendFeedBackService(body) {
  const apiUrl = `${hostURL()}/File/saveSentApprove`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("bb res feedback is", res);
  return res;
}

export async function recallTrinhFeedBackService(body) {
  const apiUrl = `${hostURL()}/File/saveReturnApproveCV`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("bb res File.saveReturnApproveCV is", res);
  return res;
}

export async function approveOrRejectFeedBack(body) {
  const apiUrl = `${hostURL()}/File/saveApproveDeny`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("bb res File.approveOrRejectFeedBack is", res);
  return res;
}

export async function recallDuyetFeedBackService(body) {
  const apiUrl = `${hostURL()}/File/saveReturnApprove`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("bb res File.recallDuyetFeedBackService is", res);
  return res;
}

export async function insertConferenceParticipantService(body) {
  const apiUrl = `${hostURL()}/Conference/insertConferenceParticipant`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function updateConferenceParticipantService(body) {
  const apiUrl = `${hostURL()}/Conference/updateConferenceParticipantHaveAssigned`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  console.log("updateConferenceParticipantService is" + JSON.stringify(body));
  return res;
}

export async function deleteConferenceParticipantService(body) {
  const apiUrl = `${hostURL()}/Conference/deleteConferenceParticipant`;
  const res = await request(apiUrl, "POST", httpOptions, body);
  return res;
}

export async function denyDepartmentConferenceParticipantService(body) {
    const apiUrl = `${hostURL()}/Conference/denyDepartmentConferenceParticipant`;
    const res = await request(apiUrl, 'POST', httpOptions, body);
    return res;
}

export async function getListAssignParticipantService(body) {
    const apiUrl = `${hostURL()}/SysUser/search`;
    const res = await request(apiUrl, 'POST', httpOptions, body);
    return res;
}

export async function updateConferenceDetailService(body) {
    const apiUrl = `${hostURL()}/Conference/updateConferenceDetail`;
    const res = await request(apiUrl, 'POST', httpOptions, body);
    return res;
}
