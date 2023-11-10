import React, { Component } from "react";
import { connect } from "react-redux";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import {
  Collapse,
  CollapseBody,
  CollapseHeader
} from "accordion-collapse-react-native";
import { Row, Rows, Table } from "react-native-table-component";
import IconM from "react-native-vector-icons/MaterialCommunityIcons";
import Drawer from "react-native-drawer";
import CheckBox from "@react-native-community/checkbox";
import {
  addOpinionResources,
  cVoteIssue,
  cVoteListIssue,
  deleteOpinionResources,
  getCVoteResults,
  getListFileAttachByConference,
  getMeetingById,
  getOpinionResources,
  reloadMeetingScreen,
  removeStatement,
  updateConferenceDetail
} from "../../../redux/actions/meetings.action";
import { updateConferenceWS } from "../../../redux/actions/websocket.action";
import {
  CONFERENCE_STATUS,
  CONST_CHECK_VOTE,
  ISSUE_STATUS,
  PARTICIPANT_STATUS_NAME,
  PERMISSIONS
} from "../const";
import styles from "../style";
import Vote from "./vote";
// import ModalCommentFile from './comment-file';
// import VoteResult from './vote-result';
import VoteResult from "./vote-result-new";
import ShowFiles from "../../document/show-files";
import CustomHeader from "../../../assets/components/header";
import Loading from "../../../assets/components/loading";
import Notify from "../../../assets/components/notify";
import ModalSpeak from "../meeting-schedule-modal-bottom/speak";
import ModalOpine from "../meeting-schedule-modal-bottom/opine";
import { TITLE_MEETING } from "../../../assets/utils/title";
import { Message } from "../../../assets/utils/message";
import { checkPermission } from "../../../assets/utils/utils";
import { hostURL } from "../../../services/service";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";

var threeSecInterval;

class MeetingScheduleDetail extends Component {
  constructor(props) {
    super(props);
    const { width, height } = Dimensions.get("window");

    this.state = {
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
      listDetailContent: [],
      selectedDetailContent: {},
      generalInfo: {
        button: "minus-circle-outline"
      },
      listSpeakers: {
        header: ["STT", "Họ tên", "Chức vụ"],
        body: [],
        button: "plus-circle-outline"
      },
      listOpine: {
        header: ["STT", "Họ tên", "Chức vụ", "Lĩnh vực", "Nội dung góp ý"],
        body: [],
        button: "plus-circle-outline"
      },
      listIssues: {
        header: ["STT", "Nội dung", "Trạng thái", "Thao tác"],
        headerChairman: [
          "STT",
          "Nội dung",
          "Trạng thái",
          "Thao tác",
          "Mở B.quyết"
        ],
        headerCVVP: ["STT", "Nội dung", "Trạng thái"],
        body: [],
        button: "minus-circle-outline"
      },
      isVisibleVoteResult: false,
      isVisibleVote: false,
      selectedIssue: {},
      isVisibleShowFiles: false,
      isVisibleOpine: false,
      isVisibleSpeak: false,
      isAndroid: false,
      bodyOpinionResource: {
        conferenceId: "",
        fileId: ""
      },
      checked: CONST_CHECK_VOTE.NOT_CHECK,
      permission: {
        vote: checkPermission(PERMISSIONS.BIEU_QUYET),
        viewResult: checkPermission(PERMISSIONS.XEM_KQ_BIEU_QUYET),
        control: checkPermission(PERMISSIONS.DIEU_KHIEN),
        opine: checkPermission(PERMISSIONS.CHO_Y_KIEN),
        speak: checkPermission(PERMISSIONS.DANG_KY_PHAT_BIEU)
      },
      firstLoading: true,
      isEditSpeak: false,
      isEditOpinion: false,
      loading: false,
      isVisibleCommentFile: false
    };
    this.onLayout = this.onLayout.bind(this);
    this.voteIssue = this.voteIssue.bind(this);
  }

  onLayout(e) {
    this.setState({
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height
    });
  }

  componentDidMount = async () => {
    const { bodyOpinionResource, permission = {} } = this.state;
    const { level = "" } = this.props.userInfo.appUser;

    const {
      participantAssignedStatusName = "",
      participantStatusName = ""
    } = this.props.navigation.state.params;

    this.setState({
      isCVVP: level === "CVVP",
      isTK: level === "TK_TVCP",
      isAndroid: Platform.OS === "Android",
      isJoined:
        PARTICIPANT_STATUS_NAME.JOIN === participantAssignedStatusName ||
        PARTICIPANT_STATUS_NAME.JOIN === participantStatusName
    });
    const { chosenContent = 0 } = this.props;

    const { lstContent = [], conferenceId = 0, status = 0, userId } = {
      ...this.props.selectedMeeting
    };
    const isShowBottomButtons =
      status === CONFERENCE_STATUS.DA_GUI ||
      status === CONFERENCE_STATUS.DANG_HOP;
    const isConferenceNotEnd = status !== CONFERENCE_STATUS.DA_KET_THUC;
    const isConferenceNotCancel = status !== CONFERENCE_STATUS.TU_CHOI;
    const checkConferenceCheckbox =
      isConferenceNotEnd &&
      isConferenceNotCancel &&
      status !== CONFERENCE_STATUS.CHUA_GUI &&
      status !== CONFERENCE_STATUS.CHO_PHE_DUYET;
    const isChairman =
      userId === this.props.userInfo.appUser.id || permission.control;

    if (lstContent.length !== 0) {
      lstContent[chosenContent] = {
        ...lstContent[chosenContent],
        selected: true
      };
      const { fileId, departmentId, userId: cUserId } = lstContent[
        chosenContent
      ];

      const bodyReqListAttach = {
        objectType: "CONFERENCE_FILE",
        conferenceFile: {
          departmentId,
          fileId,
          userId: cUserId
        },
        objectId: fileId,
        type: ""
      };
      await this.props.getListFileAttachByConference(bodyReqListAttach);

      this.setState(
        {
          listDetailContent: lstContent,
          selectedDetailContent:
            lstContent.length > 0 ? lstContent[chosenContent] : {},
          bodyOpinionResource: {
            ...bodyOpinionResource,
            conferenceId,
            fileId: lstContent.length > 0 ? lstContent[chosenContent].fileId : 0
          },
          isShowBottomButtons,
          selectedContentInd: chosenContent,
          isChairman,
          isConferenceNotEnd,
          isConferenceNotCancel,
          checkConferenceCheckbox
        },
        async () => {
          await Promise.all([this.getListOpine(), this.getListSpeak()]);
          this.renderDataTable();
        }
      );
    }
    this.callAutoReloadDS();
  };

  componentDidUpdate = async prevProps => {
    if (this.props.wsConferenceId === null) return;

    const { conferenceId } = this.state.selectedMeeting;
    if (
      this.props.wsConferenceId !== prevProps.wsConferenceId &&
      this.props.wsConferenceId === conferenceId
    ) {
      await this.props.updateConferenceWS(null);
      this.onRefresh();
    }
  };

  callAutoReloadDS() {
    threeSecInterval = setInterval(() => {
      this.handleReloadDS();
    }, 5000);
  }

  stopCallingAutoReload() {
    clearInterval(threeSecInterval);
  }

  componentWillUnmount() {
    this.stopCallingAutoReload();
  }

  handleReloadPage = async (type = "") => {
    const {
      conferenceId,
      fileId,
      departmentId,
      userId: cUserId
    } = this.state.selectedDetailContent;
    const { selectedContentInd } = this.state;

    const bodyReqListAttach = {
      objectType: "CONFERENCE_FILE",
      conferenceFile: {
        departmentId,
        fileId,
        userId: cUserId
      },
      objectId: fileId,
      type: ""
    };

    await Promise.all([
      this.props.getMeetingById({ id: conferenceId }),
      this.props.getListFileAttachByConference(bodyReqListAttach)
    ]);

    const { lstContent = [] } = this.props.selectedMeeting;
    lstContent[selectedContentInd] = {
      ...lstContent[selectedContentInd],
      selected: true
    };

    this.setState(
      {
        listDetailContent: lstContent,
        selectedDetailContent: lstContent[selectedContentInd]
      },
      async () => {
        await Promise.all([this.getListOpine(), this.getListSpeak()]);
        this.renderDataTable(type);
      }
    );
  };

  handleReloadDS = async (type = "") => {
    this.setState(
      {
        // listDetailContent: lstContent,
        // selectedDetailContent: lstContent[selectedContentInd],
      },
      async () => {
        await Promise.all([this.getListOpine(), this.getListSpeak()]);
        this.renderDataTable(type);
      }
    );
  };

  getListOpine = async () => {
    const { bodyOpinionResource } = this.state;
    await this.props.getOpinionResources({
      conferenceFileEntity: bodyOpinionResource,
      isPhatBieu: false
    });
  };

  getListSpeak = async () => {
    const { bodyOpinionResource } = this.state;
    await this.props.getOpinionResources({
      conferenceFileEntity: bodyOpinionResource,
      isPhatBieu: true
    });
  };

  renderItem = ({ item, index }) => {
    const { title = "", selected = false } = item;

    return (
      <TouchableOpacity onPress={this.selectDetailContent(item, index)}>
        <View
          style={[
            styles.boderBottom,
            styles.containerItem,
            { backgroundColor: selected ? "#d6e2f3" : "#fff" }
          ]}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 14 }}>
              <Text>{`${index + 1}. ${title}`}</Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderDataTable = (type = "") => {
    const {
      listSpeakers = {},
      listOpine = {},
      listIssues = {},
      selectedDetailContent,
      isChairman,
      isConferenceNotEnd,
      isCVVP,
      permission = {},
      isJoined = false,
      notify
    } = this.state;
    const { subjects = [], lstFileAttach = [] } = selectedDetailContent;
    const { listFileAttachByConference = [] } = this.props;

    const listIssuesBody = [];
    const listFileActtach = [];

    subjects.forEach((element, index) => {
      const stt = index + 1;
      const {
        title = "",
        generateStatusCode = 0,
        subjectId,
        vote,
        changeVote,
        isVoted
      } = element;
      const itemData = [
        <Text
          style={{
            textAlign: "center",
            textAlignVertical: "center",
            fontSize: 13
          }}
        >
          {stt}
        </Text>,
        <Text style={styles.contentTableText}>{title}</Text>,
        <View
          style={[
            styles.issueStatus,
            { backgroundColor: ISSUE_STATUS[generateStatusCode].color }
          ]}
        >
          <IconM
            name={ISSUE_STATUS[generateStatusCode].icon}
            size={18}
            color={"#fff"}
          />
        </View>
      ];
      if (
        !isCVVP ||
        (isCVVP && isJoined) ||
        (isCVVP && permission.viewResult)
      ) {
        if (isConferenceNotEnd) {
          itemData.push(
            <View>
              {generateStatusCode !== 1 && (
                <View
                  style={{
                    margin: 7,
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center"
                  }}
                >
                  {generateStatusCode === 2 &&
                    permission.vote &&
                    isJoined &&
                    (changeVote == 1 || (changeVote == 0 && isVoted == 0)) && (
                      <TouchableOpacity
                        style={styles.buttonVote}
                        onPress={() =>
                          this.setState({
                            selectedIssue: element,
                            isVisibleVote: true
                          })
                        }
                      >
                        <IconM name={"vote"} size={18} color={"#fff"} />
                      </TouchableOpacity>
                    )}
                  {/* vote === 1 : mo bieu quyet
                                      changeVote: duoc vote lai hay khong (1 : duoc vote lại, 0: khong duoc vote lại)
                                      generateStatusCode === 4 : da bieu quyet
                                  */}
                  {generateStatusCode === 4 &&
                    permission.vote &&
                    isJoined &&
                    changeVote === "1" &&
                    vote === 1 && (
                      <TouchableOpacity
                        style={styles.buttonVote}
                        onPress={() => {
                          this.setState({
                            selectedIssue: element,
                            isVisibleVote: true
                          });
                        }}
                      >
                        <IconM name={"restore"} size={18} color={"#fff"} />
                      </TouchableOpacity>
                    )}
                  {/* {permission.viewResult && ( */}
                  <TouchableOpacity
                    style={styles.buttonViewResult}
                    onPress={() => this.getVoteResult(element, subjectId)}
                  >
                    <IconM name={"file-search"} size={18} color={"#fff"} />
                  </TouchableOpacity>
                  {/* )} */}
                </View>
              )}
            </View>
          );
        } else {
          itemData.push(null);
        }
      } else if (isChairman) {
        itemData.push(null);
      }
      if (isChairman && isConferenceNotEnd) {
        itemData.push(
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                paddingRight: 10
              }}
            >
              <CheckBox
                value={vote === 1}
                tintColor={"grey"}
                boxType={"square"}
                onCheckColor={"#4281D0"}
                tintColors={{ true: "#4281D0", false: "grey" }}
                style={[
                  { height: 21, width: 21 },
                  Platform.OS === "android" && {
                    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]
                  }
                ]}
                onValueChange={() => {
                  const newSubject = { ...element, vote: vote === 1 ? 0 : 1 };
                  const newSubjects = [...subjects];
                  newSubjects[index] = newSubject;

                  this.setState(
                    {
                      loading: true,
                      selectedDetailContent: {
                        ...selectedDetailContent,
                        subjects: newSubjects
                      },
                      oldSubjects: subjects
                    },
                    async () => {
                      this.renderDataTable();
                      await this.handleControlContent("moBieuQuyet");
                    }
                  );
                }}
                noFeedback
              />
            </View>
          </View>
        );
      }
      listIssuesBody.push(itemData);
    });

    lstFileAttach.forEach((element, index) => {
      const { name = "", attachmentId } = element;
      const isPDF = name.slice(name.length - 3) === "pdf";
      const itemData = (
        <TouchableOpacity
          onPress={() => this.checkToOpenFile(attachmentId, name, isPDF)}
          key={`lstFileAttach${index.toString()}`}
        >
          <View style={[styles.flexRowAlignCenter, { paddingRight: 10 }]}>
            <IconM
              name={isPDF ? "file-pdf-outline" : "file-document-outline"}
              size={25}
              color={"#f79e8e"}
            />
            <Text
              style={{
                color: "#316ec4",
                fontWeight: "bold",
                fontSize: 13,
                paddingLeft: 5,
                paddingVertical: 3
              }}
            >
              {name}
            </Text>
          </View>
        </TouchableOpacity>
        // <View style={[styles.flexRowSpaceBetween]}>
        //   <TouchableOpacity
        //     onPress={() => this.checkToOpenFile(attachmentId, name, isPDF)}
        //     key={`lstFileAttach${index.toString()}`}
        //   >
        //     <View style={[styles.flexRowAlignCenter]}>
        //       <IconM
        //         name={isPDF ? "file-pdf-outline" : "file-document-outline"}
        //         size={25}
        //         color={"#f79e8e"}
        //       />
        //       <Text
        //         style={{
        //           color: "#316ec4",
        //           fontWeight: "bold",
        //           fontSize: 13,
        //           paddingLeft: 5,
        //           paddingVertical: 3,
        //           maxWidth: '85%',
        //         }}
        //       >
        //         {name}
        //       </Text>
        //     </View>
        //   </TouchableOpacity>
        //   <TouchableOpacity
        //   style={{paddingTop:3}}
        //     onPress={() => this.checkToOpenCommnentFile(name)}
        //     key={`lstFileAttach${index.toString()}`}
        //   >
        //     <IconM
        //       name={"comment-processing-outline"}
        //       size={25}
        //       color={"#316ec4"}
        //     />
        //   </TouchableOpacity>
        // </View>
      );
      listFileActtach.push(itemData);
    });

    listFileAttachByConference.forEach((element, index) => {
      const { name = "", attachmentId } = element;
      const isPDF = name.slice(name.length - 3) === "pdf";
      const itemData = (
        <TouchableOpacity
          onPress={() => this.checkToOpenFile(attachmentId, name, isPDF)}
          key={`lstNewFileAttach${index.toString()}`}
        >
          <View style={[styles.flexRowAlignCenter, { paddingRight: 10 }]}>
            <IconM
              name={isPDF ? "file-pdf-outline" : "file-document-outline"}
              size={25}
              color={"#f79e8e"}
            />
            <Text
              style={{
                color: "#316ec4",
                fontWeight: "bold",
                fontSize: 13,
                paddingLeft: 5,
                paddingVertical: 3
              }}
            >
              {name}
            </Text>
          </View>
        </TouchableOpacity>
      );
      listFileActtach.push(itemData);
    });

    this.setState({
      listIssues: { ...listIssues, body: listIssuesBody },
      totalAttachFile: lstFileAttach.length + listFileAttachByConference.length,
      listFileActtach,
      reloading: false,
      firstLoading: false,
      loading: false,
      isVisibleNotify:
        type === "moBieuQuyet" || type === "bieuQuyet" ? true : false,
      notify: type === "moBieuQuyet" ? "Thao tác thành công" : notify
    });
    const listSpeakersBody = this.renderListSpeaker();
    const listOpineBody = this.renderListOpine();
    this.setState({
      listSpeakers: { ...listSpeakers, body: listSpeakersBody },
      listOpine: { ...listOpine, body: listOpineBody }
    });
  };

  getUrlDownload = id => {
    const { sessionId = "" } = this.props;
    const remoteUri = `${hostURL()}/Attachment/get?id=${id}&session=${sessionId}`;
    return remoteUri;
  };

  handleViewFile = async (id, name) => {
    const url = this.getUrlDownload(id);
    // Alert.alert(url+"")
    let localFile = `${RNFS.DocumentDirectoryPath}/temporaryfile`;
    if (name.indexOf(".docx") > -1) localFile = `${localFile}.docx`;
    else if (name.indexOf(".doc") > -1) localFile = `${localFile}.doc`;
    else if (name.indexOf(".xlsx") > -1) localFile = `${localFile}.xlsx`;
    else if (name.indexOf(".xls") > -1) localFile = `${localFile}.xls`;
    else if (name.indexOf(".pptx") > -1) localFile = `${localFile}.pptx`;
    else if (name.indexOf(".ppt") > -1) localFile = `${localFile}.ppt`;
    else if (name.indexOf(".txt") > -1) localFile = `${localFile}.txt`;

    const options = {
      fromUrl: url,
      toFile: localFile
    };
    RNFS.downloadFile(options)
      .promise.then(() => FileViewer.open(localFile))
      .then(() => {
        // success
      })
      .catch(error => {
        Alert.alert(
          "Thông báo",
          "Thiết bị chưa được cài ứng dụng đọc file, vui lòng cài đặt và thử lại!"
        );
        console.log(error);
      });
  };

  checkToOpenFile = (attachmentId, name, isPdf) => {
    if (isPdf) {
      this.setState({
        isVisibleShowFiles: true,
        selectedAttachFile: attachmentId,
        tenFileGiayMoi: name
      });
    } else {
      this.handleViewFile(attachmentId, name);
    }
  };

  checkToOpenCommnentFile = name => {
    this.setState({ isVisibleCommentFile: true, tenFileGiayMoi: name });
  };

  renderListSpeaker = () => {
    const listSpeakersBody = [];
    this.props.listSpeak.forEach((element, index) => {
      const stt = index + 1;
      const { name = "", positions = "" } = element;
      const itemData = [
        <Text
          style={{
            textAlign: "center",
            textAlignVertical: "center",
            fontSize: 13
          }}
        >
          {stt}
        </Text>,
        <Text style={styles.contentTableText}>{name}</Text>,
        <Text style={styles.contentTableText}>{positions}</Text>
      ];
      listSpeakersBody.push(itemData);
    });
    return listSpeakersBody;
  };

  renderListSpeakerWithoutDeleteButton = isEditSpeak => {
    const listSpeakersBody = [];
    this.props.listSpeak.forEach((element, index) => {
      const stt = index + 1;
      const { name = "", positions = "" } = element;
      const itemData = [
        <Text
          style={{
            textAlign: "center",
            textAlignVertical: "center",
            fontSize: 13
          }}
        >
          {stt}
        </Text>,
        <Text style={styles.contentTableText}>{name}</Text>,
        <Text style={styles.contentTableText}>{positions}</Text>
      ];
      listSpeakersBody.push(itemData);
    });
    this.setState({
      listSpeakers: { ...this.state.listSpeakers, body: listSpeakersBody },
      isEditSpeak: !isEditSpeak
    });
  };

  renderListSpeakerWithDeleteButton = isEditSpeak => {
    const { status = 0 } = { ...this.props.selectedMeeting };
    const currentUserId = this.props.userInfo.appUser.id;
    const { isChairman } = this.state;
    const listSpeakersBody = [];
    this.props.listSpeak.forEach((element, index) => {
      const stt = index + 1;
      const {
        name = "",
        positions = "",
        userId,
        conferenceId,
        conferenceFileId
      } = element;
      const isSpeaker = currentUserId === userId;
      const itemData = [
        ((status === 3 || status === 2) && isSpeaker) || isChairman ? (
          <TouchableOpacity
            style={{
              justifyContent: "center",
              flexDirection: "row"
            }}
            onPress={() => {
              Alert.alert("Xác nhận", "Đồng chí có muốn xoá phát biểu này?", [
                {
                  text: "Huỷ",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                {
                  text: "Xoá",
                  onPress: () =>
                    this.handleRemoveStatement(
                      conferenceId,
                      userId,
                      conferenceFileId
                    )
                }
              ]);
            }}
          >
            <IconM
              style={styles.buttonDelete}
              name={"delete-outline"}
              size={20}
              color={"#fff"}
            />
          </TouchableOpacity>
        ) : (
          <Text
            style={{
              textAlign: "center",
              textAlignVertical: "center",
              fontSize: 13
            }}
          >
            {stt}
          </Text>
        ),
        <Text style={styles.contentTableText}>{name}</Text>,
        <Text style={styles.contentTableText}>{positions}</Text>
      ];
      listSpeakersBody.push(itemData);
    });
    this.setState({
      listSpeakers: { ...this.state.listSpeakers, body: listSpeakersBody },
      isEditSpeak: !isEditSpeak
    });
  };

  handleDeleteOpinion = conferenceOpinionId => {
    setTimeout(async () => {
      const res = await this.props.deleteOpinionResources({
        conferenceOpinionId
      });
      const notify = res === "true" ? "OK" : Message.MSG0003;

      if (notify === "OK") {
        await this.getListOpine();
        const listOpineBody = this.renderListOpine();
        this.setState({
          listOpine: { ...this.state.listOpine, body: listOpineBody },
          isEditOpinion: false
        });
      } else {
        this.setState({
          notify: notify,
          isVisibleNotify: true
        });
      }
    }, 450);
  };

  handleRemoveStatement = (conferenceId, userId, conferenceFileId) => {
    setTimeout(async () => {
      const res = await this.props.removeStatement({
        conferenceId,
        userId,
        conferenceFileId
      });
      const notify = res === "true" ? "OK" : Message.MSG0003;

      if (notify === "OK") {
        await this.getListSpeak();
        const listSpeakersBody = this.renderListSpeaker();

        this.setState({
          listSpeakers: { ...this.state.listSpeakers, body: listSpeakersBody },
          isEditSpeak: false
        });
      } else {
        this.setState({
          notify: notify,
          isVisibleNotify: true
        });
      }
    }, 450);
  };

  renderListOpinionWithDeleteButton = isEditOpinion => {
    const listOpineBody = [];
    const { status = 0 } = { ...this.props.selectedMeeting };
    const currentUserId = this.props.userInfo.appUser.id;
    const { isChairman } = this.state;
    this.props.listOpine.forEach((element, index) => {
      const stt = index + 1;
      const {
        name = "",
        positions = "",
        field = "",
        content = "",
        userId,
        conferenceOpinionId
      } = element;
      const isSpeaker = currentUserId === userId;
      const itemData = [
        ((status === 3 || status === 2) && isSpeaker) || isChairman ? (
          <TouchableOpacity
            style={{
              justifyContent: "center",
              flexDirection: "row"
            }}
            onPress={() => {
              Alert.alert("Xác nhận", "Đồng chí có muốn xoá ý kiến này?", [
                {
                  text: "Huỷ",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                {
                  text: "Xoá",
                  onPress: () => this.handleDeleteOpinion(conferenceOpinionId)
                }
              ]);
            }}
          >
            <IconM
              style={styles.buttonDelete}
              name={"delete-outline"}
              size={20}
              color={"#fff"}
            />
          </TouchableOpacity>
        ) : (
          <Text
            style={{
              textAlign: "center",
              textAlignVertical: "center",
              fontSize: 13
            }}
          >
            {stt}
          </Text>
        ),
        <Text style={styles.contentTableText}>{name}</Text>,
        <Text style={styles.contentTableText}>{positions}</Text>,
        <Text style={styles.contentTableText}>{field}</Text>,
        <Text style={styles.contentTableText}>{content}</Text>
      ];
      listOpineBody.push(itemData);
    });
    this.setState({
      listOpine: { ...this.state.listOpine, body: listOpineBody },
      isEditOpinion: !isEditOpinion
    });
  };

  renderListOpinionWithoutDeleteButton = isEditOpinion => {
    const listOpineBody = [];
    this.props.listOpine.forEach((element, index) => {
      const stt = index + 1;
      const { name = "", positions = "", field = "", content = "" } = element;
      const itemData = [
        <Text
          style={{
            textAlign: "center",
            textAlignVertical: "center",
            fontSize: 13
          }}
        >
          {stt}
        </Text>,
        <Text style={styles.contentTableText}>{name}</Text>,
        <Text style={styles.contentTableText}>{positions}</Text>,
        <Text style={styles.contentTableText}>{field}</Text>,
        <Text style={styles.contentTableText}>{content}</Text>
      ];
      listOpineBody.push(itemData);
    });
    this.setState({
      listOpine: { ...this.state.listOpine, body: listOpineBody },
      isEditOpinion: !isEditOpinion
    });
  };

  renderListOpine = () => {
    const listOpineBody = [];
    this.props.listOpine.forEach((element, index) => {
      const stt = index + 1;
      const { name = "", positions = "", field = "", content = "" } = element;
      const itemData = [
        <Text
          style={{
            textAlign: "center",
            textAlignVertical: "center",
            fontSize: 13
          }}
        >
          {stt}
        </Text>,
        <Text style={styles.contentTableText}>{name}</Text>,
        <Text style={styles.contentTableText}>{positions}</Text>,
        <Text style={styles.contentTableText}>{field}</Text>,
        <Text style={styles.contentTableText}>{content}</Text>
      ];
      listOpineBody.push(itemData);
    });
    return listOpineBody;
  };

  selectDetailContent = (item, ind) => async () => {
    const { listDetailContent = [] } = this.state;
    const newList = listDetailContent.map((element, index) =>
      ind === index
        ? { ...element, selected: true }
        : { ...element, selected: false }
    );

    await Promise.all([this.getListOpine(), this.getListSpeak()]);
    this.setState(
      {
        listDetailContent: newList,
        selectedDetailContent: item,
        bodyOpinionResource: {
          ...this.state.bodyOpinionResource,
          conferenceId: this.props.chosenMeeting.conferenceId,
          fileId: item.fileId
        },
        selectedContentInd: ind
      },
      async () => {
        this._drawer.close();
        this.onCloseDrawer();
        this.renderDataTable();
      }
    );
  };

  getVoteResult = async (element, subjectId) => {
    this.setState({
      selectedIssue: element,
      isVisibleVoteResult: true,
      subjectId
    });
  };

  voteIssue = async () => {
    const { conferenceId } = this.state.selectedDetailContent;
    let { bodyReqVote } = this.state;
    // if (isAndroid) {
    //   if (checked === -1 ||
    //       !bodyReqVote ||
    //       Object.keys(bodyReqVote).length === 0 ||
    //       (bodyReqVote.content === '' &&
    //           bodyReqVote.no === CONST_CHECK_VOTE.NOT_CHECK)
    //   ) {
    //     this.setState({
    //       isVisibleNotify: true,
    //       notify:
    //           'Đồng chí cần chọn phương án biểu quyết hoặc nhập ý kiến biểu quyết',
    //     });
    //     return;
    //   } else if (bodyReqVote.content.length === 0 && checked === 0 ) {
    //     this.setState({
    //       isVisibleNotify: true,
    //       notify:
    //           'Đồng chí cần nhập ý kiến biểu quyết',
    //     });
    //     return;
    //   }
    // }
    this.setState({
      isVisibleVote: false,
      loading: true
    });
    bodyReqVote = {
      ...bodyReqVote,
      conferenceId
    };
    const res = await this.props.cVoteIssue(bodyReqVote);
    await this.handleReloadPage("bieuQuyet");
    this.setState({
      checked: CONST_CHECK_VOTE.NOT_CHECK,
      notify: JSON.parse(res) ? Message.MSG0018 : Message.MSG0003
    });
  };

  voteMultipleIssue = async bodyRequestVote => {
    this.setState({
      isVisibleVote: false
    });

    const { conferenceId } = this.state.selectedDetailContent;

    let bodyReqVote = {
      ...bodyRequestVote,
      conferenceId,
      selected: "false"
    };
    const res = await this.props.cVoteListIssue(bodyReqVote);
    await this.handleReloadPage("bieuQuyet");
    this.setState({
      isVisibleNotify: true,
      notify: JSON.parse(res) ? Message.MSG0018 : Message.MSG0003
    });
  };

  handleCheckVote = (checked, bodyReqVote, isGetAnswer = false) => {
    if (checked !== CONST_CHECK_VOTE.NOT_CHECK) {
      if (this.state.checked === checked && !isGetAnswer) {
        this.setState({
          checked: CONST_CHECK_VOTE.NOT_CHECK,
          bodyReqVote: {
            ...bodyReqVote,
            subjectItemId: undefined,
            no: undefined
          }
        });
      } else {
        this.setState({
          checked,
          bodyReqVote
        });
      }
    } else {
      const { content = "" } = bodyReqVote;
      const { bodyReqVote: bodyReqVoteState = {} } = this.state;
      this.setState({
        bodyReqVote:
          Object.keys(bodyReqVoteState).length === 0
            ? bodyReqVote
            : { ...bodyReqVoteState, content }
      });
    }
  };

  onOpenDrawer = () => {
    this.setState({
      isDrawerOpen: true
    });
  };

  onCloseDrawer = () => {
    this.setState({
      isDrawerOpen: false
    });
  };

  handleRotate = event => {
    const { nativeEvent: { layout: { width, height } = {} } = {} } = event;
    this.setState({
      width,
      height
    });
  };

  openControlPanel = () => {
    if (!this.state.isDrawerOpen) {
      this._drawer.open();
      this.setState({
        isDrawerOpen: true
      });
    } else {
      this._drawer.close();
      this.setState({
        isDrawerOpen: false
      });
    }
  };

  handleChangeButton = (isCollapsed, index) => {
    switch (index) {
      case 1: {
        const { generalInfo = {} } = this.state;
        return this.setState({
          generalInfo: {
            ...generalInfo,
            button: this.getCollapsedIcon(isCollapsed)
          }
        });
      }

      case 2: {
        const { listSpeakers = {} } = this.state;
        return this.setState({
          listSpeakers: {
            ...listSpeakers,
            button: this.getCollapsedIcon(isCollapsed)
          }
        });
      }

      case 3: {
        const { listOpine = {} } = this.state;
        return this.setState({
          listOpine: {
            ...listOpine,
            button: this.getCollapsedIcon(isCollapsed)
          }
        });
      }

      case 4: {
        const { listIssues = {} } = this.state;
        return this.setState({
          listIssues: {
            ...listIssues,
            button: this.getCollapsedIcon(isCollapsed)
          }
        });
      }
      default:
        return null;
    }
  };

  getCollapsedIcon = isCollapsed => {
    return isCollapsed ? "minus-circle-outline" : "plus-circle-outline";
  };

  showNotify = async (notify, modalName) => {
    setTimeout(() => {
      this.setState({
        notify,
        isVisibleNotify: true
      });
    }, 500);

    if (modalName === "speak") {
      await this.getListSpeak();

      const listSpeakersBody = this.renderListSpeaker();
      this.setState({
        listSpeakers: { ...this.state.listSpeakers, body: listSpeakersBody }
      });
    }
    if (modalName === "opine") {
      await this.getListOpine();

      const listOpineBody = this.renderListOpine();
      this.setState({
        listOpine: { ...this.state.listOpine, body: listOpineBody }
      });
    }
  };

  handleControlContent = async type => {
    const {
      selectedDetailContent,
      selectedContentInd,
      oldStatus,
      oldSubjects,
      listDetailContent = []
    } = this.state;
    const { subjects } = selectedDetailContent;
    const { selectedMeeting } = this.props;
    const { conferenceId, status } = selectedMeeting;
    const newLstContent =
      type === "dangHop"
        ? [...listDetailContent].map(element => {
            const { status: statusElement } = element;
            if (statusElement === 1) return { ...element, status: 0 };
            return element;
          })
        : [...listDetailContent];
    newLstContent[selectedContentInd] = selectedDetailContent;

    const bodyReq = {
      conferenceId,
      status,
      lstContent: newLstContent
    };

    await this.props.updateConferenceDetail(bodyReq);
    if (this.props.resultUpdateConferenceDetail) {
      this.setState(
        {
          isVisibleNotify: type === "moBieuQuyet" ? false : true,
          notify: type === "moBieuQuyet" ? "" : "Thao tác thành công!",
          oldStatus: status,
          oldSubjects: subjects,
          listDetailContent: newLstContent,
          loading: type === "moBieuQuyet" ? true : false
        },
        async () => {
          if (type === "moBieuQuyet") {
            setTimeout(() => {
              this.handleReloadPage("moBieuQuyet");
            }, 100);
          } else {
            await this.props.reloadMeetingScreen(true);
          }
        }
      );
    } else {
      this.setState(
        {
          loading: false,
          isVisibleNotify: true,
          notify: "Thao tác không thành công!",
          selectedDetailContent: {
            ...selectedDetailContent,
            status: oldStatus,
            subjects: oldSubjects
          }
        },
        () => {
          this.renderDataTable();
        }
      );
    }
  };

  onRefresh = () => {
    this.setState(
      {
        reloading: true
      },
      async () => this.handleReloadPage()
    );
  };

  handleGoBack = async () => {
    this.props.navigation.navigate("MeetingScheduleScreen", { from: "Detail" });
  };

  render() {
    const {
      width,
      height,
      generalInfo = { button: "minus-circle-outline" },
      listSpeakers = { header: [], body: [], button: "plus-circle-outline" },
      listOpine = { header: [], body: [], button: "plus-circle-outline" },
      listIssues = { header: [], body: [], button: "minus-circle-outline" },
      listFileActtach = [],
      selectedIssue,
      isVisibleVoteResult = false,
      isVisibleVote = false,
      isVisibleShowFiles = false,
      listDetailContent = [],
      selectedDetailContent = {},
      isVisibleNotify = false,
      notify = "",
      isVisibleOpine = false,
      isVisibleSpeak = false,
      isShowBottomButtons = false,
      selectedAttachFile,
      tenFileGiayMoi,
      isChairman = false,
      isConferenceNotEnd = false,
      isConferenceNotCancel = false,
      checkConferenceCheckbox = false,
      isCVVP = false,
      isTK = false,
      totalAttachFile = 0,
      permission = {},
      firstLoading = true,
      isEditSpeak = false,
      isEditOpinion = false,
      loading = false,
      isJoined = false,
      isVisibleCommentFile = false,
      isAndroid = false
    } = this.state;

    const {
      conferenceId,
      departmentName = "",
      userFullName = "",
      status
    } = selectedDetailContent;

    let flexArr = [];
    let headerTable = [];

    if (isCVVP && !isChairman) {
      flexArr = [2, 13, 4];
      headerTable = listIssues.headerCVVP;
    } else if (isChairman && isConferenceNotEnd && isConferenceNotCancel) {
      flexArr = [2, 7, 3, 4, 3];
      headerTable = listIssues.headerChairman;
    } else {
      flexArr = [2, 10, 3, 4];
      headerTable = listIssues.header;
    }
    return (
      <View
        onLayout={this.onLayout}
        style={[styles.container, { backgroundColor: "#fff" }]}
      >
        <CustomHeader
          haveMenu
          onPressButton={this.openControlPanel}
          title={"Lịch họp"}
          // title={'Họp uỷ ban nhân dân'}
        />

        <Drawer
          type={"overlay"}
          ref={ref => (this._drawer = ref)}
          content={
            <View style={styles.drawerContainer}>
              <View style={styles.boderBottom}>
                <Text style={styles.drawerTitle}>{"Nội dung phiên họp"}</Text>
              </View>

              <View style={[styles.boderBottom, styles.drawerTitleTotal]}>
                <View style={{ flexDirection: "row", paddingTop: 1 }}>
                  <Text>{"Tổng số "}</Text>
                  <Text style={{ color: "#316ec4", fontWeight: "bold" }}>
                    {listDetailContent.length}
                  </Text>
                  <Text>{" nội dung"}</Text>
                </View>
              </View>

              <FlatList
                data={listDetailContent}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderItem}
                showsVerticalScrollIndicator={false}
              />
            </View>
          }
          tapToClose
          onOpen={this.onOpenDrawer}
          onClose={this.onCloseDrawer}
          openDrawerOffset={0.2}
          closedDrawerOffset={-3}
          tweenHandler={ratio => ({
            main: { opacity: (2 - ratio) / 2 }
          })}
        >
          <View
            style={[
              { flexDirection: "row", justifyContent: "space-between" },
              { marginBottom: 15, backgroundColor: "#f5f5f5" }
            ]}
          >
            <TouchableOpacity
              style={[{ backgroundColor: "#f5f5f5" }]}
              onPress={this.handleGoBack}
            >
              <View
                style={[
                  {
                    width: 40,
                    paddingTop: 5,
                    paddingBottom: 5,
                    paddingStart: 10
                  }
                ]}
              >
                <IconM name={"chevron-left"} size={32} color={"#222"} />
              </View>
            </TouchableOpacity>
            {!isCVVP && !isTK && isShowBottomButtons ? (
              <View
                style={[
                  styles.flexRowAlignCenter,
                  { justifyContent: "flex-start" }
                ]}
              >
                {permission.speak && (
                  <TouchableOpacity
                    disabled={!isJoined}
                    onPress={() => this.setState({ isVisibleSpeak: true })}
                  >
                    <View
                      style={[
                        styles.flexRowAlignCenter,
                        {
                          marginStart: 5,
                          marginEnd: 5,
                          paddingVertical: 8,
                          width: 95,
                          justifyContent: "center",
                          borderRadius: 4,
                          backgroundColor: isJoined ? "#1aa199" : "#aaaaaa"
                        }
                      ]}
                    >
                      <IconM
                        name={"chat-processing"}
                        size={18}
                        color={"#fff"}
                      />
                      <Text
                        style={{ color: "#fff", textTransform: "uppercase" }}
                      >
                        {"Phát biểu"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                {permission.opine && (
                  <TouchableOpacity
                    onPress={() => this.setState({ isVisibleOpine: true })}
                  >
                    <View
                      style={[
                        styles.flexRowAlignCenter,
                        {
                          paddingVertical: 8,
                          width: 75,
                          justifyContent: "center",
                          marginEnd: 5,
                          borderRadius: 4,
                          backgroundColor: "#316ec4"
                        }
                      ]}
                    >
                      <IconM name={"wechat"} size={18} color={"#fff"} />
                      <Text
                        style={{ color: "#fff", textTransform: "uppercase" }}
                      >
                        {"Ý kiến"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View
                style={[
                  styles.flexRowAlignCenter,
                  { justifyContent: "flex-end", flex: 4 }
                ]}
              />
            )}
          </View>
          {/* HEADER */}
          <View
            style={[
              styles.headerBodyContent,
              { justifyContent: "space-evenly" }
            ]}
          >
            <View>
              <Text style={styles.headerTextContent}>
                {"Chi tiết nội dung"}
              </Text>
            </View>
          </View>

          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.reloading}
                onRefresh={this.onRefresh}
              />
            }
          >
            <TouchableWithoutFeedback>
              <View style={styles.subContainer}>
                {/* DETAIL */}
                <View
                  style={[
                    styles.detailContainer,
                    { width: this.state.width + 5 }
                  ]}
                >
                  {isChairman && checkConferenceCheckbox && (
                    <View style={{ paddingLeft: 10 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          paddingRight: 10,
                          width: "45%"
                        }}
                      >
                        <CheckBox
                          tintColor={"grey"}
                          boxType={"square"}
                          onCheckColor={"#4281D0"}
                          tintColors={{ true: "#4281D0", false: "grey" }}
                          style={[
                            { height: 21, width: 21 },
                            isAndroid && {
                              transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]
                            }
                          ]}
                          value={status === 1}
                          // customLabel={<Text>{'Đang họp'}</Text>}
                          // checkedComponent={<IconM name={'check'} size={25} color="#222" />}
                          onValueChange={() => {
                            this.setState(
                              {
                                oldStatus: status,
                                selectedDetailContent: {
                                  ...selectedDetailContent,
                                  status: status === 1 ? 0 : 1,
                                  selected: true
                                }
                              },
                              async () => {
                                await this.handleControlContent("dangHop");
                              }
                            );
                          }}
                          noFeedback
                        />
                        <Text style={{ marginLeft: 20 }}>{"Đang họp"}</Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          paddingRight: 10,
                          marginTop: isAndroid ? 15 : 5,
                          width: "45%"
                        }}
                      >
                        <CheckBox
                          value={status === -1}
                          tintColor={"grey"}
                          boxType={"square"}
                          onCheckColor={"#4281D0"}
                          tintColors={{ true: "#4281D0", false: "grey" }}
                          style={[
                            { height: 21, width: 21 },
                            isAndroid && {
                              transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]
                            }
                          ]}
                          // checkedComponent={
                          //   <IconM name={'check'} size={25} color='#222' />
                          // }
                          onValueChange={() => {
                            this.setState(
                              {
                                oldStatus: status,
                                selectedDetailContent: {
                                  ...selectedDetailContent,
                                  status: status === -1 ? 0 : -1,
                                  selected: true
                                }
                              },
                              async () => {
                                await this.handleControlContent("anNoiDung");
                              }
                            );
                          }}
                          noFeedback
                        />
                        <Text style={{ marginLeft: 20 }}>{"Ẩn nội dung"}</Text>
                      </View>
                    </View>
                  )}
                  {/* Thông tin chung */}
                  <View style={{ marginVertical: 7 }}>
                    <Collapse
                      isCollapsed={
                        generalInfo.button === "minus-circle-outline"
                      }
                      onToggle={isCollapsed =>
                        this.handleChangeButton(isCollapsed, 1)
                      }
                    >
                      <CollapseHeader>
                        <View style={styles.headerCollapse}>
                          <View style={styles.flexRowAlignCenter}>
                            <View style={{ width: 20 }}>
                              <IconM
                                name={generalInfo.button}
                                size={17}
                                color={"#999"}
                              />
                            </View>
                            <Text style={styles.headerCollapseText}>
                              {TITLE_MEETING.GENERAL}
                            </Text>
                          </View>
                        </View>
                      </CollapseHeader>

                      <CollapseBody>
                        <View style={{ padding: 15, paddingBottom: 0 }}>
                          <View>
                            <Text style={styles.generalInfo}>
                              {TITLE_MEETING.HOST_SCHEME}
                            </Text>

                            <Text style={{ fontSize: 14 }}>
                              {departmentName}
                            </Text>
                          </View>

                          <View style={{ marginTop: 15 }}>
                            <Text style={styles.generalInfo}>
                              {TITLE_MEETING.HOST_EXPERT}
                            </Text>

                            <Text style={{ fontSize: 14 }}>{userFullName}</Text>
                          </View>

                          <View style={{ marginTop: 15 }}>
                            <Text style={styles.generalInfo}>
                              {`${TITLE_MEETING.ATTACHMENT} (${totalAttachFile})`}
                            </Text>

                            {listFileActtach.length !== 0 ? (
                              listFileActtach
                            ) : (
                              <Text style={{ fontSize: 14 }}>{"Không có"}</Text>
                            )}

                            {isVisibleShowFiles && (
                              <ShowFiles
                                isVisible
                                title={"Nội dung tài liệu"}
                                toggleModal={() =>
                                  this.setState({ isVisibleShowFiles: false })
                                }
                                fileId={selectedAttachFile}
                                name={tenFileGiayMoi}
                              />
                            )}
                          </View>
                        </View>
                      </CollapseBody>
                    </Collapse>
                  </View>

                  {/* Danh sách phát biểu */}
                  <View style={{ marginVertical: 7 }}>
                    <Collapse
                      onToggle={isCollapsed =>
                        this.handleChangeButton(isCollapsed, 2)
                      }
                    >
                      <CollapseHeader>
                        <View style={styles.headerCollapseHasIcon}>
                          <View style={styles.flexRowAlignCenterSpaceBetween}>
                            <View style={styles.flexRowAlignCenter}>
                              <View style={{ width: 20 }}>
                                <IconM
                                  name={listSpeakers.button}
                                  size={17}
                                  color={"#999"}
                                />
                              </View>
                              <Text style={styles.headerCollapseText}>
                                {TITLE_MEETING.LIST_SPEAKS +
                                  ` (${listSpeakers.body.length})`}
                              </Text>
                            </View>
                            <TouchableOpacity
                              style={styles.buttonVote}
                              onPress={() => {
                                if (!isEditSpeak) {
                                  this.renderListSpeakerWithDeleteButton(
                                    isEditSpeak
                                  );
                                } else {
                                  this.renderListSpeakerWithoutDeleteButton(
                                    isEditSpeak
                                  );
                                }
                              }}
                            >
                              {isEditSpeak ? (
                                <IconM
                                  name={"content-save-edit-outline"}
                                  size={22}
                                  color={"#fff"}
                                />
                              ) : (
                                <IconM
                                  name={"pencil-minus-outline"}
                                  size={22}
                                  color={"#fff"}
                                />
                              )}
                            </TouchableOpacity>
                          </View>
                        </View>
                      </CollapseHeader>

                      <CollapseBody>
                        <View style={{ padding: 15, paddingBottom: 0 }}>
                          <Table
                            borderStyle={{
                              borderWidth: 1,
                              borderColor: "#707070"
                            }}
                          >
                            <Row
                              flexArr={[2, 9, 9]}
                              data={listSpeakers.header}
                              style={styles.headerTable}
                              textStyle={styles.headerTableText}
                            />
                            <Rows
                              flexArr={[2, 9, 9]}
                              data={listSpeakers.body}
                              style={styles.contentTable}
                            />
                          </Table>
                        </View>
                      </CollapseBody>
                    </Collapse>
                  </View>

                  {/* Danh sách tham gia ý kiến */}
                  <View style={{ marginVertical: 7 }}>
                    <Collapse
                      onToggle={isCollapsed =>
                        this.handleChangeButton(isCollapsed, 3)
                      }
                    >
                      <CollapseHeader>
                        <View style={styles.headerCollapseHasIcon}>
                          <View style={styles.flexRowAlignCenterSpaceBetween}>
                            <View style={styles.flexRowAlignCenter}>
                              <View style={{ width: 20 }}>
                                <IconM
                                  name={listOpine.button}
                                  size={17}
                                  color={"#999"}
                                />
                              </View>

                              <Text style={styles.headerCollapseText}>
                                {TITLE_MEETING.LIST_OPINES +
                                  ` (${listOpine.body.length})`}
                              </Text>
                            </View>
                            <TouchableOpacity
                              style={styles.buttonVote}
                              onPress={() => {
                                if (!isEditOpinion) {
                                  this.renderListOpinionWithDeleteButton(
                                    isEditOpinion
                                  );
                                } else {
                                  this.renderListOpinionWithoutDeleteButton(
                                    isEditOpinion
                                  );
                                }
                              }}
                            >
                              {isEditOpinion ? (
                                <IconM
                                  name={"content-save-edit-outline"}
                                  size={22}
                                  color={"#fff"}
                                />
                              ) : (
                                <IconM
                                  name={"pencil-minus-outline"}
                                  size={22}
                                  color={"#fff"}
                                />
                              )}
                            </TouchableOpacity>
                          </View>
                        </View>
                      </CollapseHeader>

                      <CollapseBody>
                        <View style={{ padding: 15, paddingBottom: 0 }}>
                          <Table
                            borderStyle={{
                              borderWidth: 1,
                              borderColor: "#707070"
                            }}
                          >
                            <Row
                              flexArr={[2, 5, 3, 3, 5]}
                              data={listOpine.header}
                              style={styles.headerTable}
                              textStyle={styles.headerTableText}
                            />
                            <Rows
                              flexArr={[2, 5, 3, 3, 5]}
                              data={listOpine.body}
                              style={styles.contentTable}
                            />
                          </Table>
                        </View>
                      </CollapseBody>
                    </Collapse>
                  </View>

                  {/* Danh sách vấn đề */}
                  <View style={{ marginVertical: 7 }}>
                    <Collapse
                      isCollapsed={listIssues.button === "minus-circle-outline"}
                      onToggle={isCollapsed =>
                        this.handleChangeButton(isCollapsed, 4)
                      }
                    >
                      <CollapseHeader>
                        <View style={styles.headerCollapse}>
                          <View style={styles.flexRowAlignCenter}>
                            <View style={{ width: 20 }}>
                              <IconM
                                name={listIssues.button}
                                size={17}
                                color={"#999"}
                              />
                            </View>

                            <Text style={styles.headerCollapseText}>
                              {TITLE_MEETING.LIST_ISSUES +
                                ` (${listIssues.body.length})`}
                            </Text>
                          </View>
                        </View>
                      </CollapseHeader>
                      <CollapseBody>
                        <View style={{ padding: 15, paddingBottom: 0 }}>
                          <Table
                            borderStyle={{
                              borderWidth: 1,
                              borderColor: "#707070"
                            }}
                          >
                            <Row
                              flexArr={flexArr}
                              data={headerTable}
                              style={styles.headerTable}
                              textStyle={styles.headerTableText}
                            />
                            <Rows
                              flexArr={flexArr}
                              data={listIssues.body}
                              style={styles.contentTable}
                            />
                          </Table>
                        </View>

                        {isVisibleVote && (
                          <Vote
                            isVisible
                            issue={selectedIssue}
                            width={this.state.width}
                            height={this.state.height}
                            toggleModal={() =>
                              this.setState({ isVisibleVote: false })
                            }
                            checked={this.state.checked}
                            handleCheckVote={this.handleCheckVote}
                            voteIssue={this.voteIssue}
                            voteMultipleIssue={this.voteMultipleIssue}
                            isMeetingDetail
                          />
                        )}

                        {isVisibleVoteResult && (
                          <VoteResult
                            isVisible
                            issue={selectedIssue}
                            width={this.state.width}
                            height={this.state.height}
                            toggleModal={() =>
                              this.setState({ isVisibleVoteResult: false })
                            }
                            isMeetingDetail
                            subjectId={this.state.subjectId}
                            permissionViewResult={permission.viewResult}
                            conferenceId={conferenceId}
                          />
                        )}
                      </CollapseBody>
                    </Collapse>
                  </View>
                </View>
                {/* Buttons */}

                {!isCVVP && !isTK && isShowBottomButtons && (
                  <View
                    style={[
                      styles.flexRowAlignCenter,
                      { justifyContent: "space-evenly", marginTop: 20 }
                    ]}
                  >
                    {permission.speak && (
                      <TouchableOpacity
                        disabled={!isJoined}
                        onPress={() => this.setState({ isVisibleSpeak: true })}
                      >
                        <View
                          style={[
                            styles.flexRowAlignCenter,
                            {
                              paddingVertical: 5,
                              width: this.state.width * 0.45,
                              justifyContent: "center",
                              borderRadius: 4,
                              backgroundColor: isJoined ? "#1aa199" : "#aaaaaa"
                            }
                          ]}
                        >
                          <IconM
                            name={"chat-processing"}
                            size={18}
                            color={"#fff"}
                          />
                          <Text
                            style={{
                              color: "#fff",
                              textTransform: "uppercase"
                            }}
                          >
                            {"Đăng ký phát biểu"}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    {permission.opine && (
                      <TouchableOpacity
                        onPress={() => this.setState({ isVisibleOpine: true })}
                      >
                        <View
                          style={[
                            styles.flexRowAlignCenter,
                            {
                              paddingVertical: 5,
                              width: this.state.width * 0.45,
                              justifyContent: "center",
                              borderRadius: 4,
                              backgroundColor: "#316ec4"
                            }
                          ]}
                        >
                          <IconM name={"wechat"} size={18} color={"#fff"} />
                          <Text
                            style={{
                              color: "#fff",
                              textTransform: "uppercase"
                            }}
                          >
                            {"Tham gia ý kiến"}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                <TouchableOpacity
                  style={{
                    alignSelf: "center",
                    marginTop: 10,
                    marginBottom: 20
                  }}
                  onPress={this.handleGoBack}
                >
                  <View
                    style={[
                      styles.flexRowAlignCenter,
                      {
                        paddingVertical: 3,
                        width: this.state.width * 0.45,
                        justifyContent: "center",
                        borderRadius: 4,
                        backgroundColor: "#fff",
                        borderWidth: 1,
                        borderColor: "#777"
                      }
                    ]}
                  >
                    <IconM name={"chevron-left"} size={18} color={"#777"} />
                    <Text style={{ color: "#777", textTransform: "uppercase" }}>
                      {"Quay lại lịch họp"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>

          <ModalSpeak
            width={this.state.width}
            height={this.state.height}
            isVisible={isVisibleSpeak}
            toggleModal={() => this.setState({ isVisibleSpeak: false })}
            listContent={listDetailContent}
            addOpinionResources={this.props.addOpinionResources}
            syncMeeting={this.showNotify}
            isMeetingDetail
            fileId={this.state.bodyOpinionResource.fileId}
          />
          <ModalOpine
            width={this.state.width}
            height={this.state.height}
            isVisible={isVisibleOpine}
            toggleModal={() => this.setState({ isVisibleOpine: false })}
            listContent={listDetailContent}
            addOpinionResources={this.props.addOpinionResources}
            syncMeeting={this.showNotify}
            isMeetingDetail
            fileId={this.state.bodyOpinionResource.fileId}
            listCategory={this.props.listCategory || []}
          />
          {/* <ModalCommentFile
                        width={width}
                        height={height}
                        isVisible={isVisibleCommentFile}
                        toggleModal={() => this.setState({ isVisibleCommentFile: false })}
                        tableData={this.state.tableData2}
                        headName={'Danh sách ghi chú tài liệu\n'+ tenFileGiayMoi}
                        // isVisibleShowFiles={attachFileId !== 0 && isVisibleShowFiles && isVisibleAttach1}
                        // attachFileId={null}
                        toggleShowFiles={() => this.setState({ attachFileId: 0 })}
                    /> */}
          <Loading loading={firstLoading} />
          {loading && (
            <View
              style={{ width: "100%", height: "100%", position: "absolute" }}
            >
              <View
                style={{
                  position: "absolute",
                  alignSelf: "center",
                  height: "100%",
                  width: "100%",
                  justifyContent: "center"
                }}
              >
                <ActivityIndicator
                  color={"#316ec4"}
                  size={"large"}
                  style={{ marginBottom: 5 }}
                />
              </View>
            </View>
          )}
        </Drawer>

        <Notify
          isVisible={isVisibleNotify}
          content={notify}
          width={this.state.width}
          closeNotify={() => this.setState({ isVisibleNotify: false })}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        error: state.ErrorReducer.error,
        chosenMeeting: state.MeetingReducer.chosenMeeting,
        selectedMeeting: state.MeetingReducer.selectedMeeting,
        chosenContent: state.MeetingReducer.chosenContent,
        listOpine: state.MeetingReducer.listOpine,
        listSpeak: state.MeetingReducer.listSpeak,
        listFileAttachByConference: state.MeetingReducer.listFileAttachByConference,
        resultUpdateConferenceDetail:
        state.MeetingReducer.resultUpdateConferenceDetail,
        listCategory: state.MeetingReducer.listCategory,
        userInfo: state.AuthenReducer.userInfo,
        wsConferenceId: state.WSReducer.wsConferenceId,
        sessionId: state.AuthenReducer.sessionId,
    };
};

export default connect(mapStateToProps, {
    getOpinionResources,
    getListFileAttachByConference,
    getCVoteResults,
    cVoteIssue,
    cVoteListIssue,
    getMeetingById,
    addOpinionResources,
    updateConferenceDetail,
    reloadMeetingScreen,
    updateConferenceWS,
    deleteOpinionResources,
    removeStatement,
})(MeetingScheduleDetail);
