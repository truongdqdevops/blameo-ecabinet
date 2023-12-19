import React, { Component } from "react";
import { connect } from "react-redux";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
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
import { Row, Rows, Table } from "react-native-table-component";
import IconM from "react-native-vector-icons/MaterialCommunityIcons";
import IconB from "react-native-vector-icons/FontAwesome5";
import IconC from "react-native-vector-icons/AntDesign";
import Drawer from "react-native-drawer";
import Modal from "react-native-modal";
import CheckBox from "@react-native-community/checkbox";
import Menu, { MenuDivider, MenuItem } from "react-native-material-menu";
import {
  Collapse,
  CollapseBody,
  CollapseHeader
} from "accordion-collapse-react-native";
import Highlighter from "react-native-highlight-words";
import PopoverTooltip from "react-native-popover-tooltip";
import {
  approveORDeFB,
  getAttachFile,
  getFeedbackById,
  getFeedbackResult,
  getListFeedback,
  getSummaryById,
  recallDuyetFeedBack,
  recallTrinhFeedback,
  saveFeedbackAnswer,
  SelectedFeedback,
  sendApproveFeedback,
  sendFileToVoOffice
} from "../../redux/actions/feedback.action";
import { getDashboard } from "../../redux/actions/home.action";
import {
  DEFAULT,
  PERMISSIONS,
  STATUS,
  THONG_BAO,
  TYPE_ACTION,
  TYPE_STATUS,
  TYPE_STATUS_CV,
  VOTE_TYPE
} from "./constant";
import ShowFiles from "../document/show-files";
import MHeader from "../../assets/components/header";
import ModalSendFeedback from "./feedback-modal/send-feedback";
import ModalAttachFile from "./feedback-modal/attach-file";
import Notify from "../../assets/components/notify";
import Confirm from "../../assets/components/confirm";
import Loading from "../../assets/components/loading";
import styles from "./styles/feedback-style";
import { checkPermission } from "../../assets/utils/utils";
import { hostURL } from "../../services/service";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";

require("moment/locale/vi");
const srcImg = require("../../assets/images/no-document.png");

class Feedbacks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      feedbackReq: {
        keyword: "",
        pageSize: DEFAULT.PAGE_SIZE,
        activePage: DEFAULT.ACTIVE_PAGE
      },
      listData: [],
      tableData: {
        tableHead: ["Người tạo", "Hành động", "Ngày", "Phiếu trả lời"],
        tableBody: [],
        button: "minus-circle",
        button2: "chevron-up"
      },
      tableData2: [],
      tableData3: [],
      isFbReplyVisible: false,
      isVisibleNotifyApprove: false,
      notifyApprove: "",
      isSendApprove: false,
      isApprove: false,
      isReject: false,
      isRecall: false,
      sendApproveValue: "",
      approveValue1: "",
      approveValue2: "",
      rejectValue1: "",
      rejectValue2: "",
      checked: 0,
      isDrawerOpen: false,
      isVisibleSendFb: false,
      isVisibleAttach1: false,
      isVisibleAttach2: false,
      isVisibleFileAttach: false,
      press: 0,
      extraData: {
        loading: false,
        isRefreshing: false
      },
      attachFileId: 0,
      historyAttachFileId: "",
      lengthAttachFile: 0,
      keyword: "",
      listFbResult: {},
      filterList: {
        inDue: {
          status: "",
          list: []
        },
        outDue: {
          status: "",
          list: []
        },
        answered: {
          status: "",
          list: []
        },
        chuagui: {
          status: "",
          list: []
        },
        dagui: {
          status: "",
          list: []
        },
        datrinhduyet: {
          status: "",
          list: []
        },
        daduyet: {
          status: "",
          list: []
        },
        tuchoiduyet: {
          status: "",
          list: []
        },
        chopheduyet: {
          status: "",
          list: []
        }
      },
      filterType: "",
      subjects: [],
      items: [],
      scrLoading: true,
      isCVVP: false,
      permission: {
        view: checkPermission(PERMISSIONS.XEM),
        answer: checkPermission(PERMISSIONS.TRA_LOI_PLYK),
        forward: checkPermission(PERMISSIONS.CHUYEN_PHIEU_CHO_VT),
        assist: checkPermission(PERMISSIONS.GUI_CAP_TREN),
        viewResult: checkPermission(PERMISSIONS.XEM_KQ_PLYK),
        createYC: checkPermission(PERMISSIONS.TAO_PLYK)
      }
    };
  }

  componentDidMount = async () => {
    const { permission = {} } = this.state;
    if (permission.view) {
      await this.loadScreen(-1);
      this.props.navigation.addListener("willFocus", async () => {
        if (this.props.navigation.isFocused()) {
          await this.willFocus();
        }
      });
    }
  };

  willFocus = () => {
    this.setState(
      {
        scrLoading: true
      },
      () => {
        const {
          state: { params = {} }
        } = this.props.navigation;
        const { fileId = -1 } = params;
        this.loadScreen(fileId);
      }
    );
  };

  loadScreen = async selectedFileId => {
    const { feedbackReq = {} } = this.state;
    const { level = "" } = this?.props?.userInfo?.appUser;
    const { selectedFeedback: currentFeedback } = this.props;
    const { fileId: currentFileId } = currentFeedback;

    if (currentFileId === selectedFileId) {
      this.setState({
        scrLoading: false
      });
      return;
    }

    this.setState(
      {
        isTVCP: level === "TVCP",
        isTK: level === "TK_TVCP",
        isCVVP: level === "CVVP"
      },
      async () => {
        await this.props.getListFeedback(feedbackReq);
        if (this.props.totalFeedback === 0) {
          this.setState({
            listData: [],
            selectedFeedback: {},
            scrLoading: false
          });
          return;
        }

        const { listFeedback = [] } = this.props;
        let fileId = -1;
        if (selectedFileId !== -1) {
          fileId = selectedFileId;
        } else if (listFeedback.length > 0) {
          const { fileId: firstFileId } = listFeedback[0];
          fileId = firstFileId;
        }

        if (fileId === -1) {
          this.setState({
            scrLoading: false
          });
          return;
        }

        const userId = this?.props?.userInfo?.appUser?.id;
        const { permission = {}, isTK } = this.state;
        await Promise.all([
          this.props.getFeedbackResult({
            fileId,
            userId,
            type: (permission.assist && this.isHasPermissionAssist()) ? "ASSIST" : "ANSWER"
          }),
          this.props.getFeedbackById({ fileId }),
          this.props.getSummaryById({ fileId }),
          this.props.getAttachFile({
            objectId: fileId,
            objectType: "FILE",
            type: "FILE_DINH_KEM"
          }),
          this.props.getAttachFile({
            objectId: fileId,
            objectType: "FILE",
            type: "FILE_NOI_DUNG"
          }),
          this.props.getAttachFile({
            objectId: fileId,
            objectType: "FILE_RESULT",
            type: "FILE_GUI_CAP_TREN",
            targetType: "GET_HELP"
          }),
          this.filterList(
            // level === 'CVVP' ? this.props.listFeedback : this.props.summaryData,
            this.props.listFeedback
          )
        ]);

        const {
          selectedFeedback = {},
          feedbackResult = {},
          attachFile = []
        } = this.props;
        const firstFeedback = listFeedback[0];
        const { status, parentStatus, parentResultId } = firstFeedback;
        this.props.SelectedFeedback(selectedFeedback, -1);
        this.setState(
          {
            listData: listFeedback,
            listFbResult: feedbackResult,
            selectedFeedback: selectedFeedback,
            isVisibleSendButton:
              permission.forward && status < 3 && parentStatus !== 4,
            isVisibleAnsButton:
              !(status === 10 || status === 11 || status === 12) &&
              parentStatus !== 4 &&
              permission.answer,
            TKCanAns: isTK && (!parentResultId || parentResultId < 1),
            selectedSubject: selectedFeedback?.subjects[0],
            lengthAttachFile: attachFile.length,
            scrLoading: false
          },
          () => {
            this.setSubjects();
            this.renderDataTable();
            this.renderDataTable2();
            this.renderDataTable3();
          }
        );
      }
    );
  };

  isHasPermissionAssist() {
    const parentResultId = this.props.listFeedback[0]?.parentResultId
    return parentResultId && parentResultId > 0;
  }

  setSubjects = () => {
    const { subjects = [] } = this.state.selectedFeedback;
    const { results = [] } = this.state.listFbResult;
    let newSubjects = [];
    if (results.length === 0) {
      newSubjects = subjects;
    } else {
      subjects.forEach(element => {
        const { items = [], subjectType = "", subjectId } = element;
        if (subjectType === "YESNO") {
          const ind = results.findIndex(
            result => result.subjectId === subjectId
          );
          const { subjectItemId } = ind > -1 ? results[ind] : {};
          const select = ind > -1 && subjectItemId > -1 ? subjectItemId : -1;
          const newSubject = {
            ...element,
            selectYes: select === 1,
            selectNo: select === 0,
            custom: results[ind].content || ""
          };
          newSubjects.push(newSubject);
        } else {
          const newItems = items.map(item =>
            this.checkContain(results, item) > -1
              ? { ...item, selected: true }
              : { ...item, selected: false }
          );
          const ind = results.findIndex(
            result => result.subjectId === subjectId
          );
          newSubjects.push({
            ...element,
            items: newItems,
            custom: results[ind].content || ""
          });
        }
      });
    }

    this.setState(
      {
        subjects: newSubjects
      },
      () => {
        this.getSubjectItemId();
      }
    );
  };

  checkContain = (arr, item) => {
    return arr.findIndex(
      element => element.subjectItemId === item.subjectItemId
    );
  };

  search = async () => {
    this.handleLoading(true);
    this.setState(
      {
        feedbackReq: {
          keyword: this.state.keyword,
          pageSize: 1000,
          activePage: 0
        }
      },
      async () => {
        await this.props.getListFeedback(this.state.feedbackReq);
        this.setState({
          listData: this.props.listFeedback,
          filterType: ""
        });
        this.handleLoading(false);
      }
    );
  };

  filterList = inputData => {
    const listAnswered = [];
    const listInDue = [];
    const listOutDue = [];

    inputData.forEach(element => {
      const { answered, inDue, outDue } = element;

      if (answered === 1) {
        listAnswered.push(element);
      }
      if (inDue === 1) {
        listInDue.push(element);
      }
      if (outDue === 1) {
        listOutDue.push(element);
      }
    });
    const chuagui = inputData.filter(e => e.status === 1);
    const dagui = inputData.filter(e => e.status === 2);
    const datrinhduyet = inputData.filter(e => e.status === 10);
    const daduyet = inputData.filter(e => e.status === 11);

    const tuchoiduyet = inputData.filter(e => e.status === 12);
    const chopheduyet = inputData.filter(e => e.status === 12);
    this.setState({
      filterList: {
        chuagui: {
          list: chuagui,
          status: `${TYPE_STATUS_CV.CHUAGUI} (${chuagui.length})`
        },
        dagui: {
          list: dagui,
          status: `${TYPE_STATUS_CV.DAGUI} (${dagui.length})`
        },
        datrinhduyet: {
          list: datrinhduyet,
          status: `${TYPE_STATUS_CV.DATRINHDUYET} (${datrinhduyet.length})`
        },
        // daduyet: {
        //   list: daduyet,
        //   status: `${TYPE_STATUS_CV.DA_DUYET} (${daduyet.length})`
        // },
        // tuchoiduyet: {
        //   list: tuchoiduyet,
        //   status: `${TYPE_STATUS_CV.TU_CHOI_DUYET} (${tuchoiduyet.length})`
        // },
        // chopheduyet: {
        //   list: chopheduyet,
        //   status: `${TYPE_STATUS.CHO_PHE_DUYET} (${chopheduyet.length})`
        // },
        inDue: {
          list: listInDue,
          status: `${TYPE_STATUS.CON_HAN} (${listInDue.length})`
        },
        outDue: {
          list: listOutDue,
          status: `${TYPE_STATUS.QUA_HAN} (${listOutDue.length})`
        },
        answered: {
          list: listAnswered,
          status: `${TYPE_STATUS.DA_TRA_LOI} (${listAnswered.length})`
        }
      }
    });
  };

  toggleModal() {
    this.setState({
      isFbReplyVisible: !this.state.isFbReplyVisible
    });
  }

  renderButtons = subjects => {
    const buttons = [];
    const a = subjects.length;
    for (let i = 0; i < a; i += 1) {
      buttons.push(
        <View key={i.toString()}>
          <TouchableOpacity
            style={{
              width: 30,
              height: 30,
              backgroundColor: this.state.press === i ? "#026ABD" : "white",
              borderRadius: 5,
              borderColor: "#446697",
              borderWidth: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={() => {
              this.setState({ press: i, selectedSubject: subjects[i] }, () =>
                this.getSubjectItemId()
              );
            }}
          >
            <Text style={{ color: "black", fontSize: 16 }}>{i + 1}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    const flexBoxButtons = (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          width: widthPercent[40]
        }}
      >
        {buttons}
      </View>
    );
    return flexBoxButtons;
  };

  renderBottomButtons = i => {
    const buttons = [];
    let key = 0;
    const { isTVCP, TKCanAns } = this.state;
    const { selectedFeedback = {} } = this.props;
    const a =
      Object.keys(selectedFeedback).length !== 0
        ? selectedFeedback.subjects.length
        : 0;

    if (i !== 0) {
      buttons.push(
        <View style={{ marginRight: 10 }} key={key.toString()}>
          <TouchableOpacity
            style={[styles.button, { width: widthPercent[20] }]}
            onPress={() =>
              this.setState(
                {
                  press: i - 1,
                  selectedSubject: selectedFeedback.subjects[i - 1]
                },
                () => this.getSubjectItemId()
              )
            }
          >
            <IconM name="arrow-left" size={20} color="white" />
            <Text
              style={{
                color: "white",
                fontWeight: "bold"
              }}
            >
              Quay lại
            </Text>
          </TouchableOpacity>
        </View>
      );
      key += 1;
    }

    if (i !== a - 1) {
      buttons.push(
        <View style={{ marginRight: 10 }} key={key.toString()}>
          <TouchableOpacity
            style={[styles.button, { width: widthPercent[20] }]}
            onPress={() =>
              this.setState(
                {
                  press: i + 1,
                  selectedSubject: selectedFeedback.subjects[i + 1]
                },
                () => this.getSubjectItemId()
              )
            }
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold"
              }}
            >
              Tiếp theo
            </Text>
            <IconM name="arrow-right" size={20} color="white" />
          </TouchableOpacity>
        </View>
      );
      key += 1;
    }

    if (i === a - 1) {
      buttons.push(
        <View style={{ flexDirection: "row" }} key={`ghilai${i}`}>
          <View style={{ flexDirection: "row", marginRight: 10 }}>
            <TouchableOpacity
              style={[styles.button, { width: widthPercent[20] }]}
              // onPress={() => this.setState({ isVisibleConfirm: true, contentConfirm: 'Xác nhận ghi lại phiếu trả lời?', typeSubmit: 'ghilai' })}
              onPress={() =>
                this.showConfirmAlert(
                  "Xác nhận ghi lại phiếu trả lời?",
                  "ghilai"
                )
              }
            >
              <IconB name="save" size={20} color="white" />
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold"
                }}
              >
                Ghi lại
              </Text>
            </TouchableOpacity>
          </View>

          {isTVCP || TKCanAns ? (
            <View style={{ flexDirection: "row" }} key={`kygui${i}`}>
              <TouchableOpacity
                style={[styles.button, { width: widthPercent[30] }]}
                onPress={() =>
                  this.showConfirmAlert(
                    "Xác nhận trả lời Phiếu lấy ý kiến?",
                    "kygui"
                  )
                }
              >
                <IconB name="edit" size={20} color="white" />
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold"
                  }}
                >
                  Gửi phiếu
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flexDirection: "row" }} key={`guicaptren${i}`}>
              <TouchableOpacity
                style={[styles.button, { width: widthPercent[30] }]}
                onPress={() =>
                  this.showConfirmAlert(
                    "Xác nhận trả lời Phiếu lấy ý kiến?",
                    "guicaptren"
                  )
                }
                // onPress={() => this.setState({ isVisibleConfirm: true, contentConfirm: 'Xác nhận trả lời Phiếu lấy ý kiến?', typeSubmit: 'guicaptren' })}
              >
                <IconB name="paper-plane" size={20} color="white" />
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold"
                  }}
                >
                  Gửi phiếu
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
      key += 1;
    }
    const flexButtons = <View style={{ flexDirection: "row" }}>{buttons}</View>;
    return flexButtons;
  };

  showConfirmAlert = (message, typeSubmit) => {
    Alert.alert("Thông báo", `${message}`, [
      {
        text: "Huỷ bỏ",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      {
        text: "Đồng ý",
        onPress: () => this.sendFeedbackResult(typeSubmit)
      }
    ]);
  };

  showAlert = message => {
    Alert.alert("Thông báo", `${message}`, [
      {
        text: "Thoát"
      }
    ]);
  };
  sendFeedbackResult = async typeSubmit => {
    const {
      subjects = [],
      selectedFeedback = {},
      permission = {},
      listData = [],
      feedbackReq = {}
    } = this.state;
    const { fileId, resultId } = selectedFeedback;
    const userId = this?.props?.userInfo?.appUser?.id;
    let count = -1;
    for (let index = 0; index < subjects.length; index++) {
      const element = { ...subjects[index] };
      if (element.subjectType === "YESNO") {
        if (
          element.selectYes === false &&
          element.selectNo === false &&
          (element.custom.trim() === "" || !element.custom)
        ) {
          count = index;
          break;
        }
      }
      if (element.subjectType === "OPTION") {
        if (
          element.items.findIndex(e1 => e1.selected === true) === -1 &&
          (element.custom.trim() === "" || !element.custom)
        ) {
          count = index;
          break;
        }
      }
    }

    if (count !== -1) {
      this.setState({
        isVisibleErrAnswer: true,
        mess: `Đồng chí chưa cho ý kiến vấn đề số ${count + 1}`
      });
    } else {
      let status = -1;
      let messSuccess = "";
      if (typeSubmit === "ghilai") {
        status = 2;
        messSuccess = "Ghi lại thành công";
      }
      if (typeSubmit === "guicaptren") {
        status = 3;
        messSuccess = "Gửi phiếu lấy ý kiến lên cấp trên thành công";
      }
      if (typeSubmit === "kygui") {
        status = 4;
        messSuccess = "Ký phiếu lấy ý kiến thành công";
      }

      const fbBodyReq = {
        fileId,
        userId,
        status,
        subjects
      };

      this.setState(
        {
          isFbReplyVisible: false,
          press: 0
        },
        async () => {
          const returnVlue = await this.props.saveFeedbackAnswer(fbBodyReq);
          if (returnVlue) {
            this.setState(
              {
                // mess: messSuccess,
                scrLoading: true
              },
              async () => {
                await Promise.all([
                  this.props.getFeedbackResult({
                    fileId,
                    userId,
                    type: (permission.assist && this.isHasPermissionAssist()) ? "ASSIST" : "ANSWER"
                  }),
                  this.props.getFeedbackById({ fileId }),
                  this.props.getListFeedback({
                    ...feedbackReq,
                    activePage: 0,
                    pageSize: listData.length
                  })
                ]);

                const {
                  selectedFeedback: selectedFeedbackProps = {},
                  listFeedback = [],
                  feedbackResult = {}
                } = this.props;
                const {
                  history = [],
                  subjects: subjectsSelectedFBProps = []
                } = selectedFeedbackProps;
                const ind = listFeedback.findIndex(
                  element =>
                    element.fileId === fileId && element.resultId === resultId
                );

                const selectedFeedbackFromList =
                  ind > -1 ? { ...listFeedback[ind] } : {};
                const { parentStatus, status: statusD } =
                  ind > -1 ? selectedFeedbackFromList : selectedFeedback;

                this.setState(
                  {
                    listData: listFeedback,
                    listFbResult: feedbackResult,
                    selectedSubject: subjectsSelectedFBProps[0],
                    selectedFeedback: {
                      ...selectedFeedback,
                      ...selectedFeedbackFromList,
                      subjects: subjectsSelectedFBProps,
                      history
                    },

                    isVisibleSendButton:
                      permission.forward && statusD < 3 && parentStatus !== 4,
                    isVisibleAnsButton:
                      !(statusD === 10 || statusD === 11 || statusD === 12) &&
                      parentStatus !== 4 &&
                      permission.answer
                  },
                  () => {
                    this.setSubjects();
                    this.renderDataTable();
                    setTimeout(() => {
                      this.setState({
                        isVisibleNotifyApprove: true,
                        notifyApprove: "Xử lý thành công"
                      });
                    }, 1000);
                  }
                );
              }
            );
          } else {
            this.showAlert("Đã có lỗi xảy ra, đồng chí vui lòng thử lại sau!");
            // this.setState({
            //     isVisibleValNotify: true,
            //     mess: 'Đã có lỗi xảy ra, đồng chí vui lòng thử lại sau!',
            // });
          }
        }
      );
    }
  };
  sendApproveModalFeedback = async () => {
    const {
      sendApproveValue,
      selectedFeedback = {},
      permission = {},
      listData = [],
      feedbackReq = {}
    } = this.state;
    const { fileId, resultId, status } = selectedFeedback;
    const userId = this?.props?.userInfo?.appUser?.id;
    const fbBodyReq = {
      fileId,
      note: sendApproveValue,
      status
    };
    if (sendApproveValue.length == 0) {
      this.setState({
        isVisibleErrAnswer: true,
        mess: `Đồng chí chưa nhập ghi chú, vui lòng thử lại sau.`
      });
    } else {
      this.setState(
        {
          isSendApprove: false,
          sendApproveValue: ""
        },
        async () => {
          const returnVlue = await this.props.sendApproveFeedback(fbBodyReq);
          if (returnVlue) {
            this.setState(
              {
                scrLoading: true
              },
              async () => {
                await Promise.all([
                  this.props.getFeedbackResult({
                    fileId,
                    userId,
                    type: (permission.assist && this.isHasPermissionAssist()) ? "ASSIST" : "ANSWER"
                  }),
                  this.props.getFeedbackById({ fileId }),
                  this.props.getListFeedback({
                    ...feedbackReq,
                    activePage: 0,
                    pageSize: listData.length
                  })
                ]);

                const {
                  selectedFeedback: selectedFeedbackProps = {},
                  listFeedback = [],
                  feedbackResult = {}
                } = this.props;
                const {
                  history = [],
                  subjects: subjectsSelectedFBProps = []
                } = selectedFeedbackProps;
                const ind = listFeedback.findIndex(
                  element =>
                    element.fileId === fileId && element.resultId === resultId
                );

                const selectedFeedbackFromList =
                  ind > -1 ? { ...listFeedback[ind] } : {};
                const { parentStatus, status: statusD } =
                  ind > -1 ? selectedFeedbackFromList : selectedFeedback;

                this.setState(
                  {
                    listData: listFeedback,
                    listFbResult: feedbackResult,
                    selectedSubject: subjectsSelectedFBProps[0],
                    selectedFeedback: {
                      ...selectedFeedback,
                      ...selectedFeedbackFromList,
                      subjects: subjectsSelectedFBProps,
                      history
                    },

                    isVisibleSendButton:
                      permission.forward && statusD < 3 && parentStatus !== 4,
                    isVisibleAnsButton:
                      !(statusD === 10 || statusD === 11 || statusD === 12) &&
                      parentStatus !== 4 &&
                      permission.answer
                  },
                  () => {
                    setTimeout(() => {
                      this.setState({
                        isVisibleNotifyApprove: true,
                        notifyApprove: "Đồng chí đã trình duyệt thành công"
                      });
                    }, 1000);

                    this.setSubjects();
                    this.renderDataTable();
                  }
                );
              }
            );
          } else {
            this.showAlert("Đã có lỗi xảy ra, đồng chí vui lòng thử lại sau!");
          }
        }
      );
    }
  };
  approveOrDeclineModalFeedback = async isApproveData => {
    const {
      approveValue2,
      rejectValue2,
      selectedFeedback = {},
      permission = {},
      listData = [],
      isVisibleErrAnswer,
      feedbackReq = {}
    } = this.state;
    const { fileId, resultId, status } = selectedFeedback;
    const userId = this?.props?.userInfo?.appUser?.id;
    const fbBodyReq = {
      fileId,
      noteAppDeny: isApproveData ? approveValue2 : rejectValue2,
      isApprove: isApproveData ? 1 : 0
    };

    if (
      (isApproveData && approveValue2.length == 0) ||
      (!isApproveData && rejectValue2.length == 0)
    ) {
      this.setState({
        isVisibleErrAnswer: true,
        mess: isApproveData
          ? `Đồng chí chưa cho ý kiến phê duyệt`
          : "Đồng chí chưa nhập lý do từ chối"
      });
    } else {
      this.setState(
        {
          isApprove: false,
          isReject: false,
          approveValue2: "",
          rejectValue2: ""
        },
        async () => {
          const returnVlue = await this.props.approveORDeFB(fbBodyReq);
          if (returnVlue) {
            this.setState(
              {
                scrLoading: true
              },
              async () => {
                await Promise.all([
                  this.props.getFeedbackResult({
                    fileId,
                    userId,
                    type: (permission.assist && this.isHasPermissionAssist()) ? "ASSIST" : "ANSWER"
                  }),
                  this.props.getFeedbackById({ fileId }),
                  this.props.getListFeedback({
                    ...feedbackReq,
                    activePage: 0,
                    pageSize: listData.length
                  })
                ]);

                const {
                  selectedFeedback: selectedFeedbackProps = {},
                  listFeedback = [],
                  feedbackResult = {}
                } = this.props;
                const {
                  history = [],
                  subjects: subjectsSelectedFBProps = []
                } = selectedFeedbackProps;
                const ind = listFeedback.findIndex(
                  element =>
                    element.fileId === fileId && element.resultId === resultId
                );

                const selectedFeedbackFromList =
                  ind > -1 ? { ...listFeedback[ind] } : {};
                const { parentStatus, status: statusD } =
                  ind > -1 ? selectedFeedbackFromList : selectedFeedback;

                this.setState(
                  {
                    listData: listFeedback,
                    listFbResult: feedbackResult,
                    selectedSubject: subjectsSelectedFBProps[0],
                    selectedFeedback: {
                      ...selectedFeedback,
                      ...selectedFeedbackFromList,
                      subjects: subjectsSelectedFBProps,
                      history
                    },
                    isVisibleSendButton:
                      permission.forward && statusD < 3 && parentStatus !== 4,
                    isVisibleAnsButton:
                      !(statusD === 10 || statusD === 11 || statusD === 12) &&
                      parentStatus !== 4 &&
                      permission.answer
                  },
                  () => {
                    this.setSubjects();
                    this.renderDataTable();
                    setTimeout(() => {
                      this.setState({
                        isVisibleNotifyApprove: true,
                        notifyApprove: isApproveData
                          ? "Đồng chí đã phê duyệt thành công"
                          : "Đồng chí đã từ chối thành công"
                      });
                    }, 1000);
                  }
                );
              }
            );
          } else {
            this.showAlert("Đã có lỗi xảy ra, đồng chí vui lòng thử lại sau!");
          }
        }
      );
    }
  };
  // type : trinh, duyet
  sendRecallModalFeedback = async type => {
    const {
      selectedFeedback = {},
      permission = {},
      listData = [],
      feedbackReq = {}
    } = this.state;
    const { fileId, resultId, oldStatus } = selectedFeedback;
    const userId = this?.props?.userInfo?.appUser?.id;

    const fbBodyReq =
      type == "trinh"
        ? {
            fileId,
            oldStatus
          }
        : { fileId };
    this.setState(
      {
        isRecall: false
      },
      async () => {
        let returnVlue;
        if (type === "trinh") {
          returnVlue = await this.props.recallTrinhFeedback(fbBodyReq);
        } else {
          returnVlue = await this.props.recallDuyetFeedBack(fbBodyReq);
        }

        if (returnVlue) {
          this.setState(
            {
              scrLoading: true
            },
            async () => {
              await Promise.all([
                this.props.getFeedbackResult({
                  fileId,
                  userId,
                  type: (permission.assist && this.isHasPermissionAssist()) ? "ASSIST" : "ANSWER"
                }),
                this.props.getFeedbackById({ fileId }),
                this.props.getListFeedback({
                  ...feedbackReq,
                  activePage: 0,
                  pageSize: listData.length
                })
              ]);

              const {
                selectedFeedback: selectedFeedbackProps = {},
                listFeedback = [],
                feedbackResult = {}
              } = this.props;
              const {
                history = [],
                subjects: subjectsSelectedFBProps = []
              } = selectedFeedbackProps;
              const ind = listFeedback.findIndex(
                element =>
                  element.fileId === fileId && element.resultId === resultId
              );

              const selectedFeedbackFromList =
                ind > -1 ? { ...listFeedback[ind] } : {};
              const { parentStatus, status: statusD } =
                ind > -1 ? selectedFeedbackFromList : selectedFeedback;

              this.setState(
                {
                  listData: listFeedback,
                  listFbResult: feedbackResult,
                  selectedSubject: subjectsSelectedFBProps[0],
                  selectedFeedback: {
                    ...selectedFeedback,
                    ...selectedFeedbackFromList,
                    subjects: subjectsSelectedFBProps,
                    history
                  },
                  isVisibleSendButton:
                    permission.forward && statusD < 3 && parentStatus !== 4,

                  isVisibleAnsButton:
                    !(statusD === 10 || statusD === 11 || statusD === 12) &&
                    parentStatus !== 4 &&
                    permission.answer
                },
                () => {
                  this.setSubjects();
                  this.renderDataTable();
                  setTimeout(() => {
                    this.setState({
                      isVisibleNotifyApprove: true,
                      notifyApprove: "Đồng chí đã thu hồi lệnh thành công"
                    });
                  }, 1000);
                }
              );
            }
          );
        } else {
          this.showAlert("Đã có lỗi xảy ra, đồng chí vui lòng thử lại sau!");
        }
      }
    );
  };

  getSubjectItemId = () => {
    const { selectedSubject = {}, subjects } = this.state;
    const { subjectId } = selectedSubject;

    const subject =
      subjects.find(element => element.subjectId === subjectId) || {};
    let subjectItemId = -1;

    if (subject.subjectType === "OPTION") {
      const { items = [] } = subject;
      items.forEach(item => {
        if (item.selected) {
          subjectItemId = item.subjectItemId;
        }
      });
    }

    if (subject.subjectType === "YESNO") {
      if (subject.selectYes === true && subject.selectNo === false) {
        subjectItemId = 1;
      }
      if (subject.selectNo === true && subject.selectYes === false) {
        subjectItemId = 0;
      }
    }

    const { custom = "" } = subject;

    this.setState({
      subjectItemId,
      custom
    });
  };

  renderAnswer = subject => {
    const { subjectType = "", items = [] } = subject;
    const { subjectItemId, subjects = [], listFbResult = [] } = this.state;

    let listAnswers;
    if (subjectType === VOTE_TYPE.YESNO) {
      listAnswers = (
        <View>
          <View
            style={{
              margin: 10,
              backgroundColor: "white",
              padding: 10
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingRight: 10
              }}
            >
              <Text
                style={{ fontSize: 15, color: "black", fontWeight: "bold" }}
              >
                Đồng ý
              </Text>
              <CheckBox
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
                // checkedCheckBoxColor='#4281D0'
                // uncheckedCheckBoxColor='grey'
                onValueChange={() => {
                  this.setState(
                    {
                      subjectItemId: subjectItemId === 1 ? -1 : 1
                    },
                    () => {
                      const selected = this.state.subjectItemId === 1;
                      const newSeletedSubject = {
                        ...subject,
                        selectYes: selected
                      };
                      const ind = subjects.findIndex(
                        subjectItem =>
                          subjectItem.subjectId === newSeletedSubject.subjectId
                      );
                      const newSubjects = [...subjects];
                      if (ind !== -1) {
                        newSubjects[ind] = newSeletedSubject;
                      } else {
                        newSubjects.push(newSeletedSubject);
                      }
                      this.setState({
                        subjects: newSubjects
                      });
                    }
                  );
                }}
                value={subjectItemId === 1}
              />
            </View>
          </View>
          <View
            style={{
              margin: 10,
              backgroundColor: "white",
              padding: 10
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingRight: 10
              }}
            >
              <Text
                style={{ fontSize: 15, color: "black", fontWeight: "bold" }}
              >
                Không đồng ý
              </Text>
              <CheckBox
                boxType={"square"}
                tintColor={"grey"}
                onCheckColor={"#4281D0"}
                tintColors={{ true: "#4281D0", false: "grey" }}
                style={[
                  { height: 21, width: 21 },
                  Platform.OS === "android" && {
                    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]
                  }
                ]}
                onValueChange={() => {
                  this.setState(
                    {
                      subjectItemId: subjectItemId === 0 ? -1 : 0
                    },
                    () => {
                      const selected = this.state.subjectItemId === 0;
                      const newSeletedSubject = {
                        ...subject,
                        selectNo: selected
                      };

                      const ind = subjects.findIndex(
                        subjectItem =>
                          subjectItem.subjectId === newSeletedSubject.subjectId
                      );
                      const newSubjects = [...subjects];
                      if (ind !== -1) {
                        newSubjects[ind] = newSeletedSubject;
                      } else {
                        newSubjects.push(newSeletedSubject);
                      }
                      this.setState({
                        subjects: newSubjects
                      });
                    }
                  );
                }}
                value={subjectItemId === 0}
              />
            </View>
          </View>
        </View>
      );
    } else if (subjectType === VOTE_TYPE.OPTION) {
      const voteItems = [];
      items.forEach((element, index) => {
        const { no = -1, content, subjectItemId: itemId } = element;
        const itemVote = (
          <View key={no.toString()}>
            <View
              style={{
                margin: 10,
                backgroundColor: "white",
                padding: 10
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingRight: 10
                }}
              >
                <Text
                  style={{ fontSize: 15, color: "black", fontWeight: "bold" }}
                >
                  {"PHƯƠNG ÁN "}
                  {index + 1}
                </Text>
                <CheckBox
                  boxType={"square"}
                  tintColor={"grey"}
                  onCheckColor={"#4281D0"}
                  tintColors={{ true: "#4281D0", false: "grey" }}
                  style={[
                    { height: 21, width: 21 },
                    Platform.OS === "android" && {
                      transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]
                    }
                  ]}
                  onValueChange={() => {
                    this.setState(
                      {
                        subjectItemId: subjectItemId === itemId ? -1 : itemId,
                        items:
                          items && subjectItemId === itemId
                            ? items.map(
                                item => item && { ...item, selected: false }
                              )
                            : items.map(item =>
                                item.subjectItemId === itemId
                                  ? { ...item, selected: true }
                                  : { ...item, selected: false }
                              )
                      },
                      () => {
                        const {
                          selectedSubject = {},
                          items: listItems = []
                        } = this.state;
                        const newSeletedSubject = {
                          ...selectedSubject,
                          items: listItems
                        };

                        const ind = subjects.findIndex(
                          subjectItem =>
                            subjectItem.subjectId === selectedSubject.subjectId
                        );
                        const newSubjects = [...subjects];
                        if (ind !== -1) {
                          newSubjects[ind] = newSeletedSubject;
                        } else {
                          newSubjects.push(newSeletedSubject);
                        }

                        const { results = [] } = listFbResult;
                        const newResults = results.map(result =>
                          result.subjectId === selectedSubject.subjectId
                            ? { ...result, subjectItemId: itemId }
                            : result
                        );
                        this.setState({
                          selectedSubject: newSeletedSubject,
                          subjects: newSubjects,
                          listFbResult: { ...listFbResult, results: newResults }
                        });
                      }
                    );
                  }}
                  value={subjectItemId === itemId}
                />
              </View>
              <Text>{content}</Text>
            </View>
          </View>
        );
        voteItems.push(itemVote);
      });
      listAnswers = <View>{voteItems}</View>;
    }
    return listAnswers;
  };

  renderItem = ({ item, index }) => {
    const { name, statusName, strExpiredDate } = item;
    const { keyword } = this.state;

    return (
      <TouchableOpacity onPress={this.selectItem(item)}>
        <View
          style={[
            styles.boderBottom,
            styles.containerItem,
            { backgroundColor: "white" }
          ]}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontWeight: "bold", fontSize: 14 }}>
              <Text>{`${index + 1}. `}</Text>
              <Text>
                <Highlighter
                  highlightStyle={{ backgroundColor: "yellow" }}
                  searchWords={[keyword]}
                  textToHighlight={name}
                />
              </Text>
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 3
            }}
          >
            <View style={styles.flexRow}>
              <Text>{`Hạn trả lời: ${strExpiredDate}`}</Text>
            </View>
            <View>
              <Text
                style={{
                  color:
                    statusName === STATUS.CHUA_TRA_LOI ? "#FF0000" : "#3127F1"
                }}
              >
                {statusName}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  handleLoadMore = async () => {
    if (this.state.extraData.loading) {
      return;
    }

    this.handleLoading(true);
    const { feedbackReq = {}, listData } = this.state;
    const { activePage, pageSize } = feedbackReq;

    if ((activePage + 1) * pageSize >= this.props.totalFeedback) {
      this.handleLoading(false);
      return;
    }

    const newActivePage = feedbackReq.activePage + 1;
    const newFeedbackReq = { ...feedbackReq, activePage: newActivePage };

    await this.props.getListFeedback(newFeedbackReq);

    this.setState(
      {
        feedbackReq: newFeedbackReq,
        listData: [...listData, ...this.props.listFeedback]
      },
      () => {
        this.filterList(this.state.listData);
      }
    );

    this.handleLoading(false);
  };

  handleLoading = loading => {
    this.setState({
      extraData: { ...this.state.extraData, loading }
    });
  };

  renderFooter = () => {
    if (!this.state.extraData.loading) return null;
    return <ActivityIndicator style={{ color: "#000", marginVertical: 10 }} />;
  };

  onRefresh = async () => {
    const { feedbackReq = {}, extraData = {} } = this.state;
    this.setState({
      extraData: { ...extraData, isRefreshing: true }
    });

    const newFeedbackReq = { ...feedbackReq, activePage: DEFAULT.ACTIVE_PAGE };
    await this.props.getListFeedback(newFeedbackReq);
    this.setState({
      listData: this.props.listFeedback,
      extraData: { ...extraData, isRefreshing: false },
      feedbackReq: newFeedbackReq
    });
  };

  renderDataTable = () => {
    const { tableData = {}, selectedFeedback = {} } = this.state;
    const tableDataBody = [];
    const { history = [] } = selectedFeedback;

    history.forEach((element, index) => {
      const stt = index + 1;
      const {
        action = "",
        strCreatedDate = "",
        positionName = "",
        attachmentName = "",
        attachmentId = "",
        extendReason = ""
      } = element;
      const viewAction = action === TYPE_ACTION.GIA_HAN_TRA_LOI;

      const itemData = [
        <Text style={styles.contentTableText}>
          {`${stt}.` + ` ${positionName}`}
        </Text>,
        <View style={{ paddingHorizontal: 3 }}>
          <Text style={styles.contentTableText}>{action}</Text>
          {viewAction && (
            <PopoverTooltip
              ref={ref => (this._tooltip1 = ref)}
              buttonComponent={
                <View>
                  <Text style={{ color: "#3127F1", fontSize: 11 }}>
                    {"(Xem lý do)"}
                  </Text>
                </View>
              }
              items={[
                {
                  label: extendReason,
                  onPress: () => {}
                }
              ]}
              tooltipContainerStyle={{
                marginStart: width < height ? 30 : 50,
                justifyContent: "center",
                alignItems: "center"
              }}
              // labelContainerStyle={{marginStart:20,alignItems: 'center'}}
              delayLongPress={0}
            />
          )}
        </View>,
        <Text style={styles.contentTableText}>{strCreatedDate}</Text>,
        <Text
          style={[styles.contentTableText, { color: "#3127F1" }]}
          onPress={() =>
            this.setState({
              isVisibleShowHistoryFiles: true,
              historyAttachFileId: attachmentId
            })
          }
        >
          {attachmentName}
        </Text>
      ];
      tableDataBody.push(itemData);
    });

    this.setState({
      tableData: { ...tableData, tableBody: tableDataBody },
      scrLoading: false
    });
  };

  renderDataTable2 = () => {
    const { attachFile = [] } = this.props;
    const tableData2 = [];

    if (attachFile.length === 0) {
      tableData2.push([
        <Text
          key={"table2hasnoitem"}
          style={{ textAlign: "center", color: "grey" }}
        >
          Không có bản ghi
        </Text>
      ]);
    } else {
      attachFile.forEach((element, index) => {
        const stt = index + 1;
        const { name = "", title = "", attachmentId = "" } = element;
        const isPDF = name.slice(name.length - 3) === "pdf";
        const itemData = [
          <Text style={{ textAlign: "center" }}>{stt}</Text>,
          <Text
            style={{ textAlign: "left", color: "#3939FF", paddingLeft: 10 }}
            onPress={() =>
              this.checkToOpenFileAttachFileId(attachmentId, name, isPDF)
            }
          >
            {name}
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
  // checkToOpenFile = (attachmentId, name, isPdf) => {
  //     if (isPdf) {
  //         this.setState({ isVisibleShowFiles: true, attachmentId: attachmentId})
  //     } else {
  //         this.handleViewFile(attachmentId, name)
  //     }
  // }
  checkToOpenFileAttachFileId = (attachmentId, name, isPdf) => {
    if (isPdf) {
      this.setState({ isVisibleShowFiles: true, attachFileId: attachmentId });
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
  renderDataTable3 = () => {
    const { helpAttachFile = [] } = this.props;
    const tableData3 = [];

    if (helpAttachFile.length === 0) {
      tableData3.push(
        <Text
          key={"table3hasnoitem"}
          style={{ textAlign: "center", color: "grey" }}
        >
          Không có bản ghi
        </Text>
      );
    } else {
      helpAttachFile.forEach((element, index) => {
        const stt = index + 1;
        const { name = "", title = "", attachmentId = "" } = element;
        const isPDF = name.slice(name.length - 3) === "pdf";
        const itemData = [
          <Text style={{ textAlign: "center" }}>{stt}</Text>,
          <Text
            style={{ textAlign: "left", color: "#3939FF", paddingLeft: 10 }}
            onPress={() =>
              this.checkToOpenFileAttachFileId(attachmentId, name, isPDF)
            }
          >
            {name}
          </Text>,
          <Text style={{ textAlign: "left", paddingLeft: 10 }}>{title}</Text>
        ];
        const rowData = (
          <Row
            key={index.toString()}
            flexArr={[1, 5, 4]}
            data={itemData}
            style={styles.contentTable}
          />
        );
        tableData3.push(rowData);
      });
    }

    this.setState({
      tableData3
    });
  };

  selectItem = item => async () => {
    this.setState(
      {
        scrLoading: true
      },
      () => {
        this.hideMenu();
        this._drawer.close();
      }
    );

    const userId = this.props?.userInfo?.appUser?.id;
    const { permission = {}, isTK } = this.state;

    await Promise.all([
      this.props.getFeedbackById({ fileId: item.fileId }),
      this.props.getSummaryById({ fileId: item.fileId }),
      this.props.getFeedbackResult({
        fileId: item.fileId,
        userId,
        type: (permission.assist && this.isHasPermissionAssist()) ? "ASSIST" : "ANSWER"
      }),
      this.props.getAttachFile({
        objectId: item.fileId,
        objectType: "FILE",
        type: "FILE_DINH_KEM"
      }),
      this.props.getAttachFile({
        objectId: item.fileId,
        objectType: "FILE",
        type: "FILE_NOI_DUNG"
      }),
      this.props.getAttachFile({
        objectId: item.fileId,
        objectType: "FILE_RESULT",
        type: "FILE_GUI_CAP_TREN",
        targetType: "GET_HELP"
      })
    ]);

    const {
      listFeedback = [],
      feedbackResult = {},
      selectedFeedback = {},
      attachFile = []
    } = this.props;
    const { status, parentStatus, parentResultId } = item;
    const { subjects = [], history = [] } = selectedFeedback;
    const convertSelect = { ...selectedFeedback, ...item, subjects, history };
    this.props.SelectedFeedback(convertSelect, -1);

    this.setState(
      {
        listData: listFeedback,
        listFbResult: feedbackResult,
        selectedFeedback: convertSelect,
        isVisibleSendButton:
          permission.forward && status < 3 && parentStatus !== 4,
        isVisibleAnsButton:
          !(status === 10 || status === 11 || status === 12) &&
          parentStatus !== 4 &&
          permission.answer,
        TKCanAns: isTK && (!parentResultId || parentResultId < 1),
        selectedSubject: selectedFeedback.subjects[0],
        isDrawerOpen: false,
        lengthAttachFile: attachFile.length,
        scrLoading: false
      },
      () => {
        this.setSubjects();
        this.renderDataTable();
        this.renderDataTable2();
        this.renderDataTable3();
      }
    );
  };

  handleChangeButton = isCollapsed => {
    const { tableData = {} } = this.state;
    return this.setState({
      tableData: {
        ...tableData,
        button: this.getCollapsedIcon(isCollapsed),
        button2: this.getCollapsedIcon2(isCollapsed)
      }
    });
  };

  getCollapsedIcon = isCollapsed => {
    return isCollapsed ? "minus-circle" : "plus-circle";
  };

  getCollapsedIcon2 = isCollapsed => {
    return isCollapsed ? "chevron-up" : "chevron-down";
  };

  handleCheckVote = checked => {
    if (this.state.checked === checked) {
      this.setState({
        checked: 0
      });
      return;
    }

    this.setState({
      checked
    });
  };

  openControlPanel = () => {
    if (!this.state.isDrawerOpen) {
      this._drawer.open();
      // bb call api when open dawer
      this.props.getDashboard();
      this.props.getListFeedback(this.state.feedbackReq);
      this.setState({
        isDrawerOpen: true
      });
    } else {
      this.hideMenu();
      this._drawer.close();
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

  resultButton() {
    this.props.navigation.navigate("FeedbackResultScreen");
  }

  syncFeedback = async (res, needReload) => {
    const {
      KHONG_THANH_CONG: notSuccess,
      GUI_VAN_THU_THANH_CONG: success
    } = THONG_BAO;

    setTimeout(() => {
      const { isVisibleSendButton } = this.state;
      if (res === "true") {
        this.setState({
          isVisibleSendButton: false
        });
      } else {
        this.setState({
          isVisibleSendButton
        });
      }
      this.setState({
        notify: res === "false" ? notSuccess : success,
        isVisibleNotify: true
      });
    }, 500);
    if (needReload) {
      const { listData = [], selectedFeedback = {} } = this.state;
      const size = listData.length;
      const position = listData
        .map(element => {
          return element.fileId;
        })
        .indexOf(selectedFeedback.fileId);
      await this.props.getListFeedback({
        keyword: "",
        pageSize: size,
        activePage: 0
      });
      const { listFeedback = [] } = this.props;
      this.setState({
        listData: listFeedback,
        selectedFeedback: { ...selectedFeedback, ...listFeedback[position] }
      });
    }
  };

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    if (this._menu) {
      this._menu.hide();
      Keyboard.dismiss();
    }
  };

  showMenu = () => {
    if (this._menu) {
      this._menu.show();
    }
  };

  handleSelectFilter = filterType => {
    this.hideMenu();
    this.setState({
      filterType
    });
  };

  getAssistAnswer = async () => {
    const { isSupportFbChecked } = this.state;
    this.setState({
      isSupportFbChecked: !isSupportFbChecked
    });
    const userId = this.props?.userInfo?.appUser?.id;
    const { fileId } = this.state.selectedFeedback;
    await Promise.all([
      isSupportFbChecked &&
        this.props.getFeedbackResult({ fileId, userId, type: "ANSWER" }),
      !isSupportFbChecked &&
        this.props.getFeedbackResult({ fileId, userId, type: "GET_HELP" })
    ]);
    const { feedbackResult = {} } = this.props;
    this.setState(
      {
        listFbResult: feedbackResult
      },
      () => {
        this.setSubjects();
      }
    );
  };

  _renderModalSendApprove = () => {
    const {
      isSendApprove,
      sendApproveValue,
      isVisibleErrAnswer,
      mess
    } = this.state;
    return (
      <Modal
        isVisible={isSendApprove}
        onBackdropPress={() =>
          this.setState({
            isSendApprove: false,
            press: 0,
            sendApproveValue: ""
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
            title={"Trình phê duyệt"}
            haveClose
            haveEmail={false}
            onClose={() =>
              this.setState({
                isSendApprove: false,
                press: 0,
                sendApproveValue: ""
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
                <Text style={styles.boldTxt}>{"Ghi chú phê duyệt *"}</Text>
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
                    placeholder={"Nhập ghi chú"}
                    maxLength={255}
                    multiline
                    onChangeText={text => {
                      this.setState({ sendApproveValue: text });
                    }}
                    value={sendApproveValue}
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
                      isSendApprove: false,
                      sendApproveValue: ""
                    })
                  }
                >
                  <IconC name="close" size={20} color="#326EC4" />
                  <Text
                    style={{
                      color: "#326EC4",
                      fontWeight: "bold",
                      marginLeft: 10
                    }}
                  >
                    Đóng
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { width: widthPercent[30] }]}
                  onPress={() => {
                    this.sendApproveModalFeedback();
                  }}
                >
                  <IconB name="paper-plane" size={20} color="white" />
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      marginLeft: 10
                    }}
                  >
                    Trình
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
  _renderModalApprove = () => {
    const {
      isApprove,
      approveValue1,
      approveValue2,
      isVisibleErrAnswer,
      mess,
      selectedFeedback = {}
    } = this.state;
    const { note } = selectedFeedback;
    return (
      <Modal
        isVisible={isApprove}
        onBackdropPress={() =>
          this.setState({
            isApprove: false,
            press: 0,
            approveValue2: ""
          })
        }
        backdropColor={"rgb(156,156,156)"}
        animationInTiming={400}
        animationOutTiming={500}
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={500}
        hideModalContentWhileAnimating
      >
        <View style={{ backgroundColor: "#EBEFF5", height: height * 0.59 }}>
          <MHeader
            title={"Phê duyệt"}
            haveClose
            haveEmail={false}
            onClose={() =>
              this.setState({
                isApprove: false,
                press: 0,
                approveValue2: ""
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
                <Text style={styles.boldTxt}>{"Ghi chú phê duyệt"}</Text>
              </View>
              <View
                style={{
                  marginHorizontal: 10,
                  marginTop: 10,
                  backgroundColor: "#F2F2F2",
                  borderColor: "gray",
                  borderWidth: 0.5
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
                        textAlignVertical: "top",
                        color: "black"
                      }
                    ]}
                    editable={false}
                    selectTextOnFocus={false}
                    placeholder={"Nhập ghi chú"}
                    multiline
                    value={note || ""}
                  />
                </View>
              </View>
              <View
                style={{
                  marginHorizontal: 10,
                  justifyContent: "center",
                  marginTop: 10
                }}
              >
                <Text style={styles.boldTxt}>{"Ý kiến phê duyệt *"}</Text>
              </View>
              <View
                style={{
                  marginHorizontal: 10,
                  marginTop: 10,
                  backgroundColor: "white",
                  borderColor: "gray",
                  borderWidth: 0.5
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
                    maxLength={255}
                    placeholder={"Nhập ý kiến"}
                    multiline
                    onChangeText={text => {
                      this.setState({ approveValue2: text });
                    }}
                    value={approveValue2}
                  />
                </View>
              </View>

              <View
                style={{ flexDirection: "row", justifyContent: "space-around" }}
              >
                <TouchableOpacity
                  style={[styles.buttonOutline, { width: widthPercent[30] }]}
                  onPress={() =>
                    this.setState({ isApprove: false, approveValue2: "" })
                  }
                >
                  <IconC name="close" size={20} color="#326EC4" />
                  <Text
                    style={{
                      color: "#326EC4",
                      fontWeight: "bold",
                      marginLeft: 10
                    }}
                  >
                    Đóng
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { width: widthPercent[30] }]}
                  onPress={() => this.approveOrDeclineModalFeedback(true)}
                >
                  <IconC name="check" size={20} color="white" />
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      marginLeft: 10
                    }}
                  >
                    Phê duyệt
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
          {/* <Confirm
                    width={width}
                    isVisible={isVisibleConfirm}
                    content={this.state.contentConfirm}
                    onCancel={() => this.setState({ isVisibleConfirm: false })}
                    onOk={() => this.sendFeedbackResult()}
                /> */}

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
  _renderModalReject = () => {
    const {
      isReject,
      rejectValue1,
      rejectValue2,
      isVisibleErrAnswer,
      mess,
      selectedFeedback
    } = this.state;
    const { note } = selectedFeedback;
    return (
      <Modal
        isVisible={isReject}
        onBackdropPress={() =>
          this.setState({
            isReject: false,
            press: 0,
            rejectValue2: ""
          })
        }
        backdropColor={"rgb(156,156,156)"}
        animationInTiming={400}
        animationOutTiming={500}
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={500}
        hideModalContentWhileAnimating
      >
        <View style={{ backgroundColor: "#EBEFF5", height: height * 0.59 }}>
          <MHeader
            title={"Từ chối"}
            haveClose
            haveEmail={false}
            onClose={() =>
              this.setState({
                isReject: false,
                press: 0,
                rejectValue2: ""
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
                <Text style={styles.boldTxt}>{"Ghi chú phê duyệt"}</Text>
              </View>
              <View
                style={{
                  marginHorizontal: 10,
                  marginTop: 10,
                  backgroundColor: "#F2F2F2",
                  borderColor: "gray",
                  borderWidth: 0.5
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
                        textAlignVertical: "top",
                        color: "black"
                      }
                    ]}
                    editable={false}
                    selectTextOnFocus={false}
                    placeholder={"Nhập ghi chú"}
                    multiline
                    // onChangeText={(text) => {
                    //   this.setState({ rejectValue1: text});
                    // }}
                    value={note}
                  />
                </View>
              </View>
              <View
                style={{
                  marginHorizontal: 10,
                  justifyContent: "center",
                  marginTop: 10
                }}
              >
                <Text style={styles.boldTxt}>{"Lý do từ chối *"}</Text>
              </View>
              <View
                style={{
                  marginHorizontal: 10,
                  marginTop: 10,
                  backgroundColor: "white",
                  borderColor: "gray",
                  borderWidth: 0.5
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
                    maxLength={255}
                    placeholder={"Nhập lý do từ chối"}
                    multiline
                    onChangeText={text => {
                      this.setState({ rejectValue2: text });
                    }}
                    value={rejectValue2}
                  />
                </View>
              </View>

              <View
                style={{ flexDirection: "row", justifyContent: "space-around" }}
              >
                <TouchableOpacity
                  style={[styles.buttonOutline, { width: widthPercent[30] }]}
                  onPress={() =>
                    this.setState({ isReject: false, rejectValue2: "" })
                  }
                >
                  <IconC name="close" size={20} color="#326EC4" />
                  <Text
                    style={{
                      color: "#326EC4",
                      fontWeight: "bold",
                      marginLeft: 10
                    }}
                  >
                    Đóng
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { width: widthPercent[30], backgroundColor: "#D42727" }
                  ]}
                  onPress={() => this.approveOrDeclineModalFeedback(false)}
                >
                  <IconC name="close" size={20} color="white" />
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      marginLeft: 10
                    }}
                  >
                    Từ chối
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
          {/* <Confirm
                    width={width}
                    isVisible={isVisibleConfirm}
                    content={this.state.contentConfirm}
                    onCancel={() => this.setState({ isVisibleConfirm: false })}
                    onOk={() => this.sendFeedbackResult()}
                /> */}

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

  render() {
    const {
      selectedFeedback = {},
      isVisibleShowFiles = false,
      isVisibleShowHistoryFiles = false,
      isVisibleSendFb = false,
      isVisibleAttach1 = false,
      isVisibleAttach2 = false,
      isVisibleFileAttach = false,
      isFbReplyVisible = false,
      isSendApprove = false,
      isApprove = false,
      isReject = false,
      isRecall = false,
      isVisibleNotify = false,
      isVisibleNotifyApprove = false,
      isVisibleSendButton = true,
      isVisibleAnsButton = true,
      isVisibleContentFb = false,
      notifyApprove = "",
      isVisibleConfirm = false,
      isVisibleErrAnswer = false,
      isTVCP = false,
      isTK = false,
      isCVVP = false,
      tableData = {
        tableHead: [],
        tableBody: [],
        button: "minus-circle",
        button2: "chevron-up"
      },
      selectedSubject = {},
      press,
      notify,
      attachFileId = 0,
      historyAttachFileId,
      lengthAttachFile,
      keyword = "",
      filterList = {},
      filterType = "",
      custom,
      isVisibleValNotify,
      mess = "",
      listData = [],
      permission = {}
    } = this.state;

    const {
      name,
      statusName,
      status,
      userId,
      strCreatedDate,
      strExpiredDate,
      signerFullname,
      signerPosition,
      createdByName,
      releasedCode,
      voteType = {},
      parentResultId,
      strSendDate
    } = selectedFeedback;
    const { name: voteTypeName = "" } = voteType;

    return (
      <View style={styles.container}>
        <MHeader
          haveMenu
          onPressButton={this.openControlPanel}
          title="NỘI DUNG PHIẾU GHI Ý KIẾN"
          navigation={this.props.navigation}
          width={width}
        />

        <View style={{ flex: 1 }}>
          <Drawer
            ref={ref => (this._drawer = ref)}
            type={"overlay"}
            content={
              <View style={styles.drawerContainer}>
                <View
                  style={[styles.boderBottom, { backgroundColor: "white" }]}
                >
                  <Text style={styles.drawerTitle}>
                    PHIẾU LẤY Ý KIẾN TVUBND
                  </Text>
                </View>

                <View style={{ padding: 10, backgroundColor: "#e9e9e9" }}>
                  <View style={styles.searchContainer}>
                    <TouchableOpacity
                      style={{ marginRight: 10 }}
                      onPress={this.search}
                    >
                      <IconM name={"magnify"} size={21} color={"grey"} />
                    </TouchableOpacity>
                    <TextInput
                      value={keyword}
                      style={styles.searchField}
                      placeholder="Phiếu lấy ý kiến"
                      onChangeText={searchKey => {
                        this.setState({ keyword: searchKey });
                      }}
                      onBlur={this.search}
                    />
                  </View>
                </View>

                {this?.props?.userInfo?.appUser?.level === "CVVP" ? (
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderColor: "#cccccc",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingVertical: 7,
                      paddingHorizontal: 10
                    }}
                  >
                    <View style={{ flexDirection: "row", paddingTop: 1 }}>
                      <Text>
                        {filterType === ""
                          ? `Tất cả (${this.props.totalFeedback})`
                          : filterList[filterType].status}
                      </Text>
                    </View>

                    <Menu
                      ref={this.setMenuRef}
                      button={
                        <TouchableOpacity onPress={this.showMenu}>
                          <IconM
                            name={"filter-outline"}
                            size={25}
                            color={"#69A8D7"}
                          />
                        </TouchableOpacity>
                      }
                    >
                      <MenuItem onPress={() => this.handleSelectFilter("")}>
                        <Text>{`Tất cả (${this.props.totalFeedback})`}</Text>
                      </MenuItem>
                      <MenuDivider />
                      <MenuItem
                        onPress={() => this.handleSelectFilter("chuagui")}
                      >
                        <Text>{filterList.chuagui.status}</Text>
                      </MenuItem>
                      <MenuDivider />
                      <MenuItem
                        onPress={() => this.handleSelectFilter("dagui")}
                      >
                        <Text>{filterList.dagui.status}</Text>
                      </MenuItem>
                      <MenuDivider />
                      <MenuItem
                        onPress={() => this.handleSelectFilter("datrinhduyet")}
                      >
                        <Text>{filterList.datrinhduyet.status}</Text>
                      </MenuItem>
                      <MenuDivider />
                      {/* <MenuItem
                        onPress={() => this.handleSelectFilter("daduyet")}
                      >
                        <Text>{filterList.daduyet.status}</Text>
                      </MenuItem>
                      <MenuDivider /> */}
                      {/* <MenuItem
                        onPress={() => this.handleSelectFilter("tuchoiduyet")}
                      >
                        <Text>{filterList.tuchoiduyet.status}</Text>
                      </MenuItem> */}
                    </Menu>
                  </View>
                ) : (
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderColor: "#cccccc",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingVertical: 7,
                      paddingHorizontal: 10
                    }}
                  >
                    <View style={{ flexDirection: "row", paddingTop: 1 }}>
                      <Text>
                        {filterType === ""
                          ? `Tất cả (${this.props.totalFeedback})`
                          : filterList[filterType].status}
                      </Text>
                    </View>

                    <Menu
                      ref={this.setMenuRef}
                      button={
                        <TouchableOpacity onPress={this.showMenu}>
                          <IconM
                            name={"filter-outline"}
                            size={25}
                            color={"#69A8D7"}
                          />
                        </TouchableOpacity>
                      }
                    >
                      <MenuItem onPress={() => this.handleSelectFilter("")}>
                        <Text>{`Tất cả (${this.props.totalFeedback})`}</Text>
                      </MenuItem>
                      <MenuDivider />
                      <MenuItem
                        onPress={() => this.handleSelectFilter("answered")}
                      >
                        <Text>{filterList.answered.status}</Text>
                      </MenuItem>
                      <MenuDivider />
                      <MenuItem
                        onPress={() => this.handleSelectFilter("outDue")}
                      >
                        <Text>{filterList.outDue.status}</Text>
                      </MenuItem>
                      <MenuDivider />
                      <MenuItem
                        onPress={() => this.handleSelectFilter("inDue")}
                      >
                        <Text>{filterList.inDue.status}</Text>
                      </MenuItem>
                      <MenuDivider />
                      {/* <MenuItem
                        onPress={() => this.handleSelectFilter("chopheduyet")}
                      >
                        <Text>{filterList.chopheduyet.status}</Text>
                      </MenuItem> */}
                      {/* <MenuDivider /> */}
                      {/* <MenuItem
                        onPress={() => this.handleSelectFilter("daduyet")}
                      >
                        <Text>{filterList.daduyet.status}</Text>
                      </MenuItem>
                      <MenuDivider />
                      <MenuItem
                        onPress={() => this.handleSelectFilter("tuchoiduyet")}
                      >
                        <Text>{filterList.tuchoiduyet.status}</Text>
                      </MenuItem> */}
                    </Menu>
                  </View>
                )}
                <FlatList
                  data={
                    filterType === "" ? listData : filterList[filterType].list
                  }
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
                    />
                  }
                />
              </View>
            }
            tapToClose
            onOpen={this.onOpenDrawer}
            onClose={this.onCloseDrawer}
            onCloseStart={this.hideMenu}
            openDrawerOffset={0.2}
            closedDrawerOffset={-3}
            tweenHandler={ratio => ({
              main: { opacity: (2 - ratio * ratio) / 2 }
            })}
            tweenDuration={300}
          >
            {!this.state.scrLoading && listData.length === 0 ? (
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "center",
                  flex: 1
                }}
              >
                <Image source={srcImg} style={{ width: 120, height: 150 }} />
                <Text
                  style={{ fontSize: 17, paddingTop: 20, color: "#333333" }}
                >
                  {"Không có dữ liệu"}
                </Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableWithoutFeedback>
                  <View style={{ backgroundColor: "white" }}>
                    <View style={styles.detailBodyContent}>
                      <View style={styles.labelFeedback}>
                        <Text style={styles.boldTxt}>
                          {"Nội dung lấy ý kiến:"}
                        </Text>

                        <View style={{ marginLeft: 5 }}>
                          <Text style={styles.normalTxt}>{name}</Text>
                        </View>
                      </View>

                      {/*<View style={styles.labelFeedback}>*/}
                      {/*  <Text style={styles.boldTxt}>{"Người ký:"}</Text>*/}

                      {/*  <View style={{ marginLeft: 5 }}>*/}
                      {/*    <Text style={styles.normalTxt}>{signerFullname}</Text>*/}
                      {/*  </View>*/}
                      {/*</View>*/}

                      {/*<View style={styles.labelFeedback}>*/}
                      {/*  <Text style={styles.boldTxt}>{"Chức vụ:"}</Text>*/}
                      {/*  <View style={{ marginLeft: 5 }}>*/}
                      {/*    <Text style={styles.normalTxt}>{signerPosition}</Text>*/}
                      {/*  </View>*/}
                      {/*</View>*/}

                      <View style={styles.labelFeedback}>
                        <Text style={styles.boldTxt}>
                          {"Chuyên viên xử lý:"}
                        </Text>
                        <View style={{ marginLeft: 5 }}>
                          <Text style={styles.normalTxt}>{createdByName}</Text>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          marginBottom: 10,
                          justifyContent: "space-between"
                        }}
                      >
                        {/*<View style={{ flexDirection: "row" }}>*/}
                        {/*  <View>*/}
                        {/*    <Text style={styles.boldTxt}>{"Số:"}</Text>*/}
                        {/*  </View>*/}
                        {/*  <View style={{ marginLeft: 5 }}>*/}
                        {/*    <Text style={styles.normalTxt}>{releasedCode}</Text>*/}
                        {/*  </View>*/}
                        {/*</View>*/}
                        <View style={{ flexDirection: "row" }}>
                          <View style={{}}>
                            <Text style={styles.boldTxt}>{"Ngày gửi:"}</Text>
                          </View>
                          <View style={{ marginLeft: 5 }}>
                            <Text style={styles.normalTxt}>{strSendDate}</Text>
                          </View>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          marginBottom: 10,
                          justifyContent: "space-between"
                        }}
                      >
                        <View style={{ flexDirection: "row" }}>
                          <Text style={styles.boldTxt}>{"Hạn trả lời:"}</Text>

                          <View style={{ marginLeft: 5 }}>
                            <Text
                              style={[
                                styles.normalTxt,
                                { color: "red", fontWeight: "bold" }
                              ]}
                            >
                              {strExpiredDate}
                            </Text>
                          </View>
                        </View>

                        <View style={{ flexDirection: "row" }}>
                          <Text style={styles.boldTxt}>{"Trạng thái:"}</Text>
                          <View style={{ marginLeft: 5 }}>
                            <Text style={styles.normalTxt}>{statusName}</Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.labelFeedback}>
                        <Text style={styles.boldTxt}>
                          {"Loại phiếu ý kiến:"}
                        </Text>
                        <View style={{ marginLeft: 5 }}>
                          <Text style={styles.normalTxt}>{voteTypeName}</Text>
                        </View>
                      </View>

                      <View style={{ marginTop: 10 }}>
                        <Text
                          style={styles.highlightBlueTxt}
                          onPress={() =>
                            this.setState({ isVisibleContentFb: true })
                          }
                        >
                          {/* {'Nội dung phiếu lấy ý kiến Thành viên UBND'} */}
                          {"Nội dung phiếu lấy ý kiến"}
                        </Text>
                      </View>

                      {isVisibleContentFb && (
                        <ShowFiles
                          isVisible
                          title={"Nội dung tài liệu"}
                          fileId={this.props.contentFile[0].attachmentId || 0}
                          toggleModal={() =>
                            this.setState({ isVisibleContentFb: false })
                          }
                        />
                      )}

                      <View style={{ marginTop: 10 }}>
                        <Text
                          style={styles.highlightBlueTxt}
                          onPress={() =>
                            this.setState({ isVisibleAttach1: true })
                          }
                        >
                          {"Hồ sơ kèm theo"}
                        </Text>

                        <ModalAttachFile
                          width={width}
                          height={height}
                          isVisible={isVisibleAttach1}
                          toggleModal={() =>
                            this.setState({ isVisibleAttach1: false })
                          }
                          tableData={this.state.tableData2}
                          headName={"HỒ SƠ KÈM THEO"}
                          isVisibleShowFiles={
                            attachFileId !== 0 &&
                            isVisibleShowFiles &&
                            isVisibleAttach1
                          }
                          attachFileId={attachFileId}
                          toggleShowFiles={() =>
                            this.setState({ attachFileId: 0 })
                          }
                        />
                      </View>
                    </View>

                    <View style={{ padding: 10, marginBottom: 60 }}>
                      <Collapse
                        isCollapsed={
                          (tableData.button === "minus-circle",
                          tableData.button2 === "chevron-up")
                        }
                        onToggle={isCollapsed =>
                          this.handleChangeButton(isCollapsed)
                        }
                      >
                        <CollapseHeader>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center"
                            }}
                          >
                            <View style={{ flexDirection: "row" }}>
                              <View style={{ width: 20 }}>
                                <IconM
                                  name={tableData.button}
                                  size={17}
                                  color={"#999"}
                                />
                              </View>
                              <Text style={styles.boldTxt}>
                                {"Lịch sử xử lý"}
                              </Text>
                            </View>
                            <IconM
                              name={tableData.button2}
                              size={25}
                              color={"#999"}
                            />
                          </View>
                        </CollapseHeader>

                        <CollapseBody>
                          <View style={{ marginTop: 7 }}>
                            <Table>
                              <Row
                                flexArr={[2.5, 2.5, 2.5, 2.5]}
                                data={tableData.tableHead}
                                style={styles.headerTable}
                                textStyle={styles.headerTableText}
                              />
                              <Rows
                                flexArr={[2.5, 2.5, 3, 2]}
                                data={tableData.tableBody}
                                style={styles.contentTable}
                              />
                            </Table>
                          </View>
                        </CollapseBody>
                      </Collapse>

                      {isVisibleShowHistoryFiles && (
                        <ShowFiles
                          isVisible
                          title={"Nội dung tài liệu"}
                          fileId={historyAttachFileId || 0}
                          toggleModal={() =>
                            this.setState({
                              isVisibleShowHistoryFiles: false
                            })
                          }
                        />
                      )}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </ScrollView>
            )}

            {/* BOTTOM BUTTONS */}
            {listData.length === 0 ? (
              <View />
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  position: "absolute",
                  right: 20,
                  bottom: 20
                }}
              >
                <View style={{ marginLeft: 10 }}>
                  {/* TRA LOI PHIEU */}
                  {isVisibleAnsButton && (
                    <TouchableOpacity
                      style={[
                        styles.circleButton,
                        { backgroundColor: "#E18527" }
                      ]}
                      onPress={() => this.setState({ isFbReplyVisible: true })}
                    >
                      <IconC name="edit" size={25} color="white" />
                    </TouchableOpacity>
                  )}
                  <Modal
                    isVisible={isFbReplyVisible}
                    onBackdropPress={() =>
                      this.setState(
                        {
                          isFbReplyVisible: false,
                          press: 0,
                          selectedSubject: this.props.selectedFeedback
                            .subjects[0],
                          listFbResult: this.props.feedbackResult
                        },
                        () => this.setSubjects()
                      )
                    }
                    backdropColor={"rgb(156,156,156)"}
                    animationInTiming={400}
                    animationOutTiming={500}
                    backdropTransitionInTiming={500}
                    backdropTransitionOutTiming={500}
                    hideModalContentWhileAnimating
                  >
                    <View
                      style={{
                        backgroundColor: "#EBEFF5",
                        height: height * 0.8
                      }}
                    >
                      <MHeader
                        title={"Trả lời Phiếu lấy ý kiến"}
                        haveClose
                        haveEmail={false}
                        onClose={() =>
                          this.setState(
                            {
                              isFbReplyVisible: false,
                              press: 0,
                              selectedSubject: this.props.selectedFeedback
                                .subjects[0],
                              listFbResult: this.props.feedbackResult
                            },
                            () => this.setSubjects()
                          )
                        }
                        navigation={this.props.navigation}
                        width={width}
                        customHeight={35}
                      />
                      <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior="padding"
                      >
                        <ScrollView>
                          {isTVCP && (
                            <View
                              style={{
                                justifyContent: "center",
                                padding: 10
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center"
                                }}
                              >
                                <CheckBox
                                  boxType={"square"}
                                  tintColor={"grey"}
                                  onCheckColor={"#4281D0"}
                                  tintColors={{
                                    true: "#4281D0",
                                    false: "grey"
                                  }}
                                  style={[
                                    { height: 21, width: 21 },
                                    Platform.OS === "android" && {
                                      transform: [
                                        { scaleX: 1.5 },
                                        { scaleY: 1.5 }
                                      ]
                                    }
                                  ]}
                                  onValueChange={this.getAssistAnswer}
                                  value={this.state.isSupportFbChecked}
                                />
                                <View>
                                  <Text
                                    style={[
                                      styles.normalTxt,
                                      { paddingLeft: 15, paddingRight: 15 }
                                    ]}
                                  >
                                    {"Ý kiến của đơn vị tham mưu "}
                                    <Text
                                      style={[
                                        styles.normalTxt,
                                        { color: "#3127F1" }
                                      ]}
                                      onPress={() =>
                                        this.setState({
                                          isVisibleFileAttach: true
                                        })
                                      }
                                    >
                                      {"(Tài liệu kèm theo)"}
                                    </Text>
                                  </Text>
                                </View>
                              </View>

                              <ModalAttachFile
                                width={width}
                                height={height}
                                isVisible={isVisibleFileAttach}
                                toggleModal={() =>
                                  this.setState({
                                    isVisibleFileAttach: false
                                  })
                                }
                                tableData={this.state.tableData3}
                                headName={"TÀI LIỆU KÈM THEO"}
                              />
                            </View>
                          )}

                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              flexDirection: "row",
                              marginHorizontal: 10
                            }}
                          >
                            <View>
                              <Text
                                style={[
                                  styles.normalTxt,
                                  { fontWeight: "bold" }
                                ]}
                              >
                                {"Các nội dung cần cho ý kiến"}
                              </Text>
                            </View>
                          </View>

                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: 10
                            }}
                          >
                            {this.renderButtons(this.state.subjects)}
                          </View>

                          <View style={{ margin: 10 }}>
                            <Text
                              style={{
                                color: "#3127F1",
                                fontSize: 15,
                                fontWeight: "bold"
                              }}
                              onPress={() =>
                                this.setState({ isVisibleAttach2: true })
                              }
                            >
                              {`Hồ sơ kèm theo (${lengthAttachFile})`}
                            </Text>

                            <ModalAttachFile
                              width={width}
                              height={height}
                              isVisible={isVisibleAttach2}
                              toggleModal={() =>
                                this.setState({ isVisibleAttach2: false })
                              }
                              tableData={this.state.tableData2}
                              headName={"HỒ SƠ KÈM THEO"}
                              isVisibleShowFiles={
                                attachFileId !== 0 &&
                                isVisibleShowFiles &&
                                isVisibleAttach2
                              }
                              attachFileId={attachFileId}
                              toggleShowFiles={() =>
                                this.setState({ attachFileId: 0 })
                              }
                            />
                          </View>

                          <View style={{ marginTop: 30, marginHorizontal: 10 }}>
                            <Text
                              style={{
                                color: "#275B9D",
                                fontSize: 16,
                                fontWeight: "bold"
                              }}
                            >{`${press + 1}. ${selectedSubject?.title}`}</Text>
                          </View>

                          {this.renderAnswer(selectedSubject)}

                          <View
                            style={{
                              marginHorizontal: 10,
                              marginTop: 10,
                              backgroundColor: "white"
                            }}
                          >
                            <View
                              style={{
                                marginHorizontal: 10,
                                justifyContent: "center",
                                marginTop: 10
                              }}
                            >
                              <Text style={styles.boldTxt}>
                                {"Ý KIẾN KHÁC"}
                              </Text>
                            </View>
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
                                placeholder={"Nhập ý kiến"}
                                multiline
                                onChangeText={text => {
                                  const { subjectId } = selectedSubject;
                                  const { subjects } = this.state;
                                  const index = subjects.findIndex(
                                    element => element.subjectId === subjectId
                                  );
                                  const newSubject = {
                                    ...subjects[index],
                                    custom: text
                                  };
                                  subjects[index] = newSubject;
                                  this.setState({ subjects, custom: text });
                                }}
                                value={custom}
                              />
                            </View>
                          </View>

                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              marginBottom: 15
                            }}
                          >
                            {this.renderBottomButtons(this.state.press)}
                          </View>
                        </ScrollView>
                      </KeyboardAvoidingView>
                      {/* <Confirm
                                                width={width}
                                                isVisible={isVisibleConfirm}
                                                content={this.state.contentConfirm}
                                                onCancel={() => this.setState({ isVisibleConfirm: false })}
                                                onOk={() => this.sendFeedbackResult()}
                                            /> */}

                      <Notify
                        isVisible={isVisibleErrAnswer}
                        content={mess}
                        width={width}
                        closeNotify={() =>
                          this.setState({ isVisibleErrAnswer: false })
                        }
                      />
                    </View>
                  </Modal>

                  <Notify
                    isVisible={isVisibleValNotify}
                    content={mess}
                    width={width}
                    closeNotify={() =>
                      this.setState({ isVisibleValNotify: false })
                    }
                  />
                </View>

                {/* GUI VAN THU */}
                {(isTVCP || (isTK && !parentResultId)) && isVisibleSendButton && (
                  <View style={{ marginLeft: 10 }}>
                    <TouchableOpacity
                      style={[
                        styles.circleButton,
                        { backgroundColor: "#00829A" }
                      ]}
                      onPress={() => this.setState({ isVisibleSendFb: true })}
                    >
                      <IconB name="paper-plane" size={22} color="white" />
                    </TouchableOpacity>
                  </View>
                )}
                {(status == 2 || status == 4 || status == 7) &&
                  permission.createYC && (
                    <View style={{ marginLeft: 10 }}>
                      <TouchableOpacity
                        style={[
                          styles.circleButton,
                          { backgroundColor: "#4752BB" }
                        ]}
                        onPress={() => this.setState({ isSendApprove: true })}
                      >
                        <IconB name="paper-plane" size={22} color="white" />
                      </TouchableOpacity>
                    </View>
                  )}
                {status == 10 && this?.props?.userInfo?.appUser?.id == userId && (
                  <View style={{ marginLeft: 10 }}>
                    <TouchableOpacity
                      style={[
                        styles.circleButton,
                        { backgroundColor: "#4752BB" }
                      ]}
                      onPress={() => this.setState({ isApprove: true })}
                    >
                      <IconC name="check" size={22} color="white" />
                    </TouchableOpacity>
                  </View>
                )}
                {status == 10 && this?.props?.userInfo?.appUser?.id == userId && (
                  <View style={{ marginLeft: 10 }}>
                    <TouchableOpacity
                      style={[
                        styles.circleButton,
                        { backgroundColor: "#D42727" }
                      ]}
                      onPress={() => this.setState({ isReject: true })}
                    >
                      <IconC name="close" size={22} color="white" />
                    </TouchableOpacity>
                  </View>
                )}
                {((status == 10 && permission.createYC) ||
                  ((status == 11 || status == 12) &&
                    this?.props?.userInfo?.appUser?.id == userId)) && (
                  <View style={{ marginLeft: 10 }}>
                    <TouchableOpacity
                      style={[
                        styles.circleButton,
                        { backgroundColor: "#4752BB" }
                      ]}
                      onPress={() => this.setState({ isRecall: true })}
                    >
                      <IconC name="back" size={22} color="white" />
                    </TouchableOpacity>
                  </View>
                )}
                {this._renderModalSendApprove()}
                {this._renderModalApprove()}
                {this._renderModalReject()}
                <Confirm
                  width={width}
                  isVisible={isRecall}
                  titleHeader={"Thu hồi"}
                  content={"Bạn có chắc chắn muốn thu hồi lệnh không ?"}
                  onCancel={() => this.setState({ isRecall: false })}
                  onOk={() => {
                    const type = isTVCP ? "duyet" : "trinh";
                    this.sendRecallModalFeedback(type);
                  }}
                />
                <ModalSendFeedback
                  width={width}
                  height={height}
                  isVisible={isVisibleSendFb}
                  toggleModal={() => this.setState({ isVisibleSendFb: false })}
                  sendFileToVoOffice={this.props.sendFileToVoOffice}
                  syncFeedback={this.syncFeedback}
                />

                {/* XEM KET QUA */}
                {(permission.viewResult || isTVCP) && (
                  <View style={{ marginLeft: 10 }}>
                    <TouchableOpacity
                      style={[
                        styles.circleButton,
                        { backgroundColor: "#00AFA9" }
                      ]}
                      onPress={() => this.resultButton()}
                    >
                      <IconB name="chart-pie" size={25} color="white" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </Drawer>

          <Notify
            isVisible={isVisibleNotify}
            content={notify}
            width={width}
            closeNotify={() => this.setState({ isVisibleNotify: false })}
          />

          <Notify
            isVisible={isVisibleNotifyApprove}
            content={notifyApprove}
            width={width}
            closeNotify={() => this.setState({ isVisibleNotifyApprove: false })}
          />

          <Loading loading={this.state.scrLoading} />
        </View>
      </View>
    );
  }
}

const {width, height} = Dimensions.get('window');
const widthPercent = {
    20: width * 0.2,
    30: width * 0.3,
    40: width * 0.4,
    80: width * 0.8,
};

const mapStateToProps = (state) => {
    return {
        error: state.ErrorReducer.error,
        listFeedback: state.FeedbackReducer.listFeedback,
        selectedFeedback: state.FeedbackReducer.selectedFeedback,
        attachFile: state.FeedbackReducer.attachFile,
        contentFile: state.FeedbackReducer.contentFile,
        helpAttachFile: state.FeedbackReducer.helpAttachFile,
        summaryByFileId: state.FeedbackReducer.summaryByFileId,
        summary: state.HomeReducer.summary,
        summaryData: state.HomeReducer.summaryData,
        userInfo: state.AuthenReducer.userInfo,
        totalFeedback: state.FeedbackReducer.totalFeedback,
        feedbackResult: state.FeedbackReducer.feedbackResult,
        sessionId: state.AuthenReducer.sessionId,
    };
};

export default connect(mapStateToProps, {
    SelectedFeedback,
    getListFeedback,
    getFeedbackById,
    getAttachFile,
    sendFileToVoOffice,
    getSummaryById,
    getFeedbackResult,
    saveFeedbackAnswer,
    sendApproveFeedback,
    recallDuyetFeedBack,
    recallTrinhFeedback,
    approveORDeFB,
    getDashboard,
})(Feedbacks);
