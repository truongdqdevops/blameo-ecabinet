import React, { Component } from "react";
import { connect } from "react-redux";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import Modal from "react-native-modal";
import MHeader from "../../assets/components/header";
import CustomHeader from "../../assets/components/header";

import { Row, Rows, Table } from "react-native-table-component";
import IconM from "react-native-vector-icons/MaterialCommunityIcons";
import IconA from "react-native-vector-icons/AntDesign";
import PheDuyetIcon from "../../assets/icons/PheDuyetIcon.svg";
import TrinhPheDuyetIcon from "../../assets/icons/TrinhPheDuyetIcon.svg";
import Drawer from "react-native-drawer";
import {
  Collapse,
  CollapseBody,
  CollapseHeader
} from "accordion-collapse-react-native";
import moment from "moment";
import Svg from "react-native-svg";
import Checkbox from "@react-native-community/checkbox";
import IconFA5 from "react-native-vector-icons/FontAwesome5";
import Tooltip from "react-native-walkthrough-tooltip";
import {
  addOpinionResources,
  approveAbsentMember,
  chooseMeeting,
  createGopY,
  deleteConferenceParticipant,
  deleteGopY,
  deleteNotebook,
  denyDepartmentConferenceParticipant,
  editGopY,
  getConferenceFile,
  getConferenceParticipant,
  getDepartmentAssignedParticipants,
  getListAssignParticipant,
  getListAssignStatementMeetingMap,
  getListCategory,
  getListConferenceOpinion,
  getListDepartmentParticipants,
  getListElementMeetingMap,
  getListElementStatusMeetingMap,
  getListFinishStatementMeetingMap,
  getListGopY,
  getListGuestById,
  getListMeeting,
  getListMemById,
  getListNotebookByUserId,
  getMeetingById,
  getOpinionResources,
  getParticipantMeeting,
  insertConferenceParticipant,
  insertOrUpdateNotebook,
  reloadMeetingScreen,
  removeStatement,
  updateConferenceParticipant,
  updateConferenceParticipantAndDelegation,
  updateParticipant,
  getAttachConclusionFile,
  getVOfficeFiles
} from "../../redux/actions/meetings.action";
import { updateConferenceWS } from "../../redux/actions/websocket.action";
import {
  CONFERENCE_CONTENTS_STATUS,
  CONFERENCE_STATUS,
  CONFERENCE_STATUS_COLORS,
  CONFERENCE_STATUS_LABELS,
  DEFAULT_VALUE_GET_LIST_MEETING,
  DEPARTMENT_TYPE_NAME,
  ELEMENTS_MAP_MEETING_OBJECT_TYPE,
  LABELS,
  LOAI_GIAY_MOI,
  MEETING_MAP_STATUS,
  PARTICIPANT_APPROVE_ABSENT_STATUS,
  PARTICIPANT_STATUS,
  PARTICIPANT_STATUS_COLORS,
  PARTICIPANT_STATUS_NAME,
  PERMISSIONS,
  SIZE_OF_MEETING_MAP_WEB,
  STATE_CODE,
  STATUS,
  STATUS_ASSIGN,
  USER_TYPE
} from "./const";
import ModalJoin from "./meeting-schedule-modal-bottom/join";
import ModalAbsent from "./meeting-schedule-modal-bottom/absent";
import ModalAuthority from "./meeting-schedule-modal-bottom/authority";
import ModalSpeak from "./meeting-schedule-modal-bottom/speak";
import ModalNote from "./meeting-schedule-modal-bottom/note";
import ModalOpine from "./meeting-schedule-modal-bottom/opine";
import ModalRefuse from "./meeting-schedule-modal-bottom/refuse";
import ModalAssign from "./meeting-schedule-modal-bottom/assign";
import ModalApprove from "./meeting-schedule-modal-bottom/approve";
import Loading from "../../assets/components/loading";
import Notify from "../../assets/components/notify";
import styles from "./style";
import { TITLE_MEETING } from "../../assets/utils/title";
import { checkPermission } from "../../assets/utils/utils";
import Chair from "../../assets/components/chair";
import ShowFiles from "../document/show-files";
import Confirm from "../../assets/components/confirm";
import ReactNativeZoomableView from "@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView";
import HTML from "react-native-render-html";
import { Message } from "../../assets/utils/message";
import ModalAttachFile from "../feedback/feedback-modal/attach-file";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import { hostURL } from "../../services/service";

require("moment/locale/vi");
const srcImg = require("../../assets/images/no-document.png");

let firstLoad = 1;
let handleWillFocusIsCalling = false;
const { width, height } = Dimensions.get("window");
const widthPercent = {
  20: width * 0.2,
  30: width * 0.3,
  40: width * 0.4,
  80: width * 0.8
};

class MeetingSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
      isDrawerOpen: false,
      tableHead: ["STT", TITLE_MEETING.CONTENT, "Cơ quan chủ đề án"],
      tableFeedBackHead: ["STT", "Họ tên, chức vụ", "Nội dung góp ý"],
      isVisible: false,
      isEditFeedBack: false,
      isDeleteFeedBack: false,
      typeGuests: 1,
      listGuestsHeader: ["STT", "Tên đơn vị", "Tên cá nhân"],
      listDepartmentParticipantsHeader: [
        "STT",
        "Tên đơn vị",
        "Trạng thái xác nhận"
      ],
      listDepartmentAssignedParticipantsHeader: ["STT", "Họ tên", "Chức vụ"],
      listJoin: [],
      listOpine: {
        header: ["STT", "Họ tên", "Chức vụ", "Lĩnh vực", "Nội dung góp ý"],
        body: [],
        button: "plus-circle-outline"
      },
      listJoinHidding: true,
      isVisibleJoin: false,
      isVisibleAbsent: false,
      isVisibleAuthority: false,
      isSuccessfulAuthority: false,
      isShowingAuthorityButton: true,
      isVisibleSpeak: false,
      isVisibleNote: false,
      isVisibleApprove: false,
      isVisibleOpine: false,
      isVisibleOpinion: false,
      conferenceParticipantIdAssign: 0,
      itemEditGopY: null,
      itemDeleteGopY: null,
      isSendFeedBack: false,
      sendFeedBackValue: "",
      isVisibleErrAnswer: false,
      selectedAttachFileNghiQuyet: null,
      isVisibleAttach1: false,
      isVisibleShowFiles1: false,
      isVisibleShowFiles: false,
      attachFileId: 0,
      isMemberInvited: false,
      mess: "",
      isVisibleRefuse: false,
      bodyMeetingReq: {
        statusConMobile: DEFAULT_VALUE_GET_LIST_MEETING.STATUS,
        keyword: "",
        pageSize: DEFAULT_VALUE_GET_LIST_MEETING.PAGE_SIZE,
        activePage: DEFAULT_VALUE_GET_LIST_MEETING.ACTIVE_PAGE
      },
      listData: [],
      extraData: {
        loading: false,
        isRefreshing: false
      },
      selectedMeeting: {},
      isMoiDonVi: false,
      meetingMap: [],
      listAssignStatement: {
        collapseButton: "minus-circle-outline",
        header: [
          "STT",
          "Đơn vị",
          "Họ tên\n- Chức vụ",
          "T.gian đ.kí",
          "Trạng thái"
        ],
        headerChairman: [
          "STT",
          "Đơn vị",
          "Họ tên\n- Chức vụ",
          "T.gian đ.kí",
          "Trạng thái",
          ""
        ],
        body: []
      },
      listFinishStatement: {
        collapseButton: "minus-circle-outline",
        header: ["STT", "Đơn vị", "Họ tên - Chức vụ", "Số lần p.biểu"],
        body: []
      },
      permission: {
        join: checkPermission(PERMISSIONS.XAC_NHAN_THAM_GIA),
        absent: checkPermission(PERMISSIONS.BAO_VANG),
        authority: checkPermission(PERMISSIONS.UY_QUYEN),
        opine: checkPermission(PERMISSIONS.CHO_Y_KIEN),
        speak: checkPermission(PERMISSIONS.DANG_KY_PHAT_BIEU),
        participant: checkPermission(PERMISSIONS.PHAN_CONG),
        removeStatement: checkPermission(PERMISSIONS.BAC_BO_PHAT_BIEU),
        absentApprove: checkPermission(PERMISSIONS.DUYET_BAO_VANG),
        createFeedBack: checkPermission(PERMISSIONS.TAO),
        approval: checkPermission(PERMISSIONS.TRINH_PHE_DUYET)
      },
      checkedAllMems: false,
      listMemsSelectedForApprove: [],
      tableDataNote: [],
      notebookId: 0,
      content: "",
      activeNoteScreen: "LIST",
      generalInfo: {
        button: "plus-circle-outline"
      },
      fileCTHop: {}
    };
    this.onLayout = this.onLayout.bind(this);
    this.toggleReloadApprove = this.toggleReloadApprove.bind(this);
  }

  onLayout(e) {
    this.setState({
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height
    });
  }

  componentWillMount = () => {
    this.resetHeaderTableMems();
    this.props.navigation.addListener("willFocus", async () => {
      if (this.props.navigation.isFocused()) {
        this.setState(
          {
            firstLoading: true
          },
          () => {
            if (firstLoad === 1) {
              this.handleWillFocus("willmount");
            }
          }
        );
      }
    });
  };

  renderDataTableNote = async conferenceId => {
    const userId = this.props.userInfo.appUser.id;
    await this.props.getListNotebookByUserId({
      userId: userId,
      conferenceId: conferenceId
    });
    const { listNotebookByUserId = [] } = this.props;
    const tableDataNote = [];
    if (listNotebookByUserId.length === 0) {
      tableDataNote.push([
        <Text
          key={"table2hasnoitem"}
          style={{ textAlign: "center", color: "grey" }}
        >
          Không có ghi chú
        </Text>
      ]);
    } else {
      listNotebookByUserId.forEach((element, index) => {
        const stt = index + 1;
        const { content = "", notebookId = "" } = element;
        const itemData = [
          <Text style={{ textAlign: "center" }}>{stt}</Text>,
          <TouchableOpacity
            onPress={() =>
              this.setState({
                activeNoteScreen: "EDIT",
                content: content,
                notebookId: notebookId
              })
            }
          >
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{ textAlign: "left", paddingLeft: 10, color: "#316ec4" }}
            >
              {content}
            </Text>
          </TouchableOpacity>,
          <TouchableOpacity
            onPress={() => this.openConfirmREmoveNote(notebookId, content)}
            style={[styles.flexRowAlignEnd]}
          >
            <View>
              <IconM name={"trash-can-outline"} size={28} color={"#edca98"} />
            </View>
          </TouchableOpacity>
        ];
        const rowData = (
          <Row
            key={index.toString()}
            flexArr={[1, 7, 1]}
            data={itemData}
            style={styles.contentTableNote}
          />
        );
        tableDataNote.push(rowData);
      });
    }

    this.setState({
      tableDataNote
    });
  };

  openConfirmREmoveNote = async (notebookId, content) => {
    this.setState({ notebookId: notebookId, content: content });
    Alert.alert("Xác nhận", "Đồng chí có muốn xoá ghi chú này?", [
      {
        text: "Huỷ bỏ",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "Xoá", onPress: () => this.handleRemoveNote() }
    ]);

    // this.setState({ notebookId: notebookId, content: content })
    // // InteractionManager.runAfterInteractions(() => {
    // //     this.setState({ isVisibleConfirmRemoveNote: true });
    // // });
    // setTimeout(() => { this.setState({ isVisibleConfirmRemoveNote: true }) }, 100)
  };

  resetHeaderTableMems = () => {
    const { checkedAllMems } = this.state;
    const tooltipStatusHeader = this.renderHeaderGuest();

    this.setState({
      listGovernmentMemsHeaderChairman: [
        "STT",
        "Họ tên\n- Chức vụ",
        tooltipStatusHeader,
        TITLE_MEETING.SUBSTITUTE,
        TITLE_MEETING.REASON,
        TITLE_MEETING.OPINION,
        <View style={[styles.flexRowAlignCenter, { justifyContent: "center" }]}>
          <Checkbox
            value={checkedAllMems}
            tintColor={"grey"}
            boxType={"square"}
            onCheckColor={"#222"}
            tintColors={{ true: "#222", false: "grey" }}
            style={[
              { height: 20, width: 20 },
              Platform.OS === "android" && {
                transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]
              }
            ]}
            onValueChange={() => {
              const { listMems = [] } = this.props;
              const newListMemsSelected = [];
              if (!checkedAllMems) {
                listMems.forEach(element => {
                  const { status, selected } = element;
                  if (
                    PARTICIPANT_STATUS.ABSENT === status &&
                    PARTICIPANT_APPROVE_ABSENT_STATUS.NOT_ACCEPT === selected
                  ) {
                    newListMemsSelected.push(element);
                  }
                });
              }

              if (!checkedAllMems && newListMemsSelected.length === 0) {
                this.setState({
                  isVisibleNotifyGuest: true,
                  notify: "Bạn chưa chọn thành viên cần duyệt"
                });
                return;
              }

              this.setState(
                {
                  checkedAllMems: !checkedAllMems,
                  listMemsSelectedForApprove: newListMemsSelected
                },
                () => {
                  this.resetHeaderTableMems();
                  this.renderListMems();
                }
              );
            }}
            // noFeedback
          />
        </View>
      ],

      listGovernmentMemsHeader: [
        "STT",
        "Họ tên\n- Chức vụ",
        tooltipStatusHeader,
        TITLE_MEETING.SUBSTITUTE,
        TITLE_MEETING.REASON,
        TITLE_MEETING.OPINION
      ]
    });
  };

  getTooltipStatus = () => {
    const {
      listGovernmentMemsHeaderChairman = [],
      listGovernmentMemsHeader = []
    } = this.state;
    const tooltipStatus = this.renderHeaderGuest();
    listGovernmentMemsHeader[2] = tooltipStatus;
    listGovernmentMemsHeaderChairman[2] = tooltipStatus;
    this.setState({
      listGovernmentMemsHeaderChairman,
      listGovernmentMemsHeader
    });
  };

  renderHeaderGuest = () => {
    const { toolTipVisible } = this.state;
    return (
      <Tooltip
        isVisible={toolTipVisible}
        content={
          <View>
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <IconM name={"check"} size={18} color={"#316ec4"} />
              <Text>{": Đã xác nhận tham gia"}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <IconM name={"close"} size={18} color={"#B6292B"} />
              <Text>{": Vắng mặt"}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <IconM name={"close"} size={18} color={"#f1c40f"} />
              <Text>{": Xin vắng mặt"}</Text>
            </View>
          </View>
        }
        placement="bottom"
        onClose={() =>
          this.setState({ toolTipVisible: false }, () =>
            this.resetHeaderTableMems()
          )
        }
      >
        <TouchableOpacity
          style={{ padding: 3 }}
          onPress={() =>
            this.setState({ toolTipVisible: true }, () =>
              this.resetHeaderTableMems()
            )
          }
        >
          <Text style={{ textAlign: "center" }}>
            <Text style={[styles.headerTableText2, { textAlign: "center" }]}>
              {"Tham\n"}
            </Text>
            <Text style={[styles.headerTableText2, { textAlign: "center" }]}>
              {"gia "}
            </Text>
            <IconFA5 name="info-circle" size={13} color="#326EC4" />
          </Text>
        </TouchableOpacity>
      </Tooltip>
    );
  };

  componentDidMount = async () => {
    const { listOpine = {} } = this.state;
    const listOpineBody = this.renderListOpine();
    const { level = "" } = this.props.userInfo.appUser;
    this.setState({ isCVVP: level === "CVVP", isTK: level === "TK_TVCP" });
    this.setState({
      listOpine: { ...listOpine, body: listOpineBody }
    });
    if (this.props.navigation.isFocused() && firstLoad === 1) {
      firstLoad = 0;
      this.setState(
        {
          firstLoading: true
        },
        async () => {
          await this.handleWillFocus("didmount");
          firstLoad = 1;
        }
      );
    }
  };
  getListOpine = async () => {
    const { bodyOpinionResource } = this.state;
    await this.props.getOpinionResources({
      conferenceFileEntity: bodyOpinionResource,
      isPhatBieu: false
    });
  };
  componentDidUpdate = async prevProps => {
    if (this.props.wsConferenceId === null) return;

    const { conferenceId } = this.state.selectedMeeting;
    this.renderDataTableNote(conferenceId);
    if (
      this.props.wsConferenceId !== prevProps.wsConferenceId &&
      this.props.wsConferenceId === conferenceId
    ) {
      await this.props.updateConferenceWS(null);
      this.onRefresh();
    }
  };

  handleReloadAll = async bodyMeetingReq => {
    await Promise.all([
      this.props.getListMeeting(bodyMeetingReq),
      this.props.getListCategory()
    ]);

    if (this.props.totalMeeting === 0) {
      this.setState({
        listData: [],
        selectedMeeting: {},
        firstLoading: false
      });
      return;
    }

    const { id, departmentId } = this.props.userInfo.appUser;
    const { isCVVP } = this.state;
    const { menuPermission } = this.props.userInfo;

    const { listMeeting = [] } = this.props;
    if (listMeeting.length > 0) {
      const firstMeeting = { ...listMeeting[0] };
      const {
        conferenceId,
        userId,
        status,
        strStartDate,
        approverId,
        createdBy
      } = firstMeeting;
      await this.props.getMeetingById({ id: conferenceId });
      await this.props.getListGopY({ conferenceId: conferenceId });
      await this.props.getVOfficeFiles({ conferenceId });
      await this.props.getAttachConclusionFile({
        type: 'FILE_NGHI_QUYET',
        objectId: this.state.selectedMeeting.conferenceId,
        objectType: 'CONFERENCE'
      })

      const selectedMeeting = {
        ...firstMeeting,
        ...this.props.selectedMeeting,
        selected: true
      };
      const listData = this.props.listMeeting;
      listData[0] = selectedMeeting;
      this.renderDataTableNote(conferenceId);
      const { loaiGiayMoi, lstMember, lstMemberAction } = selectedMeeting;
      const bodyReqConferenceId = { conferenceId };
      await Promise.all([
        !isCVVP && this.props.getConferenceParticipant(bodyReqConferenceId),
        this.props.getConferenceFile(bodyReqConferenceId)
      ]);
      const isMember = await lstMemberAction.some(
        member => member.userId === id
      );
      this.setState({
        isMemberInvited: isMember
      });

      if (firstMeeting) {
        if (createdBy === id && (status === 6 || status === 1)) {
          this.setState({
            isShowingApproval: true,
            isSetPermission: false,
            isCheckApproval: false
          });
        } else if (approverId === id && status === 4) {
          if (menuPermission.includes(PERMISSIONS.TRINH_PHE_DUYET)) {
            this.setState({
              isShowingApproval: true,
              isCheckApproval: true,
              isSetPermission: true
            });
          } else {
            this.setState({
              isSetPermission: false
            });
          }
        } else {
          this.setState({
            isShowingApproval: false
          });
        }
        if (
          approverId === id &&
          (status === 4 || status === 2 || status === 6)
        ) {
          this.setState({
            isApprover: true
          });
        } else {
          this.setState({
            isApprover: false
          });
        }
        if (!isCVVP && (status === 4 || status === 6)) {
          this.setState({
            isShowingNote: false
          });
        } else {
          this.setState({
            isShowingNote: true
          });
        }
      }
      this.setState(
        {
          listData,
          indexSelected: 0,
          selectedMeeting,
          isMoiDonVi: loaiGiayMoi === LOAI_GIAY_MOI.DON_VI,
          firstLoading: false,
          isChairman: id === userId,
          isNotHappen:
            moment()
              .utcOffset("+7:00")
              .format("YYYY-MM-DD HH:mm") <
            moment(strStartDate, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD HH:mm")
        },
        async () => {
          if (this.state.isMoiDonVi) {
            await this.props.getListAssignParticipant({
              userId: id,
              departmentId
            });
            const {
              listAssignParticipant: { list = [] }
            } = this.props;
            const newListAssignParticipant = list.map(element =>
              this.checkAssigned(element, lstMember)
                ? { ...element, selected: true }
                : { ...element, selected: false }
            );
            this.setState({
              newListAssignParticipant,
              lstMember: [...lstMember]
            });
          }
        }
      );
    }
  };
  handleWillFocus = async () => {
    if (handleWillFocusIsCalling) {
      return;
    }

    const { params = {} } = this.props.navigation.state;
    const { navigateMeeting = {}, from = "" } = params;

    if (from === "Detail" && !this.props.needReload) {
      this.setState({
        firstLoading: false
      });
      return;
    }

    handleWillFocusIsCalling = true;
    this.setState(
      {
        selectedMeeting: {}
      },
      async () => {
        const { loaiGiayMoi: oldLoaiGiayMoi } = this.state.selectedMeeting;

        if (!checkPermission(PERMISSIONS.XEM)) {
          this.setState({
            firstLoading: false
          });
          return;
        }
        if (
          Object.keys(navigateMeeting).length === 0 &&
          !this.props.chosenMeeting
        ) {
          const { bodyMeetingReq = {} } = this.state;
          await this.handleReloadAll(bodyMeetingReq);
          return;
        }

        let { onPressed } = this.state;
        let reqConferenceId;
        let bodyMeetingReq = {
          statusConMobile: DEFAULT_VALUE_GET_LIST_MEETING.STATUS,
          keyword: "",
          pageSize: DEFAULT_VALUE_GET_LIST_MEETING.PAGE_SIZE,
          activePage: DEFAULT_VALUE_GET_LIST_MEETING.ACTIVE_PAGE
        };

        if (this.props.needReload) {
          const { listData = [], selectedMeeting = {} } = this.state;
          const { conferenceId } = selectedMeeting;
          reqConferenceId = conferenceId;
          const size = listData.length;
          bodyMeetingReq = { ...bodyMeetingReq, size };
        } else if (from !== "") {
          const { conferenceId } = navigateMeeting;
          const { chosenMeeting } = this.props;
          const {
            conferenceId: conferencePropsId
          } = this.props.selectedMeeting;
          reqConferenceId =
            conferenceId || chosenMeeting || conferencePropsId || 0;
        }

        await this.props.getMeetingById({ id: reqConferenceId });
        await this.props.getListGopY({ conferenceId: reqConferenceId });
        await this.props.getVOfficeFiles({ conferenceId: reqConferenceId });
        await this.props.getAttachConclusionFile({
          type: 'FILE_NGHI_QUYET',
          objectId: reqConferenceId,
          objectType: 'CONFERENCE'
        })

        const { status } = this.props.selectedMeeting;

        if (
          status === CONFERENCE_STATUS.DANG_HOP ||
          status === CONFERENCE_STATUS.DA_GUI
        ) {
          await Promise.all([
            this.props.getListMeeting({
              ...bodyMeetingReq,
              statusConMobile: STATUS.CHUA_KET_THUC
            }),
            this.props.getListCategory()
          ]);
          onPressed = 1;
        }
        if (
          status === CONFERENCE_STATUS.DA_HOP ||
          status === CONFERENCE_STATUS.DA_KET_THUC
        ) {
          await Promise.all([
            this.props.getListMeeting({
              ...bodyMeetingReq,
              statusConMobile: STATUS.DA_KET_THUC
            }),
            this.props.getListCategory()
          ]);
          onPressed = 2;
        }
        this.props.reloadMeetingScreen(false);

        const {
          selectedMeeting,
          userInfo,
          listMeeting: listData = []
        } = this.props;
        const { id, departmentId } = userInfo.appUser;

        const conferenceId =
          Object.keys(selectedMeeting).length === 0
            ? this.props.listMeeting[0].conferenceId
            : selectedMeeting.conferenceId;
        const ind = listData.findIndex(
          element =>
            conferenceId === element.conferenceId &&
            (!oldLoaiGiayMoi || oldLoaiGiayMoi === element.loaiGiayMoi)
        );
        const newSelectedMeeting = {
          ...this.props.selectedMeeting,
          ...listData[ind],
          selected: true,
          ...navigateMeeting
        };
        const newListData = listData.map((element, index) =>
          ind === index
            ? { ...element, selected: true }
            : { ...element, selected: false }
        );

        this.renderDataTableNote(conferenceId);

        await this.props.getConferenceFile({ conferenceId });
        const { loaiGiayMoi, userId, strStartDate } = newSelectedMeeting;
        this.setState(
          {
            selectedMeeting: newSelectedMeeting,
            indexSelected: ind,
            listData: newListData,
            isMoiDonVi: loaiGiayMoi === LOAI_GIAY_MOI.DON_VI,
            firstLoading: false,
            isChairman: id === userId,
            isNotHappen:
              moment()
                .utcOffset("+7:00")
                .format("YYYY-MM-DD HH:mm") <
              moment(strStartDate, "DD/MM/YYYY HH:mm").format(
                "YYYY-MM-DD HH:mm"
              ),
            onPressed
          },
          async () => {
            if (this.state.isMoiDonVi) {
              await this.props.getListAssignParticipant({
                userId: id,
                departmentId
              });
              const { lstMember = [] } = this.state.selectedMeeting;
              const {
                listAssignParticipant: { list = [] }
              } = this.props;
              const newListAssignParticipant = list.map(element =>
                this.checkAssigned(element, lstMember)
                  ? { ...element, selected: true }
                  : { ...element, selected: false }
              );
              this.setState({
                newListAssignParticipant,
                lstMember: [...lstMember]
              });
            }
          }
        );
      }
    );
    handleWillFocusIsCalling = false;
  };

  renderItem = ({ item = {}, index }) => {
    const {
      name = "",
      // strEndDate = '',
      strStartDate = "",
      status = -1,
      statusName = "",
      selected = false,
      participantStatus = -1,
      participantStatusName = "",
      isMember = false,
      createdBy = ""
    } = item;
    const { id } = this.props.userInfo.appUser;
    const { isCVVP } = this.state;

    // const notEnd = status < 4;
    // const time = notEnd ? strStartDate.split(' ') : strEndDate.split(' ');
    const time = strStartDate.split(" ");
    const startMoment = moment(strStartDate, "DD/MM/YYYY HH:mm");
    const textTime = `${startMoment
      .startOf("minutes")
      .fromNow()
      .replace("một", "1")} (${time[0]})`;
    const backgroundItem = { backgroundColor: selected ? "#d6e2f3" : "#fff" };
    const isShowConfStatus =
      status === CONFERENCE_STATUS.DA_GUI &&
      ((createdBy === id && isMember) || isMember || (isCVVP && isMember));
    return (
      <TouchableOpacity onPress={this.selectMeeting(item, index)}>
        <View
          style={[styles.boderBottom, styles.containerItem, backgroundItem]}
        >
          <View style={styles.flexRow}>
            <Text style={styles.titleConferenceList}>{`${index +
              1}. ${name}`}</Text>
          </View>
          {status !== CONFERENCE_STATUS.DA_KET_THUC && (
            <View style={[styles.infoItemListConference, { marginTop: 2 }]}>
              {isShowConfStatus ? (
                <Text
                  style={{
                    color:
                      PARTICIPANT_STATUS_COLORS[participantStatus].color ||
                      "#0000"
                  }}
                >
                  {
                    participantStatusName
                    // || PARTICIPANT_STATUS_COLORS[participantStatus].name
                  }
                </Text>
              ) : (
                <Text
                  style={{ color: CONFERENCE_STATUS_COLORS[status] || "#0000" }}
                >
                  {statusName}
                </Text>
              )}
            </View>
          )}
          <View style={styles.infoItemListConference}>
            <View style={styles.flexRowAlignCenter}>
              <View style={styles.width20}>
                <IconM name={"calendar-clock"} size={15} color={"#707070"} />
              </View>
              {/* <Text>{`${(notEnd ? startMoment : endMoment).startOf('minutes').fromNow().replace('một', '1')} (${time[0]})`}</Text> */}
              <Text>{textTime}</Text>
            </View>
            <View style={styles.flexRowAlignCenter}>
              <View style={styles.width20}>
                <IconM name={"clock-outline"} size={15} color={"#707070"} />
              </View>
              <Text>{time[1]}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  selectMeeting = (item = {}, index) => () => {
    const { listAssignStatement = {}, listFinishStatement = {} } = this.state;
    const { appUser, menuPermission } = this.props.userInfo;
    const { id, departmentId } = appUser;

    this.setState(
      {
        firstLoading: true,
        isDrawerOpen: false,
        meetingMap: [],
        labelArr: [],
        isEditFeedBack: false,
        listAssignStatement: { ...listAssignStatement, body: [] },
        listFinishStatement: { ...listFinishStatement, body: [] }
      },
      async () => {
        const { listData = [], indexSelected, isCVVP } = this.state;
        const { conferenceId, loaiGiayMoi, createdBy } = item;
        listData[indexSelected] = {
          ...listData[indexSelected],
          selected: false
        };
        listData[index] = { ...listData[index], selected: true };
        const bodyReqConferenceId = { conferenceId };
        await Promise.all([
          await this.props.getMeetingById({ id: conferenceId }),
          await this.props.getListGopY({ conferenceId: conferenceId }),
          await this.props.getVOfficeFiles({ conferenceId }),
          await this.props.getAttachConclusionFile({
            type: 'FILE_NGHI_QUYET',
            objectId: conferenceId,
            objectType: 'CONFERENCE'
          }),
          !isCVVP && this.props.getConferenceParticipant(bodyReqConferenceId),
          this.props.getConferenceFile(bodyReqConferenceId)
        ]);
        const selectedMeeting = {
          ...item,
          ...this.props.selectedMeeting,
          selected: true
        };
        const {
          userId,
          status,
          strStartDate,
          approverId,
          lstMember,
          lstMemberAction
        } = selectedMeeting;

        this.renderDataTableNote(conferenceId);
        this.setState(
          {
            listData,
            indexSelected: index,
            isMoiDonVi: loaiGiayMoi === LOAI_GIAY_MOI.DON_VI,
            selectedMeeting,
            typeGuests: 1,
            firstLoading: false,
            isChairman: userId === id,
            isNotHappen:
              moment()
                .utcOffset("+7:00")
                .format("YYYY-MM-DD HH:mm") <
              moment(strStartDate, "DD/MM/YYYY HH:mm").format(
                "YYYY-MM-DD HH:mm"
              )
          },
          async () => {
            if (this.state.isMoiDonVi) {
              await this.props.getListAssignParticipant({
                userId: id,
                departmentId
              });
              const {
                listAssignParticipant: { list = [] }
              } = this.props;
              const newListAssignParticipant = list.map(element =>
                this.checkAssigned(element, lstMember)
                  ? { ...element, selected: true }
                  : { ...element, selected: false }
              );
              this.setState({
                newListAssignParticipant,
                lstMember
              });
            }
            const isMember = await lstMemberAction.some(
              member => member.userId === id
            );
            this.setState({
              isMemberInvited: isMember
            });
            if (createdBy === id && (status === 6 || status === 1)) {
              this.setState({
                isShowingApproval: true,
                isCheckApproval: false,
                isSetPermission: false
              });
            } else if (approverId === id && status === 4) {
              if (menuPermission.includes(PERMISSIONS.TRINH_PHE_DUYET)) {
                this.setState({
                  isShowingApproval: true,
                  isCheckApproval: true,
                  isSetPermission: true
                });
              } else {
                this.setState({
                  isSetPermission: false
                });
              }
            } else {
              this.setState({
                isShowingApproval: false
              });
            }
            if (
              approverId === id &&
              (status === 4 || status === 2 || status === 6)
            ) {
              this.setState({
                isApprover: true
              });
            } else {
              this.setState({
                isApprover: false
              });
            }
            if (!isCVVP && (status === 4 || status === 6)) {
              this.setState({
                isShowingNote: false
              });
            } else {
              this.setState({
                isShowingNote: true
              });
            }
          }
        );
      }
    );
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
  handleLoadMore = async () => {
    if (this.state.extraData.loading) return;
    if (this.props.totalMeeting <= DEFAULT_VALUE_GET_LIST_MEETING.PAGE_SIZE)
      return;

    this.handleLoading(true);
    const { bodyMeetingReq = {}, listData } = this.state;
    const { activePage, pageSize } = bodyMeetingReq;

    if (activePage * pageSize >= this.props.totalMeeting) {
      this.handleLoading(false);
      return;
    }

    const newActivePage = bodyMeetingReq.activePage + 1;
    const newBodyReq = { ...bodyMeetingReq, activePage: newActivePage };

    await this.props.getListMeeting(newBodyReq);

    this.setState({
      bodyMeetingReq: newBodyReq,
      listData: listData.concat(this.props.listMeeting)
    });
    this.handleLoading(false);
  };

  handleLoading = loading => {
    this.setState({
      extraData: { ...this.state.extraData, loading }
    });
  };

  renderFooter = () => {
    if (!this.state.extraData.loading) return null;
    return (
      <ActivityIndicator
        style={{ marginVertical: 10 }}
        color={"#316ec4"}
        size={"small"}
      />
    );
  };

  onRefresh = async () => {
    const {
      bodyMeetingReq = {},
      extraData = {},
      selectedMeeting = {},
      listData = []
    } = this.state;
    this.setState({
      extraData: { ...extraData, isRefreshing: true }
    });

    const newBodyReq = {
      ...bodyMeetingReq,
      activePage: DEFAULT_VALUE_GET_LIST_MEETING.ACTIVE_PAGE,
      pageSize: listData.length
    };
    const { conferenceId } = selectedMeeting;
    this.renderDataTableNote(conferenceId);
    await Promise.all([
      this.props.getListMeeting(newBodyReq),
      this.props.getListCategory(),
      this.props.getMeetingById({ id: conferenceId }),
      this.props.getListGopY({ conferenceId: conferenceId }),
      this.props.getVOfficeFiles({ conferenceId }),
      this.props.getAttachConclusionFile({
        type: 'FILE_NGHI_QUYET',
        objectId: conferenceId,
        objectType: 'CONFERENCE'
      }),
    ]);
    const ind = this.props.listMeeting.findIndex(
      element => conferenceId === element.conferenceId
    );
    const newSelectedMeeting = {
      ...selectedMeeting,
      ...this.props.listMeeting[ind]
    };
    const newListData = [...this.props.listMeeting];
    newListData[ind] = newSelectedMeeting;
    this.setState({
      listData: newListData,
      extraData: { ...extraData, isRefreshing: false },
      bodyMeetingReq: newBodyReq,
      selectedMeeting: newSelectedMeeting
    });
  };

  getListMeeting = async statusConMobile => {
    const { bodyMeetingReq } = this.state;
    this.setState({
      loading: true
    });

    const newBodyReq = {
      ...bodyMeetingReq,
      activePage: DEFAULT_VALUE_GET_LIST_MEETING.ACTIVE_PAGE,
      statusConMobile
    };
    await this.handleReloadAll(newBodyReq);
    this.setState({
      bodyMeetingReq: newBodyReq,
      loading: false
    });
  };

  renderDataTable = (inputData = []) => {
    const tableData = [];

    inputData.forEach((element, index) => {
      const stt = index + 1;
      const { title = "", departmentName = "" } = element;
      const itemData = [
        <Text style={styles.textSTT}>{stt}</Text>,
        <TouchableOpacity
          onPress={this.navigateContent(index)}
          style={styles.padding5}
        >
          <Text style={styles.textContent}>{`${title}  `}</Text>
        </TouchableOpacity>,
        <Text style={styles.contentTableText}>{departmentName}</Text>
      ];
      tableData.push(itemData);
    });

    return tableData;
  };
  renderDataTableGopY = (inputData = [], isKL) => {
    const tableData = [];
    const userId = this?.props?.userInfo?.appUser?.id;

    inputData.forEach((element, index) => {
      const stt = index + 1;
      const { fullName = "", feedback = "", position = "" } = element;
      // const { generateStatusCode = 0, generateStatusName = '' } = element;
      const checkEdit =
        this.state.isEditFeedBack &&
        (element.createdById === userId ||
          this?.state?.permission?.createFeedBack) ? (
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            {userId === element?.createdById ? (
              <TouchableOpacity
                onPress={() => {
                  this.setState(
                    {
                      itemEditGopY: element
                    },
                    () => {
                      this.setState({
                        isSendFeedBack: true,
                        sendFeedBackValue: element.feedback
                      });
                    }
                  );
                }}
              >
                <IconA name={"edit"} size={18} color={"#3060DB"} />
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => {
                this.setState({
                  isDeleteFeedBack: true,
                  itemDeleteGopY: element
                });
              }}
            >
              <IconA name={"delete"} size={18} color={"#D7002E"} />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.textSTT}>{stt}</Text>
        );
      const itemData = [
        checkEdit,
        <TouchableOpacity
          onPress={this.navigateContent(index)}
          style={styles.padding5}
        >
          <Text style={styles.textContent}>{`${fullName}${
            position ? ` - ${position}` : " "
          }`}</Text>
        </TouchableOpacity>,
        <Text style={styles.contentTableText}>{feedback}</Text>
      ];

      tableData.push(itemData);
    });

    return tableData;
  };

  renderListGovernmentMems = () => {
    const { listJoinHidding } = this.state;
    this.setState(
      {
        listJoin: [],
        isVisible: true,
        listJoinLoading: true
      },
      async () => {
        setTimeout(
          async () => {
            const { conferenceId } = this.state.selectedMeeting;
            await this.props.getListMemById({ conferenceId });

            // const { listMems = [] } = this.props;
            // const newListMems = listMems.map(element => element.selected === 1 ? { ...element, selected: 2 } : { ...element });
            this.setState(
              {
                listMemsSelectedForApprove: []
              },
              () => {
                this.renderListMems();
              }
            );
          },
          listJoinHidding ? 500 : 0
        );
      }
    );
  };

  renderListMems = () => {
    const { permission = {}, checkedAllMems, selectedMeeting } = this.state;
    const { status: conferenceStatus } = selectedMeeting;
    const { listMems = [] } = this.props;
    const styleStatus = [
      styles.flexRowAlignCenter,
      { justifyContent: "center" }
    ];
    const listGovernmentMems = [];

    listMems.forEach((element, index) => {
      const stt = index + 1;
      const {
        position = "",
        fullName = "",
        status = 0,
        assignName = "",
        description,
        countOpinion = 0,
        selected = 0
      } = element;
      let iconName;
      let iconColor;
      if (PARTICIPANT_STATUS.JOIN === status) {
        iconName = "check";
        iconColor = "#316ec4";
      }
      if (PARTICIPANT_STATUS.ABSENT === status) {
        iconName = "close";
        if (PARTICIPANT_APPROVE_ABSENT_STATUS.ACCEPT === selected) {
          iconColor = "#B6292B";
        } else if (PARTICIPANT_APPROVE_ABSENT_STATUS.NOT_ACCEPT === selected) {
          iconColor = "#f1c40f";
        }
      }
      const itemData = [
        <Text style={styles.textSTT}>{stt}</Text>,
        <Text style={styles.contentTableText2}>
          {fullName}
          {", "}
          {position}
        </Text>,
        <View style={styleStatus}>
          {status !== PARTICIPANT_STATUS.NOT_CONFIRM && (
            <IconM name={iconName} size={18} color={iconColor} />
          )}
        </View>,
        <Text style={styles.contentTableText2}>{assignName}</Text>,
        <Text style={styles.contentTableText2}>{description || ""}</Text>,
        <View style={[styles.flexRowAlignCenter, { justifyContent: "center" }]}>
          {/* <TouchableOpacity onPress={this.toggleModalOpinion(true)} > */}
          <Text style={{ fontSize: 18, padding: 4, color: "#316ec4" }}>
            {countOpinion}
          </Text>
          {/* </TouchableOpacity> */}
        </View>
      ];
      if (
        (CONFERENCE_STATUS.DANG_HOP === conferenceStatus ||
          CONFERENCE_STATUS.DA_GUI === conferenceStatus) &&
        (this.state.isChairman || permission.absentApprove)
      ) {
        const checked = this.checkSelectedApproveAbsent(element);
        const checkDisplayCheckbox =
          PARTICIPANT_STATUS.ABSENT === status &&
          PARTICIPANT_APPROVE_ABSENT_STATUS.NOT_ACCEPT === selected &&
          (description || description === "");
        itemData.push(
          <View
            style={[styles.flexRowAlignCenter, { justifyContent: "center" }]}
          >
            {checkDisplayCheckbox && (
              <Checkbox
                value={checked}
                tintColor={"grey"}
                boxType={"square"}
                onCheckColor={"#222"}
                tintColors={{ true: "#222", false: "grey" }}
                style={[
                  { height: 20, width: 20 },
                  Platform.OS === "android" && {
                    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]
                  }
                ]}
                onValueChange={() => {
                  const { listMemsSelectedForApprove = [] } = this.state;
                  let newListMemsSelected = [];
                  if (checked) {
                    newListMemsSelected = listMemsSelectedForApprove.filter(
                      mem => mem.userId !== element.userId
                    );
                  } else {
                    newListMemsSelected = [
                      ...listMemsSelectedForApprove,
                      element
                    ];
                  }
                  const handleCheckedWhenCheckedAll = checkedAllMems && checked;
                  this.setState(
                    {
                      listMemsSelectedForApprove: newListMemsSelected,
                      checkedAllMems: handleCheckedWhenCheckedAll
                        ? false
                        : checkedAllMems
                    },
                    () => {
                      this.renderListMems();
                      if (handleCheckedWhenCheckedAll) {
                        this.resetHeaderTableMems();
                      }
                    }
                  );
                }}
              />
            )}
          </View>
        );
      }
      const rowData = (
        <Row
          key={index.toString()}
          flexArr={[2, 5, 3, 5, 5, 5, 2]}
          data={itemData}
          style={styles.contentTable2}
        />
      );
      listGovernmentMems.push(rowData);
    });

    this.setState({
      listJoin: listGovernmentMems,
      listJoinHidding: false,
      listJoinLoading: false
    });
  };

  checkSelectedApproveAbsent = inputElement => {
    const { listMemsSelectedForApprove = [] } = this.state;
    return (
      listMemsSelectedForApprove.findIndex(
        element => inputElement.userId === element.userId
      ) > -1
    );
  };

  handleApproveAbsent = async type => {
    const {
      selectedMeeting = {},
      listMemsSelectedForApprove = []
    } = this.state;
    const { conferenceId } = selectedMeeting;
    const isApprove =
      type === "accept"
        ? PARTICIPANT_APPROVE_ABSENT_STATUS.ACCEPT
        : PARTICIPANT_APPROVE_ABSENT_STATUS.NOT_ACCEPT;

    if (listMemsSelectedForApprove.length === 0) {
      this.setState({
        isVisibleNotifyGuest: true,
        notify: "Bạn chưa chọn thành viên cần duyệt"
      });
      return;
    }

    const res = await this.props.approveAbsentMember({
      isApprove,
      conference: { conferenceId, lstMember: listMemsSelectedForApprove }
    });

    if (res) {
      this.setState(
        {
          isVisibleNotifyGuest: true,
          notify:
            type === "accept"
              ? "Duyệt báo vắng thành công!"
              : "Từ chối báo vắng thành công!"
        },
        () => {
          setTimeout(() => {
            this.renderListGovernmentMems();
          }, 500);
        }
      );
    } else {
      this.setState({
        isVisibleNotifyGuest: true,
        notify: "Thao tác thất bại, đồng chí vui lòng thử lại sau!"
      });
    }
  };

  renderListGuests = () => {
    this.setState(
      {
        listJoin: [],
        listJoinLoading: true
      },
      async () => {
        const { conferenceId } = this.state.selectedMeeting;
        await this.props.getListGuestById({ conferenceId });

        const { listGuests: listGuestsProps = [] } = this.props;
        const listGuests = [];
        listGuestsProps.forEach((element, index) => {
          const stt = index + 1;
          const {
            position = "",
            fullName = "",
            departmentName = "",
            intChecked = 0
          } = element;
          if (intChecked) {
            const itemData = [
              <Text style={styles.textSTT}>{stt}</Text>,
              <Text style={styles.contentTableText2}>{departmentName}</Text>,
              <Text style={styles.contentTableText2}>
                {position ? `${position} - ${fullName}` : fullName}
              </Text>
            ];
            const rowData = (
              <Row
                key={index.toString()}
                flexArr={[2, 9, 10]}
                data={itemData}
                style={styles.contentTable2}
              />
            );
            listGuests.push(rowData);
          }
        });

        this.setState({
          listJoin: listGuests,
          listJoinLoading: false
        });
      }
    );
  };

  renderListDepartmentParticipants = () => {
    this.setState(
      {
        listJoin: [],
        listJoinLoading: true
      },
      async () => {
        const { conferenceId } = this.state.selectedMeeting;
        await this.props.getListDepartmentParticipants({ conferenceId });

        const {
          listDepartmentParticipants: listDepartmentParticipantsProps = []
        } = this.props;
        const listDepartmentParticipants = [];
        listDepartmentParticipantsProps.forEach((element, index) => {
          const stt = index + 1;
          const {
            participantAssignedStatusName = "",
            departmentName = ""
          } = element;
          const itemData = [
            <Text style={styles.textSTT}>{stt}</Text>,
            <TouchableOpacity
              onPress={this.showListAssignedDepartmentParticipants(element)}
              style={styles.padding5}
            >
              <Text style={[styles.contentTableText2, { fontWeight: "bold" }]}>
                {departmentName}
              </Text>
            </TouchableOpacity>,
            <Text style={styles.contentTableText}>
              {participantAssignedStatusName}
            </Text>
          ];
          const rowData = (
            <Row
              key={index.toString()}
              flexArr={[2, 9, 10]}
              data={itemData}
              style={styles.contentTable2}
            />
          );
          listDepartmentParticipants.push(rowData);
        });

        this.setState({
          listJoin: listDepartmentParticipants,
          listJoinLoading: false
        });
      }
    );
  };

  showListAssignedDepartmentParticipants = departmentParticipant => async () => {
    this.setState(
      {
        loadingListDepartmentAssigned: true,
        isVisibleDepartmentAssignedParticipant: true
      },
      async () => {
        await this.props.getDepartmentAssignedParticipants(
          departmentParticipant
        );

        const listDepartmentAssignedParticipantsState = [];
        const { listDepartmentAssignedParticipants = [] } = this.props;

        listDepartmentAssignedParticipants.forEach((element, index) => {
          const stt = index + 1;
          const { fullName = "", position = "" } = element;
          const itemData = [
            <Text style={styles.textSTT}>{stt}</Text>,
            <Text style={styles.contentTableText}>{fullName}</Text>,
            <Text style={styles.contentTableText}>{position}</Text>
          ];
          const rowData = (
            <Row
              key={index.toString()}
              flexArr={[2, 9, 9]}
              data={itemData}
              style={styles.contentTable2}
            />
          );
          listDepartmentAssignedParticipantsState.push(rowData);
        });

        this.setState({
          selectedDepartmentParticipant:
            departmentParticipant.departmentName || "",
          listDepartmentAssignedParticipantsState,
          loadingListDepartmentAssigned: false
        });
      }
    );
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
      this.setState({
        isDrawerOpen: true
      });
    } else {
      this.setState({
        isDrawerOpen: false
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

  navigateContent = chosenContent => async () => {
    await this.props.chooseMeeting(0, chosenContent);
    const {
      participantAssignedStatusName = "",
      participantStatusName = ""
    } = this.state.selectedMeeting;
    this.props.navigation.navigate("MeetingScheduleDetailScreen", {
      participantAssignedStatusName,
      participantStatusName
    });
  };

  toggleModal = status => () => {
    if (status) {
      this.renderListGovernmentMems();
    } else {
      this.setState(
        {
          isVisible: !this.state.isVisible,
          listJoinHidding: true,
          typeGuests: 1,
          checkedAllMems: false
        },
        () => {
          this.resetHeaderTableMems();
        }
      );
    }
  };

  toggleChangeTypeGuests = typeGuests => () => {
    this.setState(
      {
        typeGuests
      },
      () => {
        if (typeGuests === 1) return this.renderListGovernmentMems();
        if (typeGuests === 2) return this.renderListDepartmentParticipants();
        return this.renderListGuests();
      }
    );
  };

  syncMeeting = async (notify, needReload) => {
    if (notify) {
      setTimeout(() => {
        this.setState({
          notify,
          isVisibleNotify: true
        });
      }, 700);
    }

    if (needReload) {
      const { listData = [], selectedMeeting = {} } = this.state;
      const { conferenceId, loaiGiayMoi } = selectedMeeting;
      this.renderDataTableNote(conferenceId);
      const size = listData.length;
      const position = listData.findIndex(
        element =>
          element.conferenceId === conferenceId &&
          element.loaiGiayMoi === loaiGiayMoi
      );

      await this.props.getListMeeting({
        ...this.state.bodyMeetingReq,
        pageSize: size,
        activePage: 0
      });

      const { listMeeting = [] } = this.props;
      listMeeting[position] = { ...listMeeting[position], selected: true };

      this.setState({
        listData: listMeeting,
        selectedMeeting: {
          ...selectedMeeting,
          ...listMeeting[position],
          selected: true
        },
        indexSelected: position,
        lstMember: listMeeting[position].lstMember || []
      });
    }
  };
  toggleAuthorityButton = async status => {
    this.setState({ isShowingAuthorityButton: status });
  };
  checkAssigned = (item = {}, list = []) => {
    const result = list.findIndex(element => item.userId === element.userId);
    return result > -1;
  };

  checkValueAll = () => {
    const { newListAssignParticipant = [] } = this.state;
    const newList = [...newListAssignParticipant].filter(
      element => element.selected === true
    );
    return (
      newList.length === newListAssignParticipant.length && newList.length !== 0
    );
  };

  setAllListAssignParticipant = (list = [], value) => {
    this.setState({
      newListAssignParticipant: list.map(
        element => element && { ...element, selected: value }
      )
    });
  };

  chooseAssign = index => {
    const { newListAssignParticipant } = this.state;
    const newElement = newListAssignParticipant[index];
    const { selected } = newElement;
    newListAssignParticipant[index] = { ...newElement, selected: !selected };
    this.setState({ newListAssignParticipant });
  };

  submitChoose = () => {
    const { newListAssignParticipant } = this.state;
    this.setState(
      {
        lstMember: newListAssignParticipant.filter(
          element => element.selected === true
        )
      },
      () => {
        const { lstMember: lstMemState = [] } = this.state;
        const { lstMember = [] } = this.state.selectedMeeting;

        const listAddAssign = [];
        for (let index = 0; index < lstMemState.length; index += 1) {
          const element = lstMemState[index];
          if (!this.checkAssigned(element, lstMember)) {
            listAddAssign.push(element);
          }
        }

        const listDeleteAssign = [];
        for (let index = 0; index < lstMember.length; index += 1) {
          const element = lstMember[index];
          if (
            element.fullName !== DEPARTMENT_TYPE_NAME &&
            !this.checkAssigned(element, lstMemState)
          ) {
            listDeleteAssign.push(element);
          }
        }

        this.setState({
          listAddAssign,
          listDeleteAssign
        });
      }
    );
  };

  cancelChoose = () => {
    const { lstMember = [] } = this.state;
    const {
      listAssignParticipant: { list = [] }
    } = this.props;
    const newListAssignParticipant = list.map(element =>
      this.checkAssigned(element, lstMember)
        ? { ...element, selected: true }
        : { ...element, selected: false }
    );
    this.setState({
      newListAssignParticipant
    });
  };

  deleteAssign = ind => {
    const { lstMember = [], newListAssignParticipant = [] } = this.state;
    const newElement = lstMember[ind];
    const newList = [];
    lstMember.forEach((element, index) => {
      if (index !== ind) newList.push(element);
    });
    const newListAssign = newListAssignParticipant.map(element =>
      element.userId === newElement.userId
        ? { ...element, selected: false }
        : element
    );
    this.setState(
      {
        lstMember: newList,
        newListAssignParticipant: newListAssign
      },
      () => {
        this.submitChoose();
      }
    );
  };

  cancelAssign = () => {
    const { lstMember = [] } = this.state.selectedMeeting;
    const {
      listAssignParticipant: { list = [] }
    } = this.props;
    const newListAssignParticipant = list.map(element =>
      this.checkAssigned(element, lstMember)
        ? { ...element, selected: true }
        : { ...element, selected: false }
    );
    this.setState({
      newListAssignParticipant,
      lstMember
    });
  };

  submitAssign = async () => {
    const {
      listAddAssign = [],
      listDeleteAssign = [],
      selectedMeeting = {}
    } = this.state;
    const { conferenceId, lstMember = [] } = selectedMeeting;
    const departmentItem = lstMember.find(
      element => element.fullName === DEPARTMENT_TYPE_NAME
    );
    const { conferenceParticipantId } = departmentItem;
    this.setState({ conferenceParticipantIdAssign: departmentItem });
    if (listAddAssign.length > 0) {
      listAddAssign.forEach(async element => {
        const { userId } = element;
        const newItem = {
          parentId: conferenceParticipantId,
          userId,
          type: "MEMBER",
          conferenceId,
          checked: true,
          status: STATUS_ASSIGN.INSERT
        };
        await this.props.insertConferenceParticipant(newItem);
      });
    }

    if (listDeleteAssign.length > 0) {
      await this.props.deleteConferenceParticipant(listDeleteAssign);
    }

    const extantMems =
      lstMember.length + listAddAssign.length - listDeleteAssign.length;
    if (extantMems > 1) {
      await this.props.updateConferenceParticipant({
        ...departmentItem,
        status: 4
      });
    }
    if (extantMems === 1) {
      await this.props.updateConferenceParticipant({
        ...departmentItem,
        status: 3
      });
    }

    const notify = this.props.updateAssignResult
      ? "Phân công tham dự thành công"
      : "Phân công tham dự thất bại";
    await this.syncMeeting(notify, true);
  };

  refuseJoin = async () => {
    const { lstMember = [], conferenceId } = this.state.selectedMeeting;
    const departmentItem = lstMember.find(
      element => element.fullName === DEPARTMENT_TYPE_NAME
    );
    const { conferenceParticipantId } = departmentItem;
    this.setState({ conferenceParticipantIdAssign: departmentItem });
    const conferenceParticipant = {
      status: STATUS_ASSIGN.DENY,
      checked: true,
      conferenceId,
      conferenceParticipantId
    };
    await this.props.denyDepartmentConferenceParticipant({
      conferenceParticipant
    });

    const notify = this.props.resultDeny
      ? "Từ chối tham dự thành công"
      : "Từ chối tham dự thất bại";
    await this.syncMeeting(notify, true);
  };

  onPressNotEndConference = () => {
    const { onPressed, listAssignStatement, listFinishStatement } = this.state;
    this.setState(
      {
        onPressed: 1,
        typeGuests: 1,
        meetingMap: [],
        labelArr: [],
        listAssignStatement: { ...listAssignStatement, body: [] },
        listFinishStatement: { ...listFinishStatement, body: [] }
      },
      () => onPressed !== 1 && this.getListMeeting(STATUS.CHUA_KET_THUC)
    );
  };

  onPressEndConference = () => {
    const { onPressed, listAssignStatement, listFinishStatement } = this.state;
    this.setState(
      {
        onPressed: 2,
        typeGuests: 1,
        meetingMap: [],
        labelArr: [],
        listAssignStatement: { ...listAssignStatement, body: [] },
        listFinishStatement: { ...listFinishStatement, body: [] }
      },
      () => onPressed !== 2 && this.getListMeeting(STATUS.DA_KET_THUC)
    );
  };

  toggleModalJoin = status => () => this.setState({ isVisibleJoin: status });

  toggleModalAbsent = status => () =>
    this.setState({ isVisibleAbsent: status });
  toggleModalAuthority = status => () =>
    this.setState({ isVisibleAuthority: status });
  toggleModalOpine = status => () => this.setState({ isVisibleOpine: status });

  toggleModalOpinion = status => () => {
    this.setState({ isVisibleOpinion: status });
    const listOpineBody = this.renderListOpine();
    this.setState({
      listOpine: { ...this.state.listOpine, body: listOpineBody }
    });
  };
  toggleModalSpeak = status => () => this.setState({ isVisibleSpeak: status });

  toggleModalNote = status => () => this.setState({ isVisibleNote: status });

  toggleModalApprove = status => () =>
    this.setState({ isVisibleApprove: status });

  toggleShowIconApprove = status => () =>
    this.setState({ isShowingApproval: status });

  toggleReloadApprove = async status => {
    try {
      this.onRefresh();
      this.showMessCheckApprove(status);
    } catch (error) {
      console.error(error);
    }
  };
  showMessCheckApprove = async status => {
    return new Promise(resolve => {
      setTimeout(() => {
        // this.setState({ firstLoading: false });
        if (status === 1 || status === 0) {
          this.setState({
            isVisibleNotify: true,
            notify: status ? Message.MSG0042 : Message.MSG0041
          });
        } else {
          this.setState({ isVisibleNotify: true, notify: Message.MSG0039 });
        }
        resolve();
      }, 1000);
    });
  };

  toggleModalActiveScreenNote = activeScreen => 
    this.setState({ activeNoteScreen: activeScreen });

  toggleReloadListNotebook = conferenceId => {
    this.renderDataTableNote(conferenceId);
  };
  toggleModalAssign = status => () =>
    this.setState({ isVisibleAssign: status });

  toggleModalRefuse = status => () =>
    this.setState({ isVisibleRefuse: status });

  toggleModalDepartmentAssignedParticipant = status => () =>
    this.setState({ isVisibleDepartmentAssignedParticipant: status });

  toggleModalInforChair = (
    status,
    id,
    userIdElement,
    conferenceFileId
  ) => () => {
    if (this.state.isCallingInfor) return;
    if (status) {
      let label = (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={"small"} color={"#316ec4"} />
        </View>
      );
      this.setState(
        {
          isVisibleInfor: status,
          labelInfor: label,
          opinionsInfor: [],
          isCallingInfor: true
        },
        () => {
          setTimeout(async () => {
            const opinions = [];
            let titleOpinion = null;

            if (userIdElement !== 0) {
              await Promise.all([
                this.props.getParticipantMeeting({ id }),
                conferenceFileId !== -1 &&
                  this.props.getListConferenceOpinion({
                    userId: userIdElement,
                    conferenceFileId
                  })
              ]);
              const {
                participantMeeting = {},
                listConferenceOpinion = []
              } = this.props;
              const {
                fullName = "",
                position = "",
                departmentName = ""
              } = participantMeeting;
              label = (
                <View style={styles.paddingHorizontal10}>
                  <Text>
                    {"Họ tên: "}
                    {fullName}
                  </Text>
                  <Text>
                    {"Chức vụ: "}
                    {position}
                  </Text>
                  <Text>
                    {"Đơn vị: "}
                    {departmentName}
                  </Text>
                </View>
              );

              if (listConferenceOpinion.length !== 0) {
                const { lstContent = [] } = this.state.selectedMeeting;
                const ind = lstContent.findIndex(
                  element =>
                    CONFERENCE_CONTENTS_STATUS.DANG_HOP === element.status
                );

                if (ind !== -1) {
                  const { fileId, title } = lstContent[ind];
                  const contentHappenning = fileId;
                  titleOpinion = (
                    <Text style={styles.titleInfor} key={"titleInfor2"}>
                      {`Các ý kiến về nội dung: ${title}`}
                    </Text>
                  );

                  for (
                    let index = 0;
                    index < listConferenceOpinion.length;
                    index += 1
                  ) {
                    const element = listConferenceOpinion[index];
                    const {
                      conferenceFileId: fileIdElement = -1,
                      content = "",
                      conferenceOpinionId = 0,
                      opinionTime = ""
                    } = element;
                    if (fileIdElement === contentHappenning) {
                      const item = (
                        <View
                          style={styles.marginVertical7}
                          key={`${conferenceOpinionId}${index}`}
                        >
                          <Collapse>
                            <CollapseHeader>
                              <Text
                                style={[
                                  styles.headerCollapseText,
                                  {
                                    paddingVertical: 5,
                                    backgroundColor: "#ccc"
                                  }
                                ]}
                              >
                                {`Ý kiến ${index + 1}: ${opinionTime}`}
                              </Text>
                            </CollapseHeader>

                            <CollapseBody>
                              <Text style={styles.contentInfor}>{content}</Text>
                            </CollapseBody>
                          </Collapse>
                        </View>
                      );
                      opinions.push(item);
                    }
                  }
                }
              }
            } else {
              label = (
                <View style={styles.paddingHorizontal10}>
                  <Text style={{ textAlign: "center" }}>{"Ghế trống"}</Text>
                </View>
              );
            }

            this.setState({
              isVisibleInfor: status,
              labelInfor: label,
              opinionsInfor: opinions,
              titleOpinion,
              isCallingInfor: false
            });
          }, 500);
        }
      );
    } else {
      this.setState({ isVisibleInfor: status });
    }
  };
  configElementsColor = (
    listElementMeetingMap = [],
    listElementStatusMeetingMap = []
  ) => {
    if (listElementMeetingMap.length === 0) {
      return listElementMeetingMap;
    }

    const {
      selectedMeeting: { status: conferenceStatus }
    } = this.state;
    const newListElementMeetingMap = [];
    const listElementStatus = {};

    listElementStatusMeetingMap.forEach(element => {
      const { elementStatusId, fill, textFill = "#fff" } = element;
      listElementStatus[elementStatusId] = { fill, textFill };
    });

    if (conferenceStatus === CONFERENCE_STATUS.DANG_HOP) {
      listElementMeetingMap.forEach(element => {
        const { userId, statusOpinion, state, state2, objectType } = element;
        let itemData = element;
        if (ELEMENTS_MAP_MEETING_OBJECT_TYPE.CHAIR === objectType) {
          if (!userId) {
            itemData = {
              ...element,
              ...listElementStatus[MEETING_MAP_STATUS.EMPTY]
            };
          } else if (statusOpinion === 1) {
            if (state === 0) {
              itemData = {
                ...element,
                ...listElementStatus[MEETING_MAP_STATUS.REGISTER_STATE]
              };
            }
            if (state === 1) {
              itemData = {
                ...element,
                ...listElementStatus[MEETING_MAP_STATUS.IS_STATE]
              };
            }
            if (state === 2) {
              if (state2 === 1) {
                itemData = {
                  ...element,
                  ...listElementStatus[MEETING_MAP_STATUS.IS_STATE]
                };
              }
              itemData = {
                ...element,
                ...listElementStatus[MEETING_MAP_STATUS.WAS_STATE]
              };
            }
          } else {
            itemData = {
              ...element,
              ...listElementStatus[MEETING_MAP_STATUS.JOINED]
            };
          }
        }
        newListElementMeetingMap.push(itemData);
      });
    }

    if (
      conferenceStatus === CONFERENCE_STATUS.CHUA_GUI ||
      conferenceStatus === CONFERENCE_STATUS.DA_GUI
    ) {
      listElementMeetingMap.forEach(element => {
        const { userId, status, userType = "", objectType } = element;
        let itemData = element;
        if (ELEMENTS_MAP_MEETING_OBJECT_TYPE.CHAIR === objectType) {
          if (!userId) {
            itemData = {
              ...element,
              ...listElementStatus[MEETING_MAP_STATUS.EMPTY]
            };
          } else {
            if (status === "0" && USER_TYPE.MEMBER === userType) {
              itemData = {
                ...element,
                ...listElementStatus[MEETING_MAP_STATUS.INVITED]
              };
            }
            if (status === "1") {
              itemData = {
                ...element,
                ...listElementStatus[MEETING_MAP_STATUS.JOINED]
              };
            }
            if (status === "2") {
              itemData = {
                ...element,
                ...listElementStatus[MEETING_MAP_STATUS.ABSENT]
              };
            }
          }
        }
        newListElementMeetingMap.push(itemData);
      });
    }

    if (
      conferenceStatus === CONFERENCE_STATUS.DA_HOP ||
      conferenceStatus === CONFERENCE_STATUS.DA_KET_THUC
    ) {
      listElementMeetingMap.forEach(element => {
        const { status, userId } = element;
        let itemData = element;
        if (!userId) {
          itemData = {
            ...element,
            ...listElementStatus[MEETING_MAP_STATUS.EMPTY]
          };
        } else if (status === "1") {
          itemData = {
            ...element,
            ...listElementStatus[MEETING_MAP_STATUS.JOINED]
          };
        }
        newListElementMeetingMap.push(itemData);
      });
    }
    return newListElementMeetingMap;
  };

  renderMapMeetingRoom = async reload5s => {
    if (this.state.meetingMapLoading || this.state.reload5s) return;

    if (!reload5s) {
      this.setState({
        meetingMapLoading: true
      });
    } else {
      this.setState({
        reload5s: true
      });
    }

    const { isChairman, permission = {} } = this.state;
    const {
      conferenceId,
      groupId,
      locationId,
      status,
      lstContent
    } = this.state.selectedMeeting;
    const { conferenceFile = {} } = this.props;
    const { conferenceFileId = -1 } = conferenceFile;
    const haveConferenceFile = Object.keys(conferenceFile).length !== 0;

    await Promise.all([
      this.props.getListElementMeetingMap({
        conferenceId,
        status,
        groupId,
        locationId,
        lstContent
      }),
      this.props.getListElementStatusMeetingMap({
        conferenceId,
        status,
        groupId,
        locationId,
        lstContent
      }),
      haveConferenceFile &&
        this.props.getListAssignStatementMeetingMap({
          conferenceId,
          conferenceFileId
        }),
      haveConferenceFile &&
        this.props.getListFinishStatementMeetingMap({
          conferenceId,
          conferenceFileId
        })
    ]);

    const {
      listElementMeetingMap = [],
      listElementStatusMeetingMap = [],
      listAssignStatementMeetingMap = [],
      listFinishStatementMeetingMap = []
    } = this.props;

    const {
      width: widthDevice,
      listAssignStatement = {},
      listFinishStatement = {},
      height: heightDevice
    } = this.state;
    const ratio = widthDevice / SIZE_OF_MEETING_MAP_WEB;

    let meetingMap = [];
    const labelArr = [];
    const listAssignBody = [];
    const listFinishBody = [];

    if (listElementMeetingMap.length === 0) {
      meetingMap = (
        <View
          style={{
            flex: 1,
            paddingTop: widthDevice * 0.4,
            alignItems: "center"
          }}
          key={"NoMapData"}
        >
          <Text>{"Cuộc họp này hiện chưa có sơ đồ!"}</Text>
        </View>
      );
    } else {
      const newListElementMeetingMap = this.configElementsColor(
        listElementMeetingMap,
        listElementStatusMeetingMap
      );
      newListElementMeetingMap.forEach(element => {
        const {
          top,
          left,
          width,
          height,
          angle,
          scaleX,
          scaleY,
          fill,
          objectType,
          type,
          path = "",
          id,
          userId: userIdElement
        } = element;
        const newWidth = parseInt(ratio * width * scaleX, 10);
        const newHeight = parseInt(ratio * height * scaleY, 10);
        const newX = parseInt(ratio * left, 10);
        const newY = parseInt(ratio * top, 10);

        meetingMap.push(
          <Chair
            width={newWidth}
            height={newHeight}
            size={widthDevice}
            fill={fill}
            angle={angle}
            x={newX}
            y={newY}
            scaleX={scaleX * ratio}
            scaleY={scaleY * ratio}
            key={`${objectType}${id}`}
            type={type}
            path={path}
            objectType={objectType}
            toggleModalInforChair={this.toggleModalInforChair(
              true,
              id,
              userIdElement,
              conferenceFileId
            )}
          />
        );
      });
    }

    if (listElementStatusMeetingMap.length !== 0) {
      listElementStatusMeetingMap.forEach(element => {
        const { objectType, elementStatusId, statusName, fill } = element;
        labelArr.push(
          <View
            key={objectType + elementStatusId}
            style={styles.itemDetailVote}
          >
            <View style={[styles.colorItem, { backgroundColor: fill }]} />
            <Text style={{ color: "#999" }}>{`${statusName}`}</Text>
          </View>
        );
      });
    }

    if (haveConferenceFile && listAssignStatementMeetingMap.length !== 0) {
      listAssignStatementMeetingMap.forEach((element, index) => {
        const stt = index + 1;
        const {
          fullName,
          departmentName,
          positionName,
          createdDate,
          state,
          stateCode
        } = element;
        const itemData = [
          <Text style={styles.stt}>{stt}</Text>,
          <Text style={styles.contentTableText}>{departmentName}</Text>,
          <Text
            style={styles.contentTableText}
          >{`${fullName}, ${positionName}`}</Text>,
          <Text style={styles.contentTableText}>{createdDate}</Text>,
          <Text style={styles.contentTableText}>{state}</Text>
        ];
        if (isChairman || permission.removeStatement) {
          itemData.push(
            <View
              style={{
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              {STATE_CODE.CHO_PHAT_BIEU === stateCode && (
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      isVisibleConfirmRemoveStatement: true,
                      bodyReqRemoveStatement: element
                    })
                  }
                >
                  <IconM name={"delete"} size={20} color={"#ef5c22"} />
                </TouchableOpacity>
              )}
            </View>
          );
        }
        listAssignBody.push(itemData);
      });
    }

    if (haveConferenceFile && listFinishStatementMeetingMap.length !== 0) {
      listFinishStatementMeetingMap.forEach((element, index) => {
        const stt = index + 1;
        const { fullName, departmentName, positionName, countState } = element;
        const itemData = [
          <Text style={styles.stt}>{stt}</Text>,
          <Text style={styles.contentTableText}>{departmentName}</Text>,
          <Text
            style={styles.contentTableText}
          >{`${fullName}, ${positionName}`}</Text>,
          <Text style={styles.contentTableText}>{countState}</Text>
        ];
        listFinishBody.push(itemData);
      });
    }

    this.setState({
      meetingMap,
      labelArr,
      listAssignStatement: { ...listAssignStatement, body: listAssignBody },
      listFinishStatement: { ...listFinishStatement, body: listFinishBody },
      isVisibleMap: true,
      meetingMapLoading: false,
      reload5s: false
    });
  };

  toggleModalMap = status => () => {
    if (status) {
      this.setState(
        {
          isVisibleMap: status
        },
        () => {
          setTimeout(async () => {
            await this.renderMapMeetingRoom();
            this.renderMapMeetingRoom(true);
          }, 300);
        }
      );
    } else {
      this.setState({ isVisibleMap: status }, () => {
        clearInterval(this.reloadMapInterval);
      });
    }
  };
  // toggleModalMap = (status) => () => {
  //     if (status) {
  //         this.setState({
  //             isVisibleMap: status,
  //         }, () => {
  //             setTimeout(async () => {
  //                 await this.renderMapMeetingRoom();

  //                 setTimeout(() => {
  //                     this.reloadMapInterval = setInterval(() => {
  //                         this.renderMapMeetingRoom(true);
  //                     }, 5000);
  //                 }, 5000);
  //             }, 300);
  //         });
  //     } else {
  //         this.setState({ isVisibleMap: status }, () => {
  //             clearInterval(this.reloadMapInterval);
  //         });
  //     }
  // }

  handleChangeButton = (isCollapsed, index) => {
    switch (index) {
      case 1: {
        const { listAssignStatement = {} } = this.state;
        return this.setState({
          listAssignStatement: {
            ...listAssignStatement,
            collapseButton: this.getCollapsedIcon(isCollapsed)
          }
        });
      }
      case 2: {
        const { listFinishStatement = {} } = this.state;
        return this.setState({
          listFinishStatement: {
            ...listFinishStatement,
            collapseButton: this.getCollapsedIcon(isCollapsed)
          }
        });
      }
      case 3: {
        const { generalInfo = {} } = this.state;
        return this.setState({
          generalInfo: {
            ...generalInfo,
            button: this.getCollapsedIcon(isCollapsed)
          }
        });
      }
      case 4: {
        const { generalInfo = {} } = this.state;
        return this.setState({
          generalInfo: {
            ...generalInfo,
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

  handleRemoveStatement = () => {
    this.setState(
      {
        isVisibleConfirmRemoveStatement: false
      },
      async () => {
        const { bodyReqRemoveStatement = {} } = this.state;
        const res = await this.props.removeStatement(bodyReqRemoveStatement);

        setTimeout(() => {
          if (res === "true") {
            this.setState(
              {
                isVisibleNotify: true,
                notify: "Bác bỏ phát biểu thành công!",
                meetingMap: []
              },
              () => this.renderMapMeetingRoom(true)
            );
          } else if (res === "false") {
            this.setState({
              isVisibleNotify: true,
              notify:
                "Bác bỏ phát biểu thất bại! Đồng chí vui lòng thử lại sau!"
            });
          }
        }, 500);
      }
    );
  };
  handleRemoveNote = async () => {
    // this.setState({
    //     isVisibleConfirmRemoveNote: false,
    // });

    const { conferenceId } = this.state.selectedMeeting;

    setTimeout(async () => {
      const { notebookId, content } = this.state;
      const res = await this.props.deleteNotebook({
        content: content,
        notebookId: notebookId
      });
      this.renderDataTableNote(conferenceId);
      if (res === "true") {
        this.setState({
          isVisibleNotifyRemoveNote: true,
          notify: "Xóa ghi chú thành công"
        });
      } else if (res === "false") {
        this.setState({
          isVisibleNotifyRemoveNote: true,
          notify: "Xóa ghi chú thất bại! Đồng chí vui lòng thử lại sau!"
        });
      }
    }, 500);
  };
  _renderModalSendFeedBack = () => {
    const {
      isSendFeedBack,
      sendFeedBackValue,
      isVisibleErrAnswer,
      itemEditGopY,
      mess
    } = this.state;
    return (
      <Modal
        isVisible={isSendFeedBack}
        onBackdropPress={() =>
          this.setState({
            isSendFeedBack: false,
            sendFeedBackValue: "",
            itemEditGopY: null
          })
        }
        backdropColor={"rgb(156,156,156)"}
        animationInTiming={400}
        animationOutTiming={500}
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={500}
        hideModalContentWhileAnimating
      >
        <View style={{ backgroundColor: "#EBEFF5", height: height * 0.4 }}>
          <MHeader
            title={"Góp ý Kết luận/ Nghị Quyết"}
            haveClose
            haveEmail={false}
            onClose={() =>
              this.setState({
                isSendFeedBack: false,
                sendFeedBackValue: "",
                itemEditGopY: null
              })
            }
            navigation={this.props.navigation}
            width={width}
            customHeight={35}
          />
          <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <ScrollView>
              <View
                style={{
                  marginHorizontal: 10,
                  justifyContent: "center",
                  marginTop: 10
                }}
              >
                <Text style={styles.boldTxt}>{"Ý kiến"}</Text>
              </View>
              <View
                style={{
                  marginHorizontal: 10,
                  marginTop: 10,
                  backgroundColor: "white"
                }}
              >
                <View
                  style={{
                    margin: 10,
                    alignItems: "center",
                    justifyContent: "flex-start"
                  }}
                >
                  <TextInput
                    style={[
                      styles.inputReason,
                      {
                        width: widthPercent[80] + 10,
                        height: height * 0.15,
                        padding: 7,
                        textAlignVertical: "top"
                      }
                    ]}
                    placeholder={"Nhập nội dung"}
                    multiline
                    onChangeText={text => {
                      this.setState({ sendFeedBackValue: text });
                    }}
                    maxLength={255}
                    value={sendFeedBackValue}
                  />
                </View>
              </View>

              <View
                style={{ flexDirection: "row", justifyContent: "space-around" }}
              >
                <TouchableOpacity
                  style={[styles.buttonOutline, { width: widthPercent[30] }]}
                  onPress={() =>
                    this.setState({
                      isSendFeedBack: false,
                      sendFeedBackValue: "",
                      itemEditGopY: null
                    })
                  }
                >
                  <IconA name="close" size={20} color="#326EC4" />
                  <Text
                    style={{
                      color: "#326EC4",
                      fontWeight: "bold",
                      marginLeft: 10
                    }}
                  >
                    Hủy bỏ
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { width: widthPercent[30] }]}
                  onPress={() => {
                    if (sendFeedBackValue.length == 0) {
                      this.setState({
                        isVisibleErrAnswer: true,
                        mess: `Đồng chí chưa nhập góp ý.`
                      });
                      return;
                    }
                    const { bodyMeetingReq } = this.state;
                    const { selectedMeeting = {} } = this.state;
                    const { conferenceId } = selectedMeeting;
                    const userId = this?.props?.userInfo?.appUser?.id;
                    this.setState(
                      {
                        isSendFeedBack: false,
                        firstLoad: true,
                        sendFeedBackValue: ""
                      },
                      async () => {
                        let returnVlue = null;
                        if (itemEditGopY !== null) {
                          returnVlue = await this.props.editGopY({
                            conferenceFeedback: {
                              conferenceId: conferenceId,
                              feedback: sendFeedBackValue.trim(),
                              modifiedById: userId,
                              feedbackId: itemEditGopY?.feedbackId,
                              createdById: itemEditGopY?.createdById,
                              fullName: itemEditGopY?.fullName,
                              position: itemEditGopY?.position,
                              status: 1
                            }
                          });
                        } else {
                          returnVlue = await this.props.createGopY({
                            conferenceFeedback: {
                              conferenceId: conferenceId,
                              feedback: sendFeedBackValue.trim(),
                              createdById: userId,
                              status: 1
                            }
                          });
                        }

                        if (returnVlue) {
                          await this.props.getListGopY({
                            conferenceId: conferenceId
                          });
                          setTimeout(() => {
                            this.setState({
                              firstLoad: false,
                              itemEditGopY: null
                            });
                          }, 500);
                        } else {
                          setTimeout(() => {
                            this.setState({
                              firstLoad: false
                            });
                          }, 500);
                          setTimeout(() => {
                            this.showAlert(
                              "Đã có lỗi xảy ra, đồng chí vui lòng thử lại sau!"
                            );
                          }, 1000);
                        }
                      }
                    );
                  }}
                >
                  <IconA name="check" size={20} color="white" />
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      marginLeft: 10
                    }}
                  >
                    Góp ý
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
          <Notify
            isVisible={isVisibleErrAnswer}
            content={mess}
            width={width}
            closeNotify={() => this.setState({ isVisibleErrAnswer: false })}
          />
        </View>
      </Modal>
    );
  };
  showAlert = message => {
    Alert.alert("Thông báo", `${message}`, [
      {
        text: "Thoát"
      }
    ]);
  };

  checkToOpenFileAttachFileId = (attachmentId, name, isPdf) => {
    if (isPdf) {
      this.setState({ isVisibleShowFiles1: true, attachFileId: attachmentId });
    } else {
      this.handleViewFile(attachmentId, name);
    }
  };

  getUrlDownload = id => {
    const { sessionId = "" } = this.props;
    const remoteUri = `${hostURL()}/Attachment/get?id=${id}&session=${sessionId}`;
    return remoteUri;
  };

  handleViewFile = async (id, name) => {
    const url = this.getUrlDownload(id);
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

  renderDataTable2 = () => {
    const { vOfficeFiles = [] } = this.props;
    const tableData2 = [];

    if (vOfficeFiles.length === 0) {
      tableData2.push([
        <Text
          key={"table2hasnoitem"}
          style={{ textAlign: "center", color: "grey" }}
        >
          Không có bản ghi
        </Text>
      ]);
    } else {
      vOfficeFiles.forEach((element, index) => {
        const stt = index + 1;
        const { fileName = "", title = "", attachmentId = "" } = element;
        const isPDF = fileName.slice(fileName.length - 3) === "pdf";
        const itemData = [
          <Text style={{ textAlign: "center" }}>{stt}</Text>,
          <Text
            style={{ textAlign: "left", color: "#3939FF", paddingLeft: 10 }}
            onPress={() =>
              this.checkToOpenFileAttachFileId(attachmentId, fileName, isPDF)
            }
          >
            {fileName}
          </Text>,
          <Text style={{ textAlign: "left", paddingLeft: 10, paddingRight: 5 }}>
            {title}
          </Text>
        ];
        const rowData = (
          <Row
            key={index.toString()}
            flexArr={[1, 5, 4]}
            data={itemData}
            style={styles.contentTable}
          />
        );
        tableData2.push(rowData);
      });
    }

    this.setState({
      tableData2
    });
  };

  handleViewFileMeetConClusion = async ()=> {
    const data = this.props.conclusion[0];
    if(data){
      const { attachmentId, name } = data;
      const isPDF = name.slice(name.length - 3) === "pdf";
      this.checkToOpenFileAttachFileId(attachmentId, name, isPDF);
    }
  }

  render() {
    const {
      permission = {},
      width,
      height,
      isSendFeedBack,
      conferenceParticipantIdAssign,
      isEditFeedBack,
      listOpine = { header: [], body: [], button: "plus-circle-outline" },
      selectedMeeting = {},
      listData = [],
      tableHead = [],
      typeGuests = 1,
      listGovernmentMemsHeader = [],
      listGovernmentMemsHeaderChairman = [],
      listGuestsHeader = [],
      listDepartmentParticipantsHeader = [],
      selectedDepartmentParticipant = "",
      listJoin = [],
      listJoinLoading = false,
      isVisibleJoin = false,
      isVisibleAbsent = false,
      isVisibleAuthority = false,
      isVisibleSpeak = false,
      isVisibleNote = false,
      isVisibleApprove = false,
      isVisibleOpine = false,
      isVisibleRefuse = false,
      isVisibleAssign = false,
      notify,
      isVisibleNotify = false,
      isVisibleNotifyRemoveNote = false,
      onPressed = 1,
      firstLoading = false,
      isMoiDonVi = false,
      newListAssignParticipant = [],
      lstMember = [],
      isCVVP = false,
      isTK = false,
      isDrawerOpen,
      isVisibleMap = false,
      isVisibleInfor = false,
      isVisibleOpinion = false,
      isDeleteFeedBack = false,
      itemDeleteGopY = null,
      itemEditGopY = null,
      labelInfor = null,
      titleOpinion = null,
      opinionsInfor = [],
      meetingMap = [],
      meetingMapLoading = false,
      labelArr = [],
      listAssignStatement = {
        header: [],
        body: [],
        collapseButton: "plus-circle-outline"
      },
      listFinishStatement = {
        header: [],
        body: [],
        collapseButton: "plus-circle-outline"
      },
      isVisibleShowFiles = false,
      isVisibleShowFilesFeedBack = false,
      isVisibleShowFilesCT = false,
      loadingListDepartmentAssigned,
      listDepartmentAssignedParticipantsState = null,
      listDepartmentAssignedParticipantsHeader = [],
      isVisibleConfirmRemoveStatement = false,
      isVisibleConfirmRemoveNote = false,
      isChairman = false,
      isNotHappen = false,
      isShowingAuthorityButton = true,
      isShowingApproval = false,
      isCheckApproval = false,
      isShowingNote = true,
      isApprover = false,
      isVisibleNotifyGuest = false,
      activeNoteScreen = "LIST",
      content = "",
      notebookId = 0,
      tableFeedBackHead,
      generalInfo = { button: "plus-circle-outline" },
      isSetPermission = false,
      isMemberInvited = false,
      isVisibleAttach1,
      isVisibleShowFiles1,
      tableData2,
      attachFileId
    } = this.state;
    const {
      chairmanName = "",
      location = "",
      name = "",
      participantStatusName = "",
      participantStatus,
      participantAssignedStatus,
      strEndDate = "",
      strStartDate = "",
      status = 0,
      statusName = "",
      lstContent = [],
      participantAssignedStatusName = "",
      loaiGiayMoi = "",
      fileGiayMoi = {},
      programText = "",
      fileCTHop = {},
      fileNghiQuyet = null
    } = selectedMeeting;
    let isKhachMoi = false;
    if (this.props.userInfo != null)
      isKhachMoi = this.props.userInfo.code === "ROLE_KHACHMOI";
    const checkDecline = status === CONFERENCE_STATUS.TU_CHOI;
    const checkApproving = status === CONFERENCE_STATUS.CHO_PHE_DUYET;
    const isShowBottomButtons =
      status === CONFERENCE_STATUS.DA_GUI ||
      status === CONFERENCE_STATUS.DANG_HOP ||
      status === CONFERENCE_STATUS.CHUA_GUI;
    const haveNoStatusName =
      participantStatusName === "" && participantAssignedStatusName === "";
    const styleWidth2Sides = { width: width * 0.22 };
    const styleWidthCenter = { width: width * 0.5 };
    const { attachmentId = "", name: tenFileGiayMoi = "" } = fileGiayMoi;
    const attachmentNghiQuyetID = fileNghiQuyet?.attachmentId;
    const attachmentNghiQuyetName = fileNghiQuyet?.name;
    const isShowConfStatus =
      ((isCVVP && isMemberInvited) ||
        (permission.approval && isMemberInvited) ||
        (isMemberInvited && !isCVVP && !isSetPermission)) &&
      status === CONFERENCE_STATUS.DA_GUI;
    const isConfirmMeeting = status !== CONFERENCE_STATUS.TU_CHOI || status !== CONFERENCE_STATUS.CHUA_GUI ||status !== CONFERENCE_STATUS.CHO_PHE_DUYET;

    const {
      attachmentId: idFileChuongTrinh = "",
      name: tenFileChuongTrinh = ""
    } = fileCTHop;
    // const {
    //   attachmentId: idFileChuongTrinh = '',
    //   name: tenFileChuongTrinh = '',
    // } = fileNghiQuyet;

    return (
      <View onLayout={this.onLayout} style={styles.container}>
        <CustomHeader
          haveMenu
          onPressButton={this.openControlPanel}
          // title={'BAN THƯỜNG VỤ TỈNH ỦY'}
          // title={'Họp uỷ ban nhân dân'}
          title={"Lịch họp"}
          navigation={this.props.navigation}
          width={width}
        />

        <Drawer
          open={isDrawerOpen}
          type={"overlay"}
          // ref={(ref) => (this._drawer = ref)}
          content={
            <View style={styles.drawerContainer}>
              <View style={styles.boderBottom}>
                <Text style={styles.drawerTitle}>{"Danh sách phiên họp"}</Text>
              </View>

              <View
                style={[styles.boderBottom, { backgroundColor: "#e9e9e9" }]}
              >
                <View style={styles.drawerButtonsContainer}>
                  <TouchableOpacity onPress={this.onPressNotEndConference}>
                    <View
                      style={[
                        styles.drawerTopButtons,
                        styles.drawerButtonLeft,
                        {
                          width: width * 0.37,
                          backgroundColor: onPressed === 1 ? "#316ec4" : "#fff"
                        }
                      ]}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          color: onPressed === 1 ? "#fff" : "black"
                        }}
                      >
                        {"Chưa kết thúc"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.onPressEndConference}>
                    <View
                      style={[
                        styles.drawerTopButtons,
                        styles.drawerButtonRight,
                        {
                          width: width * 0.37,
                          backgroundColor: onPressed === 2 ? "#316ec4" : "#fff"
                        }
                      ]}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          color: onPressed === 2 ? "#fff" : "black"
                        }}
                      >
                        {"Đã kết thúc"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.boderBottom, styles.drawerTitleTotal]}>
                <View style={styles.totalConferenceContainer}>
                  <Text>{"Tổng số "}</Text>
                  <Text style={styles.textTotalConference}>
                    {this.props.totalMeeting}
                  </Text>
                  <Text>{" cuộc họp"}</Text>
                </View>
              </View>

              <FlatList
                data={listData}
                extraData={this.state.extraData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderItem}
                showsVerticalScrollIndicator={false}
                refreshing
                ListFooterComponent={this.renderFooter}
                onEndReachedThreshold={0.4}
                onEndReached={this.handleLoadMore}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.extraData.isRefreshing}
                    onRefresh={this.onRefresh}
                    tintColor={"#316ec4"}
                  />
                }
              />
              {this.state.loading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size={"large"} color={"#316ec4"} />
                </View>
              )}
            </View>
          }
          tapToClose
          onOpen={this.onOpenDrawer}
          onClose={this.onCloseDrawer}
          openDrawerOffset={0.2}
          closedDrawerOffset={-3}
          tweenHandler={ratio => ({
            main: { opacity: (2 - ratio * ratio) / 2 }
          })}
          tweenDuration={300}
        >
          {/* HEADER */}
          <View style={styles.headerBodyContent}>
            <View style={styleWidth2Sides} />

            <View style={styleWidthCenter}>
              <Text style={styles.headerTextContent}>
                {"Chi tiết phiên họp"}
              </Text>
            </View>

            <View style={styleWidth2Sides}>
              <View
                style={[
                  styles.bodyStatus,
                  {
                    backgroundColor:
                      status === CONFERENCE_STATUS.DANG_HOP ? "#fba500" : "#fff"
                  }
                ]}
              >
                <Text style={styles.bodyStatusText}>{statusName}</Text>
              </View>
            </View>
          </View>

          {!this.state.firstLoading && listData.length === 0 ? (
            <View style={styles.noDataContainer}>
              <Image source={srcImg} style={styles.noDataImage} />
              <Text style={styles.noDataText}>{"Không có dữ liệu"}</Text>
            </View>
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.extraData.isRefreshing}
                  onRefresh={this.onRefresh}
                />
              }
            >
              <TouchableWithoutFeedback>
                <View style={styles.subContainer}>
                  {/* DETAIL */}
                  <View
                    style={[styles.detailBodyContent, { width: width + 2 }]}
                  >
                    {/* TEN CUOC HOP */}
                    <View style={{ width: width * 0.7 }}>
                      <Text style={styles.textConferenceName}>{name}</Text>
                    </View>

                    {/* THOI GIAN */}
                    <View style={{ width: width * 0.9, paddingTop: 8 }}>
                      <Text style={styles.textConferenceTime}>
                        {`${strStartDate} - ${strEndDate}`}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: width * 0.4,
                        borderTopColor: "#707070",
                        borderTopWidth: 1,
                        marginTop: 15
                      }}
                    />

                    {/* DIA DIEM */}
                    <View style={{ width: width * 0.8, paddingTop: 8 }}>
                      <Text
                        style={styles.textAlignCenter}
                      >{`${TITLE_MEETING.LOCATION}: ${location}`}</Text>
                    </View>

                    {/* CHU TRI */}
                    <View style={{ width: width * 0.7, paddingTop: 3 }}>
                      <Text
                        style={styles.textAlignCenter}
                      >{`${TITLE_MEETING.CHAIRMAN}: ${chairmanName}`}</Text>
                    </View>
                    {/* GIAY MOI HOP */}
                    <View
                      style={[
                        styles.flexRowAlignCenter,
                        {
                          width: width * 0.8,
                          paddingTop: 3,
                          justifyContent: "center"
                        }
                      ]}
                    >
                      <Text style={styles.textAlignCenter}>
                        {"Giấy mời họp:"}
                      </Text>

                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            isVisibleShowFiles: true,
                            selectedAttachFile: attachmentId
                          })
                        }
                      >
                        <View style={{ maxWidth: width * 0.6 }}>
                          <Text style={styles.labelGiayMoi} numberOfLines={1}>
                            {tenFileGiayMoi}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    {isVisibleShowFiles && (
                      <ShowFiles
                        isVisible
                        title={"Giấy mời họp"}
                        toggleModal={() =>
                          this.setState({ isVisibleShowFiles: false })
                        }
                        fileId={this.state.selectedAttachFile}
                        name={tenFileGiayMoi}
                      />
                    )}
                    {/* Thành phần tham gia */}
                    <View style={{ width: width * 0.7, paddingTop: 3 }}>
                      <TouchableOpacity onPress={this.toggleModal(true)}>
                        <Text style={styles.textListJoins}>
                          {"Thành phần tham gia và khách mời"}
                        </Text>
                        <Modal
                          animationInTiming={400}
                          animationOutTiming={500}
                          backdropTransitionInTiming={500}
                          backdropTransitionOutTiming={500}
                          isVisible={this.state.isVisible}
                          backdropColor={"rgb(156,156,156)"}
                          toggleModalContentWhileAnimating
                          style={{ width, marginLeft: 0 }}
                        >
                          <View
                            style={{
                              backgroundColor: "#ebeff5",
                              height: height * 0.85,
                              marginHorizontal: 5
                            }}
                          >
                            <View style={{ zIndex: 1 }}>
                              <CustomHeader
                                title={LABELS.LAB0007}
                                haveClose
                                onClose={this.toggleModal(false)}
                                customHeight={35}
                              />
                              <Table>
                                <Row
                                  flexArr={[1, 1]}
                                  data={[
                                    <TouchableOpacity
                                      onPress={this.toggleChangeTypeGuests(1)}
                                    >
                                      <Text
                                        style={[
                                          styles.textButtonGuestType,
                                          {
                                            backgroundColor:
                                              this.state.typeGuests === 1
                                                ? "#A5C3EB"
                                                : "#d6e2f3"
                                          }
                                        ]}
                                      >
                                        {"Thành viên"}
                                      </Text>
                                    </TouchableOpacity>,
                                    <TouchableOpacity
                                      onPress={this.toggleChangeTypeGuests(2)}
                                    >
                                      <Text
                                        style={[
                                          styles.textButtonGuestType,
                                          {
                                            backgroundColor:
                                              this.state.typeGuests === 2
                                                ? "#A5C3EB"
                                                : "#d6e2f3"
                                          }
                                        ]}
                                      >
                                        {"KM đơn vị"}
                                      </Text>
                                    </TouchableOpacity>,
                                    <TouchableOpacity
                                      onPress={this.toggleChangeTypeGuests(3)}
                                    >
                                      <Text
                                        style={[
                                          styles.textButtonGuestType,
                                          {
                                            backgroundColor:
                                              this.state.typeGuests === 3
                                                ? "#A5C3EB"
                                                : "#d6e2f3"
                                          }
                                        ]}
                                      >
                                        {"Khách mời"}
                                      </Text>
                                    </TouchableOpacity>
                                  ]}
                                  style={styles.headerTable}
                                  textStyle={styles.headerTableText}
                                />
                              </Table>
                              <Table borderStyle={styles.borderTableModalJoins}>
                                {typeGuests === 1 ? (
                                  <Row
                                    flexArr={[2, 5, 3, 5, 5, 5, 2]}
                                    data={
                                      (CONFERENCE_STATUS.DANG_HOP === status ||
                                        CONFERENCE_STATUS.DA_GUI === status) &&
                                      (isChairman || permission.absentApprove)
                                        ? listGovernmentMemsHeaderChairman
                                        : listGovernmentMemsHeader
                                    }
                                    style={styles.headerTable2}
                                    textStyle={[styles.headerTableText2]}
                                  />
                                ) : (
                                  <Row
                                    flexArr={[2, 9, 10]}
                                    data={
                                      typeGuests === 2
                                        ? listDepartmentParticipantsHeader
                                        : listGuestsHeader
                                    }
                                    style={styles.headerTable2}
                                    textStyle={styles.headerTableText2}
                                  />
                                )}
                              </Table>
                            </View>

                            <View style={styles.flex1}>
                              {listJoinLoading ? (
                                <View style={styles.loadingContainer}>
                                  <ActivityIndicator
                                    size={"large"}
                                    color={"#316ec4"}
                                  />
                                </View>
                              ) : (
                                <ScrollView
                                  showsVerticalScrollIndicator={false}
                                >
                                  <Table
                                    borderStyle={styles.borderTableModalJoins}
                                  >
                                    {listJoin}
                                  </Table>
                                </ScrollView>
                              )}
                            </View>
                            {/*Danh sách tham gia ý kiến*/}
                            {/* <Modal
                                                                animationInTiming={400}
                                                                animationOutTiming={500}
                                                                backdropTransitionInTiming={500}
                                                                backdropTransitionOutTiming={500}
                                                                isVisible={isVisibleOpinion}
                                                                onBackdropPress={this.toggleModalOpinion(false)}
                                                                backdropColor={'rgb(156,156,156)'}
                                                                hideModalContentWhileAnimating
                                                            >
                                                                <View style={styles.containerModalInfo}>
                                                                    <View style={styles.containerHeaderInfo}>
                                                                        <Text style={styles.headerJoinText}>
                                                                            {'Danh sách tham gia ý kiến'}
                                                                        </Text>
                                                                    </View>
                                                                    <Table borderStyle={{ borderWidth: 1, borderColor: '#707070' }}>
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
                                                            </Modal> */}
                            {(CONFERENCE_STATUS.DANG_HOP === status ||
                              CONFERENCE_STATUS.DA_GUI === status) &&
                              (isChairman || permission.absentApprove) &&
                              typeGuests === 1 && (
                                <View
                                  style={[
                                    {
                                      marginVertical: width * 0.02,
                                      justifyContent: "space-evenly"
                                    },
                                    styles.flexRowAlignCenter
                                  ]}
                                >
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.handleApproveAbsent("accept")
                                    }
                                  >
                                    <View
                                      style={styles.bottomButtonsModalGuest}
                                    >
                                      <Text style={styles.textAlignCenterWhite}>
                                        {"Duyệt báo vắng"}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={this.handleApproveAbsent}
                                  >
                                    <View
                                      style={styles.bottomButtonsModalGuest}
                                    >
                                      <Text style={styles.textAlignCenterWhite}>
                                        {"Từ chối báo vắng"}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              )}
                            <Modal
                              animationInTiming={400}
                              animationOutTiming={500}
                              backdropTransitionInTiming={500}
                              backdropTransitionOutTiming={500}
                              isVisible={
                                this.state
                                  .isVisibleDepartmentAssignedParticipant
                              }
                              backdropColor={"rgb(156,156,156)"}
                              toggleModalContentWhileAnimating
                            >
                              <View
                                style={{
                                  backgroundColor: "#ebeff5",
                                  height: height * 0.65
                                }}
                              >
                                <CustomHeader
                                  title={LABELS.LAB0010}
                                  haveClose
                                  onClose={this.toggleModalDepartmentAssignedParticipant(
                                    false
                                  )}
                                  customHeight={35}
                                />

                                <View style={styles.padding5}>
                                  <Text>{`Đơn vị: ${selectedDepartmentParticipant}`}</Text>
                                </View>

                                <Table
                                  borderStyle={styles.borderTableModalJoins}
                                >
                                  <Row
                                    flexArr={[2, 9, 9]}
                                    data={
                                      listDepartmentAssignedParticipantsHeader
                                    }
                                    style={styles.headerTable2}
                                    textStyle={styles.headerTableText2}
                                  />
                                </Table>

                                {loadingListDepartmentAssigned ? (
                                  <View
                                    style={[
                                      styles.loadingContainer,
                                      { marginTop: "15%" }
                                    ]}
                                  >
                                    <ActivityIndicator
                                      size={"large"}
                                      color={"#316ec4"}
                                    />
                                  </View>
                                ) : (
                                  <ScrollView>
                                    <Table
                                      borderStyle={styles.borderTableModalJoins}
                                    >
                                      {listDepartmentAssignedParticipantsState}
                                    </Table>
                                  </ScrollView>
                                )}
                              </View>
                            </Modal>

                            <Notify
                              isVisible={isVisibleNotifyGuest}
                              content={notify}
                              width={width}
                              closeNotify={() =>
                                this.setState({ isVisibleNotifyGuest: false })
                              }
                            />
                          </View>
                        </Modal>
                      </TouchableOpacity>
                    </View>

                    {/* LOAI */}
                    {loaiGiayMoi !== "" && (
                      <View style={{ width: width * 0.7, paddingTop: 3 }}>
                        <Text
                          style={styles.textAlignCenter}
                        >{`Loại: ${loaiGiayMoi}`}</Text>
                      </View>
                    )}

                    <View style={styles.containerButtonMap}>
                      <TouchableOpacity
                        style={styles.buttonMap}
                        onPress={this.toggleModalMap(true)}
                      >
                        <Text style={styles.textAlignCenterWhite}>
                          {"Sơ đồ"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{ padding: 10, marginBottom: fileNghiQuyet !== null ? -10 : -5 }}>
                    <Text
                      style={[styles.labelConferenceStatus, { color: "#2059EE" }]}
                      onPress={() => {
                        this.setState({ isVisibleAttach1: true });
                        this.renderDataTable2();
                      }}
                    >
                      {"Tài liệu chung đồng bộ từ QLVB"} ({this.props.vOfficeFiles.length})
                    </Text>
                    <ModalAttachFile
                      width={width}
                      height={height}
                      isVisible={isVisibleAttach1}
                      toggleModal={() =>
                        this.setState({ isVisibleAttach1: false })
                      }
                      tableData={tableData2}
                      headName={"Danh sách tài liệu"}
                      threeHeader="Trích yếu"
                      isVisibleShowFiles={
                        attachFileId !== 0 &&
                        isVisibleShowFiles1 &&
                        isVisibleAttach1
                      }
                      attachFileId={attachFileId}
                      toggleShowFiles={() =>
                        this.setState({ attachFileId: 0 })
                      }
                    />
                  </View>

                  {/* KET LUAN NGHI QUYET */}
                  {fileNghiQuyet !== null && (
                    <View style={{ padding: 10 }}>
                      <View>
                        <Text style={styles.labelConferenceStatus}>
                          Kết luận/ Nghị quyết
                        </Text>
                      </View>
                      <View style={styles.userInfer}>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <IconA name={"filetext1"} size={18} color={"black"} />
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({
                                isVisibleShowFilesFeedBack: true,
                                selectedAttachFileNghiQuyet: attachmentNghiQuyetID
                              });
                            }}
                          >
                            <Text style={{ marginLeft: 10, color: "#2059EE" }}>
                              Kết luận/ Nghị quyết
                            </Text>
                          </TouchableOpacity>
                        </View>
                        {participantStatusName &&
                        participantStatusName ===
                          PARTICIPANT_STATUS_NAME.JOIN ? (
                          <TouchableOpacity
                            onPress={() => {
                              const userId = this?.props?.userInfo?.appUser?.id;
                              const checkExistGopY = this?.props?.listGopY?.findIndex(
                                i => i.createdById === userId
                              );
                              if (checkExistGopY >= 0) {
                                this.showAlert(
                                  "Đồng chí đã thực hiện góp ý, vui lòng quay lại danh sách để sửa góp ý"
                                );
                              } else {
                                this.setState({
                                  isSendFeedBack: true
                                });
                              }
                            }}
                            style={styles.feedback}
                          >
                            <Text style={{ color: "#2059EE" }}>Góp ý</Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </View>
                  )}

                  {isVisibleShowFilesFeedBack && (
                    <ShowFiles
                      isVisible
                      title={"Kết luận/ Nghị quyết"}
                      toggleModal={() =>
                        this.setState({ isVisibleShowFilesFeedBack: false })
                      }
                      fileId={this.state.selectedAttachFileNghiQuyet}
                      name={attachmentNghiQuyetName}
                    />
                  )}
                  {this._renderModalSendFeedBack()}
                  <Confirm
                    width={width}
                    isVisible={isDeleteFeedBack}
                    titleHeader={"Xóa góp ý"}
                    content={"Bạn có chắc chắn muốn xóa góp ý không ?"}
                    onCancel={() =>
                      this.setState({
                        isDeleteFeedBack: false,
                        itemDeleteGopY: null
                      })
                    }
                    onOk={() => {
                      this.setState(
                        {
                          isDeleteFeedBack: false,
                          itemDeleteGopY: null,
                          firstLoad: true
                        },
                        async () => {
                          const returnVlue = await this.props.deleteGopY({
                            conferenceFeedback: {
                              ...itemDeleteGopY,
                              status: 0
                            }
                          });
                          if (returnVlue) {
                            const { bodyMeetingReq } = this.state;
                            const { selectedMeeting = {} } = this.state;
                            const { conferenceId } = selectedMeeting;
                            await this.props.getListGopY({
                              conferenceId: conferenceId
                            });
                            this.setState({
                              firstLoad: false
                            });
                          } else {
                            this.setState({
                              firstLoad: false
                            });
                            this.showAlert(
                              "Đã có lỗi xảy ra, đồng chí vui lòng thử lại sau!"
                            );
                          }
                        }
                      );
                    }}
                  />
                  {/* DANH SACH GOP Y */}
                  {fileNghiQuyet !== null && (
                    <View style={{ marginVertical: 7 }}>
                      <Collapse
                        onToggle={isCollapsed =>
                          this.handleChangeButton(isCollapsed, 4)
                        }
                      >
                        <CollapseHeader>
                          <View style={styles.headerCollapse}>
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between"
                              }}
                            >
                              <View style={styles.flexRowAlignCenter}>
                                <View style={{ width: 20 }}>
                                  <IconM
                                    name={generalInfo.button}
                                    size={17}
                                    color={"#999"}
                                  />
                                </View>
                                <Text style={styles.headerCollapseText}>
                                  {`Danh sách góp ý KL/NQ (${this?.props
                                    ?.listGopY?.length || 0})`}
                                </Text>
                              </View>
                              {(participantStatusName &&
                                participantStatusName ===
                                  PARTICIPANT_STATUS_NAME.JOIN &&
                                fileNghiQuyet !== null) ||
                              (fileNghiQuyet !== null && isCVVP) ? (
                                <TouchableOpacity
                                  style={{
                                    width: "20%",
                                    height: 35,
                                    flexDirection: "row",
                                    justifyContent: "flex-end",
                                    position: "absolute",
                                    top: -7,
                                    right: -15,
                                    paddingRight: 15,
                                    paddingTop: 7
                                  }}
                                  onPress={() => {
                                    this.setState({
                                      isEditFeedBack: !this.state.isEditFeedBack
                                    });
                                  }}
                                >
                                  {isEditFeedBack ? (
                                    <IconA
                                      name="save"
                                      size={18}
                                      color="#3060DB"
                                    />
                                  ) : (
                                    <IconA
                                      name="edit"
                                      size={18}
                                      color="#3060DB"
                                    />
                                  )}
                                </TouchableOpacity>
                              ) : null}
                            </View>
                          </View>
                        </CollapseHeader>

                        <CollapseBody>
                          <View style={styles.marginTop7}>
                            <Table borderStyle={styles.borderTableContent}>
                              <Row
                                flexArr={[2, 5, 3]}
                                data={tableFeedBackHead}
                                style={styles.headerTable}
                                textStyle={styles.headerTableText}
                              />
                              <Rows
                                flexArr={[2, 5, 3]}
                                data={this.renderDataTableGopY(
                                  this.props.listGopY
                                )}
                                style={styles.contentTable}
                              />
                            </Table>
                          </View>
                        </CollapseBody>
                      </Collapse>
                    </View>
                  )}

                  {/*Chuong trinh hop */}
                  <View style={{ marginTop: 7 }}>
                    <Collapse
                      onToggle={isCollapsed =>
                        this.handleChangeButton(isCollapsed, 3)
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
                              {"Chương trình họp"}
                            </Text>
                          </View>
                        </View>
                      </CollapseHeader>

                      <CollapseBody>
                        {programText != "" ? (
                          <View style={styles.programTextBorder}>
                            <ScrollView style={{ flex: 1 }}>
                              <HTML
                                source={{ html: programText }}
                                contentWidth={width}
                              />
                            </ScrollView>
                          </View>
                        ) : tenFileChuongTrinh != "" ? (
                          <View style={styles.programNoTextBorder}>
                            <TouchableOpacity
                              onPress={() =>
                                this.setState({
                                  isVisibleShowFilesCT: true,
                                  selectedAttachFile: idFileChuongTrinh
                                })
                              }
                            >
                              <View
                                style={[
                                  styles.flexRowAlignCenter,
                                  { paddingRight: 10 }
                                ]}
                              >
                                <IconM
                                  name={"file-pdf-outline"}
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
                                  {tenFileChuongTrinh}
                                </Text>
                              </View>
                            </TouchableOpacity>
                            {isVisibleShowFilesCT && (
                              <ShowFiles
                                isVisible
                                title={"Chương trình họp"}
                                toggleModal={() =>
                                  this.setState({
                                    isVisibleShowFilesCT: false
                                  })
                                }
                                fileId={this.state.selectedAttachFile}
                                name={tenFileChuongTrinh}
                              />
                            )}
                          </View>
                        ) : (
                          <View style={styles.programNoTextBorder}>
                            <Text style={{ color: "#fba500" }}>
                              {"Chưa có chương trình họp"}
                            </Text>
                          </View>
                        )}
                      </CollapseBody>
                    </Collapse>

                  </View>
                  {/* BANG NOI DUNG */}
                  <View style={styles.containerTableContent}>
                    <View
                      style={[
                        styles.flexRowAlignCenter,
                        { justifyContent: "space-between", flex: 1 }
                      ]}
                    >
                      <View style={{ width: width * 0.5, minWidth: 150 }}>
                        <Text style={styles.textHeaderTableContent}>
                          {TITLE_MEETING.MEETING_CONTENTS}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.marginTop7}>
                      <Table borderStyle={styles.borderTableContent}>
                        <Row
                          flexArr={[1, 5, 3]}
                          data={tableHead}
                          style={styles.headerTable}
                          textStyle={styles.headerTableText}
                        />
                        <Rows
                          flexArr={[1, 5, 3]}
                          data={this.renderDataTable(lstContent)}
                          style={styles.contentTable}
                        />
                      </Table>
                    </View>
                  </View>

                  {/* TRANG THAI */}
                  <View style={styles.containerConferenceStatus}>
                    {/* <View>
                      {isCVVP ||
                      haveNoStatusName ||
                      status >= CONFERENCE_STATUS.DA_GUI ? (
                        <Text style={styles.labelConferenceStatus}>
                          {TITLE_MEETING.CONFERENCE_STATUS}
                        </Text>
                      ) : (
                        <Text style={styles.labelConferenceStatus}>
                          {TITLE_MEETING.CONFIRM_STATUS}
                        </Text>
                      )}
                    </View>
                    <View style={styles.userStatus}>
                      {isCVVP || haveNoStatusName ? (
                        <Text style={styles.textConferenceStatus}>
                          {CONFERENCE_STATUS_LABELS[status]}
                        </Text>
                      ) : (
                        <Text style={styles.textConferenceStatus}>
                          {status >= CONFERENCE_STATUS.DA_GUI
                            ? CONFERENCE_STATUS_LABELS[status]
                            : participantAssignedStatusName ||
                              participantStatusName}
                        </Text>
                      )}
                    </View> */}
                    {/* <View>
                      <Text style={styles.labelConferenceStatus}>
                        Thông báo kết luận họp ({this.props.conclusion.length})
                      </Text>
                      {this.props.conclusion.length > 0 ? (
                          <View style={[styles.flexRowAlignCenter, { paddingRight: 10 }]}>
                            <IconA name={"filetext1"} size={18} color={"black"} />
                            <Text
                              style={{
                                color: "#316ec4",
                                fontWeight: "bold",
                                fontSize: 13,
                                paddingLeft: 5,
                                paddingVertical: 3,
                              }}
                              onPress={this.handleViewFileMeetConClusion}
                            >
                              {this.props.conclusion[0]?.name ?? ''}
                            </Text>
                          </View>
                        ) : (
                          <Text style={{ marginTop: 5, fontWeight: "500", marginBottom: 10 }}>Không có</Text>
                      )}
                    </View> */}
                    {(isCVVP ||
                      (permission.approval &&
                        status >= CONFERENCE_STATUS.DA_GUI &&
                        isApprover) ||
                      (isMemberInvited &&
                        status === CONFERENCE_STATUS.DA_GUI) ||
                      haveNoStatusName) && (
                      <>
                        <View>
                          <Text style={styles.labelConferenceStatus}>
                            {TITLE_MEETING.CONFERENCE_STATUS}
                          </Text>
                        </View>
                        <View style={styles.userStatus}>
                          <Text style={styles.textConferenceStatus}>
                            {CONFERENCE_STATUS_LABELS[status]}
                          </Text>
                        </View>
                      </>
                    )}
                    {isShowConfStatus && (
                      <>
                        <View>
                          <Text style={styles.labelConferenceStatus}>
                            {TITLE_MEETING.CONFIRM_STATUS}
                          </Text>
                        </View>
                        <View style={styles.userStatus}>
                          <Text style={styles.textConferenceStatus}>
                            {participantAssignedStatusName ||
                              participantStatusName}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          )}

          {isShowBottomButtons && status !== CONFERENCE_STATUS.CHUA_GUI ? (
            <View style={styles.containerBottomButtons}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={[styles.flexRowAlignCenter, styles.flex1]}>
                  {/* PHE DUYET */}
                  {isShowingApproval && (
                    <TouchableOpacity
                      style={[
                        styles.flexRowAlignCenter,
                        styles.bottomButtons,
                        {
                          backgroundColor: "#326EC4"
                        }
                      ]}
                      onPress={this.toggleModalApprove(true)}
                    >
                      <View>
                        {permission.approval && isCheckApproval ? (
                          <PheDuyetIcon width={40} height={40} />
                        ) : (
                          <TrinhPheDuyetIcon width={40} height={40} />
                        )}
                        <ModalApprove
                          width={width}
                          height={height}
                          isVisible={isVisibleApprove}
                          toggleModal={this.toggleModalApprove(false)}
                          toggleIcon={this.toggleShowIconApprove(false)}
                          isApproval={isSetPermission}
                          reloadListMeeting={this.toggleReloadApprove}
                          selectedMeeting={this.props.selectedMeeting}
                        />
                      </View>
                    </TouchableOpacity>
                  )}

                  {/* UY QUYEN*/}
                  {isChairman && isShowingAuthorityButton && isNotHappen && (
                    <TouchableOpacity
                      style={[
                        styles.flexRowAlignCenter,
                        styles.bottomButtons,
                        { backgroundColor: "#fab368" }
                      ]}
                      onPress={this.toggleModalAuthority(true)}
                    >
                      <View style={styles.containerIconBottomButtons}>
                        <IconM
                          name={"account-arrow-right"}
                          size={28}
                          color={"#fff"}
                        />
                      </View>
                      <ModalAuthority
                        width={width}
                        height={height}
                        isVisible={isVisibleAuthority}
                        listAllDeputyForMobile={
                          this.props.listAllDeputyForMobile
                        }
                        updateConferenceParticipantAndDelegation={
                          this.props.updateConferenceParticipantAndDelegation
                        }
                        toggleModal={this.toggleModalAuthority(false)}
                        syncMeeting={this.syncMeeting}
                        toggleAuthorityButton={this.toggleAuthorityButton}
                        strStartDate={strStartDate}
                        strEndDate={strEndDate}
                      />
                    </TouchableOpacity>
                  )}

                  {/* THAM GIA */}
                  {((permission.join && !isKhachMoi && isMemberInvited) ||
                    (!isKhachMoi &&
                      isMemberInvited &&
                      status === CONFERENCE_STATUS.DA_GUI)) && (
                        <TouchableOpacity
                          disabled={
                            participantStatusName ===
                            PARTICIPANT_STATUS_NAME.JOIN
                          }
                          style={[
                            styles.flexRowAlignCenter,
                            styles.bottomButtons,
                            {
                              backgroundColor:
                                participantStatusName !==
                                PARTICIPANT_STATUS_NAME.JOIN
                                  ? "#008489"
                                  : "#aaaaaa"
                            }
                          ]}
                          onPress={this.toggleModalJoin(true)}
                        >
                          <View style={styles.containerIconBottomButtons}>
                            <IconM name={"check"} size={28} color={"#fff"} />
                          </View>

                          <ModalJoin
                            width={width}
                            height={height}
                            isVisible={isVisibleJoin}
                            conferenceParticipant={
                              this.props.conferenceParticipant
                                ? {
                                    ...this.props.conferenceParticipant,
                                    status: 1,
                                    loaiGiayMoi
                                  }
                                : {}
                            }
                            conferenceParticipantIdAssign={
                              this.state.conferenceParticipantIdAssign
                            }
                            updateParticipant={this.props.updateParticipant}
                            selectedMeeting={this.props.selectedMeeting}
                            userId={this.props.userInfo.appUser}
                            toggleModal={this.toggleModalJoin(false)}
                            syncMeeting={this.syncMeeting}
                          />
                        </TouchableOpacity>
                      )}

                  {/* BAO VANG */}
                  {permission.absent && !isMoiDonVi && isMemberInvited && (
                    <TouchableOpacity
                      disabled={
                        participantStatusName === PARTICIPANT_STATUS_NAME.ABSENT
                      }
                      style={[
                        styles.flexRowAlignCenter,
                        styles.bottomButtons,
                        {
                          backgroundColor:
                            participantStatusName !==
                            PARTICIPANT_STATUS_NAME.ABSENT
                              ? "#B6292B"
                              : "#aaaaaa"
                        }
                      ]}
                      onPress={this.toggleModalAbsent(true)}
                    >
                      <View style={styles.containerIconBottomButtons}>
                        <IconM
                          name={"account-remove"}
                          size={28}
                          color={"#fff"}
                        />
                      </View>
                      <ModalAbsent
                        width={width}
                        height={height}
                        isVisible={isVisibleAbsent}
                        updateParticipant={this.props.updateParticipant}
                        toggleModal={this.toggleModalAbsent(false)}
                        syncMeeting={this.syncMeeting}
                        strStartDate={strStartDate}
                        strEndDate={strEndDate}
                      />
                    </TouchableOpacity>
                  )}

                  {/* THAM GIA Y KIEN */}
                  {permission.opine && isMemberInvited && (
                    <TouchableOpacity
                      style={[
                        styles.flexRowAlignCenter,
                        styles.bottomButtons,
                        { backgroundColor: "#008489" }
                      ]}
                      onPress={this.toggleModalOpine(true)}
                    >
                      <View style={styles.containerIconBottomButtons}>
                        <IconM name={"wechat"} size={28} color={"#fff"} />
                      </View>
                      <ModalOpine
                        width={width}
                        height={height}
                        isVisible={isVisibleOpine}
                        toggleModal={this.toggleModalOpine(false)}
                        listContent={lstContent}
                        addOpinionResources={this.props.addOpinionResources}
                        listCategory={this.props.listCategory || []}
                        syncMeeting={this.syncMeeting}
                      />
                    </TouchableOpacity>
                  )}

                  {/* bb DANG KY PHAT BIEU */}
                  {permission.speak && (
                    <TouchableOpacity
                      disabled={
                        participantStatusName !== PARTICIPANT_STATUS_NAME.JOIN
                        //   ||
                        // (participantAssignedStatus !== 1 &&
                        //   participantAssignedStatus !== 4)
                      }
                      style={[
                        styles.flexRowAlignCenter,
                        styles.bottomButtons,
                        {
                          backgroundColor:
                            participantStatusName ==
                            PARTICIPANT_STATUS_NAME.JOIN
                              ? //   &&
                                // (participantAssignedStatus === 1 ||
                                //   participantAssignedStatus === 4)
                                "#00A06B"
                              : "#aaaaaa"
                        }
                      ]}
                      onPress={this.toggleModalSpeak(true)}
                    >
                      <View style={styles.containerIconBottomButtons}>
                        <IconM
                          name={"chat-processing"}
                          size={28}
                          color={"#fff"}
                        />
                      </View>
                      <ModalSpeak
                        width={width}
                        height={height}
                        isVisible={isVisibleSpeak}
                        toggleModal={this.toggleModalSpeak(false)}
                        listContent={lstContent}
                        addOpinionResources={this.props.addOpinionResources}
                        syncMeeting={this.syncMeeting}
                      />
                    </TouchableOpacity>
                  )}
                  {/* SO TAY CA NHAN */}
                  <TouchableOpacity
                    style={[
                      styles.flexRowAlignCenter,
                      styles.bottomButtons,
                      {
                        backgroundColor: "#fba500",
                        marginRight: 0
                      }
                    ]}
                    onPress={this.toggleModalNote(true)}
                  >
                    <View style={styles.containerIconBottomButtons}>
                      <IconM name={"pencil-outline"} size={28} color={"#fff"} />
                    </View>
                    <ModalNote
                      width={width}
                      height={height}
                      isVisible={isVisibleNote}
                      listNotebookByUserId={this.props.listNotebookByUserId}
                      tableData={this.state.tableDataNote}
                      activeNoteScreen={activeNoteScreen}
                      insertOrUpdateNotebook={this.props.insertOrUpdateNotebook}
                      toggleModal={this.toggleModalNote(false)}
                      toggleModalActiveScreenNote={
                        this.toggleModalActiveScreenNote
                      }
                      contentEdit={content}
                      notebookId={notebookId}
                      toggleReloadListNotebook={this.toggleReloadListNotebook}
                      syncMeeting={this.syncMeeting}
                    />
                  </TouchableOpacity>
                  {/* */}
                  {isMoiDonVi && (
                    <View style={[styles.flexRowAlignCenter, styles.flex1]}>
                      {/* Assign */}
                      <TouchableOpacity
                        style={[
                          styles.flexRowAlignCenter,
                          styles.bottomButtons,
                          { backgroundColor: "#316ec4" }
                        ]}
                        onPress={this.toggleModalAssign(true)}
                      >
                        <View style={{ top: Platform.OS === "ios" ? 0.5 : 0 }}>
                          <IconM
                            name={"account-plus"}
                            size={28}
                            color={"#fff"}
                          />
                        </View>
                        <ModalAssign
                          width={width}
                          height={height}
                          isVisible={isVisibleAssign}
                          toggleModal={this.toggleModalAssign(false)}
                          lstMember={lstMember}
                          newListAssignParticipant={newListAssignParticipant}
                          setAllListAssignParticipant={
                            this.setAllListAssignParticipant
                          }
                          checkValueAll={this.checkValueAll}
                          submitChoose={this.submitChoose}
                          cancelChoose={this.cancelChoose}
                          chooseAssign={this.chooseAssign}
                          cancelAssign={this.cancelAssign}
                          deleteAssign={this.deleteAssign}
                          submitAssign={this.submitAssign}
                        />
                      </TouchableOpacity>

                      {/* Refuse */}
                      <TouchableOpacity
                        style={[
                          styles.flexRowAlignCenter,
                          styles.bottomButtons,
                          { backgroundColor: "#B6292B", marginRight: 0 }
                        ]}
                        onPress={this.toggleModalRefuse(true)}
                      >
                        <View style={{ top: Platform.OS === "ios" ? 1 : 0 }}>
                          <IconM
                            name={"window-close"}
                            size={28}
                            color={"#fff"}
                          />
                        </View>
                        <ModalRefuse
                          width={width}
                          height={height}
                          isVisible={isVisibleRefuse}
                          refuseJoin={this.refuseJoin}
                          toggleModal={this.toggleModalRefuse(false)}
                          syncMeeting={this.syncMeeting}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  {/* <Confirm
                                        width={width}
                                        isVisible={isVisibleConfirmRemoveNote}
                                        titleHeader={'Xác nhận'}
                                        content={'Đồng chí có đồng ý xóa ghi chú này?'}
                                        onCancel={() => this.setState({ isVisibleConfirmRemoveNote: false })}
                                        onOk={this.handleRemoveNote}
                                    /> */}
                  <Notify
                    isVisible={isVisibleNotifyRemoveNote}
                    content={notify}
                    width={width}
                    closeNotify={() =>
                      this.setState({ isVisibleNotifyRemovenote: false })
                    }
                  />
                </View>
              </ScrollView>
            </View>
          ) : (
            <View style={styles.containerBottomButtons}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={[styles.flexRowAlignCenter, styles.flex1]}>
                  {/* PHE DUYET */}
                  {isShowingApproval && (
                    <TouchableOpacity
                      style={[
                        styles.flexRowAlignCenter,
                        styles.bottomButtons,
                        {
                          backgroundColor: "#326EC4"
                        }
                      ]}
                      onPress={this.toggleModalApprove(true)}
                    >
                      <View>
                        {permission.approval && isCheckApproval ? (
                          <PheDuyetIcon width={40} height={40} />
                        ) : (
                          <TrinhPheDuyetIcon width={40} height={40} />
                        )}
                        <ModalApprove
                          width={width}
                          height={height}
                          isVisible={isVisibleApprove}
                          toggleModal={this.toggleModalApprove(false)}
                          toggleIcon={this.toggleShowIconApprove(false)}
                          isApproval={isSetPermission}
                          reloadListMeeting={this.toggleReloadApprove}
                          selectedMeeting={this.state.selectedMeeting}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                  {/* SO TAY CA NHAN */}
                  {isShowingNote && (
                    <TouchableOpacity
                      style={[
                        styles.flexRowAlignCenter,
                        styles.bottomButtons,
                        {
                          backgroundColor: "#fba500",
                          marginRight: isMoiDonVi ? 15 : 0
                        }
                      ]}
                      onPress={this.toggleModalNote(true)}
                    >
                      <View style={styles.containerIconBottomButtons}>
                        <IconM
                          name={"pencil-outline"}
                          size={28}
                          color={"#fff"}
                        />
                      </View>
                      <ModalNote
                        width={width}
                        height={height}
                        isVisible={isVisibleNote}
                        listNotebookByUserId={this.props.listNotebookByUserId}
                        tableData={this.state.tableDataNote}
                        activeNoteScreen={activeNoteScreen}
                        insertOrUpdateNotebook={
                          this.props.insertOrUpdateNotebook
                        }
                        toggleModal={this.toggleModalNote(false)}
                        toggleModalActiveScreenNote={
                          this.toggleModalActiveScreenNote
                        }
                        contentEdit={content}
                        notebookId={notebookId}
                        toggleReloadListNotebook={this.toggleReloadListNotebook}
                        syncMeeting={this.syncMeeting}
                      />
                    </TouchableOpacity>
                  )}
                  {/* <Confirm
                                        width={width}
                                        isVisible={isVisibleConfirmRemoveNote}
                                        titleHeader={'Xác nhận'}
                                        content={'Đồng chí có đồng ý xóa ghi chú này?'}
                                        onCancel={() => this.setState({ isVisibleConfirmRemoveNote: false })}
                                        onOk={this.handleRemoveNote}
                                    /> */}
                  <Notify
                    isVisible={isVisibleNotifyRemoveNote}
                    content={notify}
                    width={width}
                    closeNotify={() =>
                      this.setState({ isVisibleNotifyRemovenote: false })
                    }
                  />
                </View>
              </ScrollView>
            </View>
          )}

          <Modal
            animationInTiming={400}
            animationOutTiming={500}
            backdropTransitionInTiming={500}
            backdropTransitionOutTiming={500}
            isVisible={isVisibleMap}
            backdropColor={"rgb(156,156,156)"}
            hideModalContentWhileAnimating
            style={{ width, marginLeft: 0, marginBottom: 0 }}
          >
            <View
              style={{
                width: width,
                height: height * 0.9,
                backgroundColor: "#fff"
              }}
            >
              <CustomHeader
                title={"Sơ đồ phòng họp"}
                haveClose
                haveEmail={false}
                onClose={this.toggleModalMap(false)}
                customHeight={45}
              />
              <View
                style={{
                  height: width,
                  borderBottomColor: "#ccc",
                  borderBottomWidth: 1
                }}
              >
                {meetingMapLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size={"large"} color={"#316ec4"} />
                  </View>
                ) : (
                  <View style={[styles.flex1, { zIndex: -1 }]}>
                    {meetingMap.length > 0 ? (
                      <View
                        style={{
                          flex: 1,
                          overflow: "hidden"
                        }}
                      >
                        <ReactNativeZoomableView
                          maxZoom={1.5}
                          minZoom={0.5}
                          zoomStep={0.5}
                          pinchToZoomInSensitivity={10}
                          pinchToZoomOutSensitivity={3}
                          bindToBorders={false}
                          captureEvent={true}
                          style={{
                            padding: 10
                          }}
                        >
                          <Svg width={"100%"} height={"100%"}>
                            {meetingMap}
                          </Svg>
                        </ReactNativeZoomableView>
                      </View>
                    ) : (
                      meetingMap
                    )}
                  </View>
                )}
                <View
                  style={{ position: "absolute", left: 10, top: 10 }}
                  key={"labelArr"}
                >
                  {labelArr}
                </View>
              </View>
              <View style={styles.flex1}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles.marginVertical7}>
                    <Collapse
                      onToggle={isCollapsed =>
                        this.handleChangeButton(isCollapsed, 1)
                      }
                      isCollapsed={
                        listAssignStatement.collapseButton ===
                        "minus-circle-outline"
                      }
                    >
                      <CollapseHeader>
                        <View style={styles.headerCollapse}>
                          <View style={styles.flexRowAlignCenter}>
                            <View style={styles.width20}>
                              <IconM
                                name={listAssignStatement.collapseButton}
                                size={17}
                                color={"#999"}
                              />
                            </View>

                            <Text style={styles.headerCollapseText}>
                              {"Danh sách đăng ký phát biểu"}
                            </Text>
                          </View>
                        </View>
                      </CollapseHeader>

                      <CollapseBody>
                        <View style={{ paddingTop: 15 }}>
                          <Table
                            borderStyle={{
                              borderWidth: 1,
                              borderColor: "#707070"
                            }}
                          >
                            <Row
                              flexArr={[2, 4, 6, 4, 2.5, 1.5]}
                              data={
                                isChairman || permission.removeStatement
                                  ? listAssignStatement.headerChairman
                                  : listAssignStatement.header
                              }
                              style={styles.headerTable}
                              textStyle={styles.headerTableText}
                            />
                            <Rows
                              flexArr={[2, 4, 6, 4, 2.5, 1.5]}
                              data={listAssignStatement.body}
                              style={styles.contentTable}
                            />
                          </Table>
                        </View>
                      </CollapseBody>
                    </Collapse>
                  </View>

                  <View style={styles.marginVertical7}>
                    <Collapse
                      onToggle={isCollapsed =>
                        this.handleChangeButton(isCollapsed, 2)
                      }
                      isCollapsed={
                        listFinishStatement.collapseButton ===
                        "minus-circle-outline"
                      }
                    >
                      <CollapseHeader>
                        <View style={styles.headerCollapse}>
                          <View style={styles.flexRowAlignCenter}>
                            <View style={styles.width20}>
                              <IconM
                                name={listFinishStatement.collapseButton}
                                size={17}
                                color={"#999"}
                              />
                            </View>

                            <Text style={styles.headerCollapseText}>
                              {"Danh sách phát biểu"}
                            </Text>
                          </View>
                        </View>
                      </CollapseHeader>

                      <CollapseBody>
                        <View style={{ paddingTop: 15 }}>
                          <Table
                            borderStyle={{
                              borderWidth: 1,
                              borderColor: "#707070"
                            }}
                          >
                            <Row
                              flexArr={[2, 4, 10, 3]}
                              data={listFinishStatement.header}
                              style={styles.headerTable}
                              textStyle={styles.headerTableText}
                            />
                            <Rows
                              flexArr={[2, 4, 10, 3]}
                              data={listFinishStatement.body}
                              style={styles.contentTable}
                            />
                          </Table>
                        </View>
                      </CollapseBody>
                    </Collapse>
                  </View>
                </ScrollView>
              </View>

              <Modal
                animationInTiming={400}
                animationOutTiming={500}
                backdropTransitionInTiming={500}
                backdropTransitionOutTiming={500}
                isVisible={isVisibleMap && isVisibleInfor}
                onBackdropPress={this.toggleModalInforChair(false, "")}
                backdropColor={"rgb(156,156,156)"}
                hideModalContentWhileAnimating
              >
                <View style={styles.containerModalInfo}>
                  <View style={styles.containerHeaderInfo}>
                    <Text style={styles.headerJoinText}>{LABELS.LAB0062}</Text>
                  </View>

                  <View>
                    {labelInfor && (
                      <View style={styles.containerLabelLocation}>
                        <Text style={styles.titleInfor}>
                          {"Thông tin vị trí:"}
                        </Text>
                        {labelInfor}
                      </View>
                    )}
                    {opinionsInfor.length !== 0 && (
                      <View style={styles.containerDetailLocation}>
                        {titleOpinion}
                        <ScrollView>{opinionsInfor}</ScrollView>
                      </View>
                    )}
                    <View
                      style={[styles.flexRowAlignCenter, styles.buttonOKInfor]}
                    >
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#026ABD",
                          borderRadius: 4,
                          width: width * 0.38
                        }}
                        onPress={this.toggleModalInforChair(false, "")}
                      >
                        <Text
                          style={[
                            styles.textAlignCenterWhite,
                            { paddingVertical: 8 }
                          ]}
                        >
                          {"OK"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>

              <Confirm
                width={width}
                isVisible={isVisibleConfirmRemoveStatement}
                titleHeader={"Xác nhận"}
                content={"Đồng chí có đồng ý bác bỏ phát biểu này?"}
                onCancel={() =>
                  this.setState({ isVisibleConfirmRemoveStatement: false })
                }
                onOk={this.handleRemoveStatement}
              />
            </View>
          </Modal>

          <Loading loading={firstLoading} />
        </Drawer>

        <Notify
          isVisible={isVisibleNotify}
          content={notify}
          width={width}
          closeNotify={() => this.setState({ isVisibleNotify: false })}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        error: state.ErrorReducer.error,
        listMeeting: state.MeetingReducer.listMeeting,
        listGopY: state.MeetingReducer.listGopY,
        totalMeeting: state.MeetingReducer.totalMeeting,
        chosenMeeting: state.MeetingReducer.chosenMeeting,
        selectedMeeting: state.MeetingReducer.selectedMeeting,
        listMems: state.MeetingReducer.listMems,
        listOpine: state.MeetingReducer.listOpine,
        listGuests: state.MeetingReducer.listGuests,
        listDepartmentParticipants: state.MeetingReducer.listDepartmentParticipants,
        listDepartmentAssignedParticipants:
        state.MeetingReducer.listDepartmentAssignedParticipants,
        needReload: state.MeetingReducer.needReload,
        listAssignParticipant: state.MeetingReducer.listAssignParticipant,
        resultDeny: state.MeetingReducer.resultDeny,
        conferenceParticipant: state.MeetingReducer.conferenceParticipant,
        insertAssignResult: state.MeetingReducer.insertAssignResult,
        updateAssignResult: state.MeetingReducer.updateAssignResult,
        listElementMeetingMap: state.MeetingReducer.listElementMeetingMap,
        listElementStatusMeetingMap:
        state.MeetingReducer.listElementStatusMeetingMap,
        listAssignStatementMeetingMap:
        state.MeetingReducer.listAssignStatementMeetingMap,
        listFinishStatementMeetingMap:
        state.MeetingReducer.listFinishStatementMeetingMap,
        conferenceFile: state.MeetingReducer.conferenceFile,
        participantMeeting: state.MeetingReducer.participantMeeting,
        listConferenceOpinion: state.MeetingReducer.listConferenceOpinion,
        listCategory: state.MeetingReducer.listCategory,
        userInfo: state.AuthenReducer.userInfo,
        wsConferenceId: state.WSReducer.wsConferenceId,
        listNotebookByUserId: state.MeetingReducer.listNotebookByUserId,
        vOfficeFiles: state.MeetingReducer.vOfficeFiles,
        conclusion: state.MeetingReducer.conclusion,
        sessionId: state.AuthenReducer.sessionId,
    };
};

export default connect(mapStateToProps, {
    getOpinionResources,
    chooseMeeting,
    getListMeeting,
    getListGopY,
    getMeetingById,
    getListMemById,
    getListGuestById,
    updateParticipant,
    updateConferenceParticipantAndDelegation,
    insertOrUpdateNotebook,
    addOpinionResources,
    getListDepartmentParticipants,
    getDepartmentAssignedParticipants,
    getListAssignParticipant,
    insertConferenceParticipant,
    updateConferenceParticipant,
    deleteConferenceParticipant,
    deleteNotebook,
    denyDepartmentConferenceParticipant,
    reloadMeetingScreen,
    getConferenceParticipant,
    approveAbsentMember,
    getListElementMeetingMap,
    getListElementStatusMeetingMap,
    getListAssignStatementMeetingMap,
    removeStatement,
    getListFinishStatementMeetingMap,
    getConferenceFile,
    getParticipantMeeting,
    getListConferenceOpinion,
    getListCategory,
    updateConferenceWS,
    getListNotebookByUserId,
    deleteGopY,
    editGopY,
    createGopY,
    getVOfficeFiles,
    getAttachConclusionFile
})(MeetingSchedule);
