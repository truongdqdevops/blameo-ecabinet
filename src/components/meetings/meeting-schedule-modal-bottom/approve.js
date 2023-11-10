import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Platform, TouchableWithoutFeedback, Keyboard,
} from "react-native";
import {ScrollView} from 'react-native-gesture-handler';
import TrinhPheDuyetIcon2 from '../../../assets/icons/TrinhPheDuyetIcon2.svg'
import Modal from "react-native-modal";
import styles from "../style";
import IconC from "react-native-vector-icons/AntDesign";
import IconM from "react-native-vector-icons/MaterialCommunityIcons";
import Notify from "../../../assets/components/notify";
import Confirm from "../../../assets/components/confirm";

import { Dropdown } from "react-native-material-dropdown";
import { Message } from "../../../assets/utils/message";
import { isTablet } from 'react-native-device-info';
import {
  getDataMeetingDetailService,
  getListUserApproverService,
  updatedApprovalService,
  sendApprovalService, getInformationMeetingsAreApproved,
} from "../../../services/service";

class ModalApprove extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contentBodyBox: this.props.tableData,
      sendApproveValue: "",
      mess: "",
      subUser: "",
      isIdUser: "",
      setReload: false,
      setStatusApprove: "",
    };
    this.toggleReloadApprove = this.toggleReloadApprove.bind(this);
  }
  toggleReloadApprove(status) {
    this.props.reloadListMeeting(status);
  }
  submitApprove = async (isCheck) => {
    const { sendApproveValue } = this.state;
    const checkSendApproveValue = sendApproveValue.trim("");
    if (
      (!checkSendApproveValue && isCheck) ||
      (!checkSendApproveValue && !isCheck)
    ) {
      this.setState({
        isVisibleErrAnswer: true,
        mess: Message.MSG0038,
      });
      return;
    } else {
      const status = isCheck ? 1 : 0;
      this.setState({
        isVisibleConfAnswer: true,
        setStatusApprove: status,
        messConf: isCheck ? Message.MSG0044 : Message.MSG0045,
      });
    }
  };

  sendApprove = async () => {
    const {
      selectedMeeting: { conferenceId },
      toggleIcon,
    } = this.props;
    const { sendApproveValue, setStatusApprove } = this.state;
    const checkSendApproveValue = sendApproveValue.trim("");
    this.setState({
      isVisibleConfAnswer: false,
    });
    setTimeout(()=>{
      this.handleCanCel();
    }, 100)
    try {
      await updatedApprovalService({
            conferenceId,
            approverNote: checkSendApproveValue,
            status: setStatusApprove,
          });
      setTimeout(()=>{
        toggleIcon();
        this.toggleReloadApprove(setStatusApprove);
      }, 300)
    } catch (error) {
      this.setState({
        isVisibleErrAnswer: true,
        mess: `${error}`,
      });
    }
  }

  submitApproval = async () => {
    const { sendApproveValue, subUser } = this.state;
    const checkSendApproveValue = sendApproveValue?.trim("");
    if (subUser?.length === 0) {
      this.setState({
        isVisibleErrAnswer: true,
        mess: Message.MSG0040,
      });
      return;
    } else if (checkSendApproveValue?.length === 0 || !sendApproveValue) {
      this.setState({
        isVisibleErrAnswer: true,
        mess: Message.MSG0037,
      });
      return;
    }
    this.setState({
        isVisibleConfAnswer: true,
        messConf: Message.MSG0043,
    });
  };

  sendApproval = async () => {
    const { sendApproveValue, subUser, listUsers } = this.state;
    const {
      selectedMeeting: { conferenceId },
      toggleIcon
    } = this.props;
    const checkSendApproveValue = sendApproveValue?.trim("");
    const selectedUser = listUsers.find((_, idx) => idx === subUser);
    this.setState({
      isVisibleConfAnswer: false,
    });
    setTimeout(()=>{
          this.handleCanCel();
    }, 100)
    try {
      sendApprovalService({
        conferenceId: conferenceId,
        submitNote: checkSendApproveValue,
        approverId: selectedUser.idUser,
      });
      setTimeout(()=>{
        toggleIcon();
        this.toggleReloadApprove(3);
      }, 800)
    } catch (error) {
      this.setState({
        isVisibleErrAnswer: true,
        mess: `${error}`,
      });
    }
  }

  handleCanCel = async () => this.setState(this.handleClose());

  handleClose = async () => {
    this.setState({
      subUser: "",
      dataSubmitNote: "",
      sendApproveValue: "",
    });
    this.props.toggleModal();
  };

  fetchData = async () => {
    const {
      selectedMeeting: { approverNearestId, conferenceId },
      isApproval,
    } = this.props;

    const dataListUser = await getListUserApproverService();
    let userNearest = { userNearestName: "", idx: "" };
    const listUsers = await JSON.parse(dataListUser.data).map((e, idx) => {
      if (e.id === approverNearestId) {
        userNearest = { userNearestName: e.fullName, idx: idx };
      }
      return { value: e.fullName, idUser: e.id };
    });
    this.setState({
      listUsers: listUsers,
      userNearest: userNearest,
    })
    const meetingData = await getDataMeetingDetailService({
      conferenceId: conferenceId,
      approverId: this.props.userInfo.appUser.id,
    });

    let lastSubmitNote = "";
    let submitNoteApproval = "";
    if(!isApproval){
      const meetingDataById = await getInformationMeetingsAreApproved({"id": conferenceId});
      submitNoteApproval = JSON.parse(meetingDataById.data).submitNote;
    } else {
      lastSubmitNote = JSON.parse(meetingData.data).submitNote;
    }
    this.setState({
      dataSubmitNote: lastSubmitNote,
      sendApproveValue: submitNoteApproval,
      subUser: userNearest.idx,
    });
  };

  componentDidUpdate = async (prevProps) => {
    if (prevProps.isVisible !== this.props.isVisible && this.props.isVisible) {
      this.fetchData();
    }
  };
  componentDidMount = async () => {
    await this.fetchData();
  };
  render() {
    const { width, height, isVisible, isApproval } = this.props;
    const {
      isVisibleErrAnswer = false,
      isVisibleConfAnswer = false,
      dataSubmitNote = "",
      listUsers = [],
      mess = "",
      messConf = "",
      userNearest = {},

    } = this.state;
    const widthPercent = {
      20: width * 0.2,
      30: width * 0.3,
      40: width * 0.4,
      80: width * 0.8,
    };
    const isMobile = !isTablet();
    const behavior = Platform.OS === 'ios' ? 'padding' : 'height';

    return (

      <Modal
        isVisible={isVisible}
        onBackdropPress={() =>
          this.setState({
            isVisible: false,
            press: 0,
            sendApproveValue: "",
            subUser: "",
          })
        }
        backdropColor={"rgb(156,156,156)"}
        animationInTiming={400}
        animationOutTiming={500}
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={500}
        hideModalContentWhileAnimating
        deviceWidth={width}
        style={{}}
      >
        <KeyboardAvoidingView style={{flex: 1, justifyContent: "center",}} behavior={behavior} enabled>
          <View onPress={Keyboard.dismiss}>
        <View
          style={{
            backgroundColor:  "#fff",
          }}
          // behavior={this.state.behavior}
        >
          <View
            style={{
              height: 45,
              display: "flex",
              flexDirection: "row",
              paddingHorizontal: 10,
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: 1,
              borderColor: "#E7EBF2",
              backgroundColor: '#316ec4',
            }}
          >
            <Text style={{ fontWeight: "500", fontSize: 16, color: "#ffff" }}>
              {isApproval ? "Phê duyệt" : "Trình phê duyệt"}
            </Text>
            <TouchableOpacity
              style={[styles.buttonClose]}
              onPress={() => this.setState(this.handleClose())}
            >
              <IconM name={"close"} size={25} color={"#ffff"} />
            </TouchableOpacity>
          </View>
              <View
                style={{
                  marginHorizontal: 10,
                  justifyContent: "flex-start",
                  marginVertical: 8,
                  flexDirection: "row",
                }}
              >
                <Text style={styles.boldTxt}>
                  {isApproval ? "Ghi chú trình phê duyệt" : "Người phê duyệt"}
                </Text>
                {!isApproval && <Text style={{ color: "red" }}>*</Text>}
              </View>
              {isApproval ? (
                <View
                  style={{
                    marginHorizontal: 10,
                    backgroundColor: "#F2F2F2",
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: "gray",
                    padding: 1,

                  }}
                >

                    <ScrollView
                        onStartShouldSetResponder={() => true}
                        contentContainerStyle={{
                        }}
                        style={{
                          maxHeight: Platform.OS === "ios" ? undefined : height * 0.20,
                        }}
                    >
                      <TextInput
                          style={{
                            flex: 1,
                            maxHeight: Platform.OS === "ios" ? height * 0.20 : undefined,
                            textAlignVertical: "top",
                            color: "black",
                            paddingHorizontal: 3,
                          }}
                          editable={false}
                          maxLength={500}
                          multiline
                          value={dataSubmitNote}
                      />
                    </ScrollView>

                </View>
              ) : (
                <Dropdown
                  value={
                    userNearest.userNearestName
                        ? userNearest.userNearestName
                        : "Chọn người phê duyệt"
                  }
                  data={listUsers}
                  fontSize={14}
                  dropdownPosition={0}
                  dropdownOffset={{ top: 0, left: 0 }}
                  containerStyle={{
                    height: 28,
                    marginHorizontal: 10,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: "gray",
                    paddingHorizontal: 10,
                    backgroundColor: "white",
                  }}
                  baseColor={'#8A8A8A'}
                  rippleColor={"white"}
                  pickerStyle={{
                    backgroundColor: "white",
                  }}
                  onChangeText={(_, index, data) =>
                    this.setState({ subUser: index })
                  }
                />
              )}

              <View
                style={{
                  marginHorizontal: 10,
                  justifyContent: "flex-start",
                  marginVertical: 8,
                  flexDirection: "row",
                }}
              >
                <Text style={styles.boldTxt}>
                  {isApproval ? "Ý kiến phê duyệt" : "Ghi chú trình phê duyệt"}
                </Text>
                <Text style={{ color: "red" }}>*</Text>
              </View>
              <View
                style={{
                  backgroundColor: "#ffff",
                  marginHorizontal: 10,
                  marginBottom: 10,
                  padding: 1,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: "gray",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <TextInput
                    style={[
                      {
                        width: widthPercent[80] + 10,
                        height: isApproval ? height * 0.095 : height * 0.15,
                        textAlignVertical: "top",
                        paddingLeft: 2,
                      },
                    ]}
                    placeholder={isApproval ? "Nhập ý kiến" : "Nhập ghi chú"}
                    maxLength={isApproval ? 1000 : 500}
                    value={this.state.sendApproveValue}
                    multiline
                    onChangeText={(text) => {
                      this.setState({ sendApproveValue: text });
                    }}
                  />
                </View>
              </View>
              {isApproval ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: isMobile ? "space-between" : "center",
                    borderTopWidth: 1,
                    borderColor: "#E7EBF2",
                    paddingHorizontal: 10,
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.buttonOutline,
                      { width: isMobile ? widthPercent[25] : 180 , marginVertical: 10, height: undefined,},
                    ]}
                    onPress={() => this.setState(this.handleClose())}
                  >
                    <IconC name="close" size={16} color="#326EC4" />
                    <Text
                      style={{
                        color: "#326EC4",
                        fontWeight: "bold",
                        marginLeft: 8,
                      }}
                    >
                      Đóng
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      {
                        width: isMobile ? widthPercent[25] : 180,
                        backgroundColor: "#D42727",
                        marginVertical: 10,
                        marginHorizontal: isMobile ? 0 : 10,
                        height: undefined,
                      },
                    ]}
                    onPress={() => {
                      this.submitApprove(false);
                    }}
                  >
                    <IconC name="close" size={20} color="#ffff" />
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        marginLeft: 8,
                      }}
                    >
                      Từ chối
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      { width: isMobile ? widthPercent[25] : 180, marginVertical: 10, height: undefined},
                    ]}
                    onPress={() => {
                      this.submitApprove(true);
                    }}
                  >
                    <IconM name={"check"} size={28} color={"#fff"} />
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        marginLeft: 8,
                      }}
                    >
                      Phê duyệt
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={[styles.flexRowAlignCenter,{
                    justifyContent: "space-evenly",
                    borderTopWidth: 1,
                    borderColor: "#E7EBF2",
                    paddingHorizontal: 10,
                  }]}
                >
                  <TouchableOpacity
                    style={[
                      styles.buttonOutline,
                      { width: widthPercent[25], marginVertical: 10, height: undefined},
                    ]}
                    onPress={() => this.setState(this.handleClose())}
                  >
                    <IconC name="close" size={20} color="#326EC4" />
                    <Text
                      style={{
                        color: "#326EC4",
                        fontWeight: "bold",
                        marginLeft: 8,
                        paddingVertical: 8
                      }}
                    >
                      Đóng
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      { width: widthPercent[25], marginVertical: 10, height: undefined },
                    ]}
                    onPress={() => {
                      this.submitApproval();
                    }}
                  >
                    <TrinhPheDuyetIcon2 width={24} height={24} />
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        marginLeft: 8,
                        paddingVertical: 8
                      }}
                    >
                      Trình Phê duyệt
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

          <Confirm
              isVisible={isVisibleConfAnswer}
              content={messConf}
              contentCancel={"Huỷ"}
              width={this.props.width}
              onOk={() => isApproval ? this.sendApprove() : this.sendApproval()}
              onCancel={() => this.setState({ isVisibleConfAnswer: false })}/>
          <Notify
            isVisible={isVisibleErrAnswer}
            content={mess}
            width={this.props.width}
            closeNotify={() => this.setState({ isVisibleErrAnswer: false })}
          />
        </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.ErrorReducer.error,
    selectedMeeting: state.MeetingReducer.selectedMeeting,
    userInfo: state.AuthenReducer.userInfo,
  };
};

export default connect(mapStateToProps, {})(ModalApprove);
