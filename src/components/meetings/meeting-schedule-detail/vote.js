import React, { Component } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { connect } from "react-redux";
import CheckBox from "@react-native-community/checkbox";
import IconM from "react-native-vector-icons/MaterialCommunityIcons";
import Modal from "react-native-modal";
import { CONST_CHECK_VOTE, VOTE_TYPE } from "../const";
import CustomHeader from "../../../assets/components/header";
import styles from "./style";
import { getResultByUserIdAndSubjectId } from "../../../redux/actions/meetings.action";
import { Message } from "../../../assets/utils/message";

class Vote extends Component {
  constructor(props) {
    super(props);

    const { width, height, issue } = this.props;
    const {
      items = [],
      totalSelect = 1,
      subjectType,
      subjectId,
      fileId,
    } = issue;
    let listCheck = [];
    items.forEach((element) => {
      listCheck.push(false);
    });
    this.state = {
      content: "",
      width45: width * 0.45,
      height80: height * 0.8,
      messageValidate: "",
      maxChoice: totalSelect,
      listCheck: listCheck,
      listSubjectItemId: [],
      subjectType: subjectType,
      loadingDetail: true,
      subjectId,
      conferenceFileId: fileId,
    };
    this.getSelectedAnswers(subjectId, items, subjectType, fileId);
  }

  renderVote = () => {
    const { issue = {} } = this.props;
    const { content = "", maxChoice, listCheck } = this.state;
    const { subjectType = "", items = [], subjectId, fileId } = issue;

    let listAnswers;
    if (subjectType === VOTE_TYPE.YESNO) {
      listAnswers = (
        <View
          style={[
            styles.flexRow,
            { justifyContent: "space-evenly", marginBottom: 12 },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              paddingRight: 10,
              width: "45%",
              paddingBottom: 10,
            }}
          >
            <CheckBox
              tintColor={"grey"}
              boxType={"square"}
              onCheckColor={"#4281D0"}
              tintColors={{ true: "#4281D0", false: "grey" }}
              style={[
                { height: 21, width: 21 },
                Platform.OS === "android" && {
                  transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
                },
              ]}
              value={this.props.checked === CONST_CHECK_VOTE.YES}
              onValueChange={() => {
                this.props.handleCheckVote(CONST_CHECK_VOTE.YES, {
                  subjectId,
                  content,
                  no: CONST_CHECK_VOTE.YES,
                  subjectItemId: CONST_CHECK_VOTE.YES,
                  conferenceFileId: fileId,
                });
                this.setState({ content: "" });
              }}
              noFeedback
            />
            <Text style={{ marginLeft: 20 }}>{"Đồng ý"}</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              paddingRight: 10,
              width: "45%",
            }}
          >
            <CheckBox
              tintColor={"grey"}
              boxType={"square"}
              onCheckColor={"#4281D0"}
              tintColors={{ true: "#4281D0", false: "grey" }}
              style={[
                { height: 21, width: 21 },
                Platform.OS === "android" && {
                  transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
                },
              ]}
              value={this.props.checked === CONST_CHECK_VOTE.NO}
              onValueChange={() =>
                this.props.handleCheckVote(CONST_CHECK_VOTE.NO, {
                  subjectId,
                  content,
                  no: CONST_CHECK_VOTE.NO,
                  subjectItemId: CONST_CHECK_VOTE.NO,
                  conferenceFileId: fileId,
                })
              }
              noFeedback
            />
            <Text style={{ marginLeft: 20 }}>{"Ý kiến khác"}</Text>
          </View>
        </View>
      );
    } else if (subjectType === VOTE_TYPE.OPTION) {
      const voteItems = [];
      items.forEach((element) => {
        const {
          no = -1,
          selected = false,
          subjectItemId,
          content: itemContent,
        } = element;
        const itemVote = (
          <View key={no.toString()}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                paddingRight: 10,
                marginBottom: 10,
              }}
            >
              <CheckBox
                value={
                  this.props.checked !== 0
                    ? this.props.checked === no
                    : selected
                }
                tintColor={"grey"}
                boxType={"square"}
                onCheckColor={"#4281D0"}
                tintColors={{ true: "#4281D0", false: "grey" }}
                style={[
                  { height: 21, width: 21 },
                  Platform.OS === "android" && {
                    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
                  },
                ]}
                onValueChange={() =>
                  this.props.handleCheckVote(no, {
                    subjectId,
                    content,
                    no,
                    subjectItemId,
                    conferenceFileId: fileId,
                  })
                }
                noFeedback
              />
              <Text style={{ paddingRight: 30, marginLeft: 20 }}>
                {itemContent}
              </Text>
            </View>
          </View>
        );
        voteItems.push(itemVote);
      });
      listAnswers = (
        <View style={{ marginLeft: 30, marginRight: 15, marginBottom: 7 }}>
          {voteItems}
        </View>
      );
    } else {
      // if (maxChoice !== 1) {
      const voteItems = [];
      items.forEach((element, key) => {
        const { no = -1, subjectItemId, content: itemContent } = element;
        const itemVote = (
          <View key={no.toString()}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                paddingRight: 10,
                marginBottom: 10,
              }}
            >
              <CheckBox
                value={listCheck[key]}
                customLabel={
                  <Text style={{ paddingRight: 30 }}>{itemContent}</Text>
                }
                tintColor={"grey"}
                boxType={"square"}
                onCheckColor={"#4281D0"}
                tintColors={{ true: "#4281D0", false: "grey" }}
                style={[
                  { height: 21, width: 21 },
                  Platform.OS === "android" && {
                    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
                  },
                ]}
                onValueChange={() =>
                  this.handleCheckMultipleVote(
                    no,
                    subjectId,
                    content,
                    subjectItemId,
                    fileId,
                    key
                  )
                }
                noFeedback
              />
              <Text style={{ paddingRight: 30, marginLeft: 20 }}>
                {itemContent}
              </Text>
            </View>
          </View>
        );
        voteItems.push(itemVote);
      });
      listAnswers = (
        <View style={{ marginLeft: 30, marginRight: 15, marginBottom: 7 }}>
          {voteItems}
        </View>
      );
    }
    return listAnswers;
  };

  handleCheckMultipleVote = (
    no,
    subjectId,
    content,
    subjectItemId,
    conferenceFileId,
    key
  ) => {
    const { listSubjectItemId, listCheck, maxChoice } = this.state;

    if (listCheck[key] === false) {
      listSubjectItemId.push(subjectItemId);
    } else {
      listSubjectItemId.forEach((element, key) => {
        if (element === subjectItemId) {
          listSubjectItemId.splice(key, 1);
          return false;
        }
      });
    }
    listCheck[key] = !listCheck[key];
    this.setState({
      listCheck: listCheck,
      listSubjectItemId: listSubjectItemId,
      conferenceFileId: conferenceFileId,
      content: content,
      subjectId: subjectId,
    });
  };

  getSelectedAnswers = (subjectId, items, subjectType, fileId) => {
    setTimeout(async () => {
      await this.props.getResultByUserIdAndSubjectId({ subjectId });
      const {
        resultByUserIdAndSubjectId: listSelectedAnswer = {},
      } = this.props;

      //bieu quyet chon 1 pa
      if (subjectType === VOTE_TYPE.OPTION) {
        items.forEach((answer) => {
          listSelectedAnswer.forEach((element) => {
            const { no = -1, selected = false, subjectItemId } = answer;
            const { content } = element;
            if (answer.subjectItemId === element.subjectItemId) {
              this.props.handleCheckVote(
                no,
                {
                  subjectId,
                  content,
                  no,
                  subjectItemId,
                  conferenceFileId: fileId,
                },
                true
              );
            }
            this.setState({
              content: content,
            });
          });
        });
      }
      //bieu quyet yesno
      else if (subjectType === VOTE_TYPE.YESNO) {
        listSelectedAnswer.forEach((element) => {
          const { subjectItemId } = element;
          if (subjectItemId === 0 || subjectItemId === 1) {
            const { subjectItemId, content } = element;
            this.props.handleCheckVote(
              subjectItemId,
              {
                subjectId,
                content,
                subjectItemId,
                conferenceFileId: fileId,
              },
              true
            );
            if (this.props.checked === CONST_CHECK_VOTE.YES) {
              this.setState({
                content: "",
              });
            } else {
              this.setState({
                content: content,
              });
            }
          }
        });
      }
      //bieu quyet chon nhieu phuong an
      else {
        let { listCheck, listSubjectItemId } = this.state;
        for (let i = 0; i < items.length; i++) {
          listSelectedAnswer.forEach((element) => {
            if (items[i].subjectItemId === element.subjectItemId) {
              listCheck[i] = true;
              listSubjectItemId.push(element.subjectItemId);
            }
            this.setState({
              content: element.content,
            });
          });
        }

        this.setState({
          listSelectedAnswer: listSelectedAnswer,
          listCheck: listCheck,
          listSubjectItemId: listSubjectItemId,
        });
      }
      this.setState({
        loadingDetail: false,
      });
    }, 450);
  };
  // handleMultipleVote = async () => {
  // }

  handleVote = async () => {
    const { content } = this.state;
    const { checked } = this.props;
    // const isIos = Platform.OS === 'ios'
    const oneOptionVote = this.state.subjectType === VOTE_TYPE.OPTION;
    const yesNoOptionVote = this.state.subjectType === VOTE_TYPE.YESNO;
    const multipleOptionsVote = !(oneOptionVote || yesNoOptionVote);
    if (yesNoOptionVote) {
      if (checked === -1) {
        this.setState({
          messageValidate: Message.MSG0046,
          content: "",
        });
        return;
      } else if (content.length === 0 && checked === 0) {
        this.setState({
          messageValidate: Message.MSG0047,
        });
        return;
      } else {
        this.setState({
          messageValidate: "",
        });
      }
      this.props.voteIssue();
    }
    if (oneOptionVote) {
      if (checked === -1 && (content.length === 0 || content === "")) {
        this.setState({
          messageValidate: Message.MSG0048,
        });
        return;
      } else {
        this.setState({
          messageValidate: "",
        });
      }
      this.props.voteIssue();
    }
    if (multipleOptionsVote) {
      let countAnswer = 0;
      this.state.listCheck.forEach((element) => {
        if (element) countAnswer++;
      });
      //lua chon qua phuong an
      if (countAnswer > this.state.maxChoice) {
        this.setState({
          messageValidate: `Đồng chí được chọn tối đa ${this.state.maxChoice} phương án`,
        });
      }
      //chua lua chon phuong an hoac y kien khac
      else if (countAnswer === 0 && this.state.content === "") {
        this.setState({
          messageValidate: Message.MSG0048,
        });
      } else {
        this.setState({ messageValidate: "" });
        const {
          conferenceFileId,
          content,
          subjectId,
          listSubjectItemId,
        } = this.state;
        this.props.voteMultipleIssue({
          conferenceFileId,
          content,
          subjectId,
          listSubjectItemId,
        });
      }
    }
  };

  render() {
    const {
      width45,
      height80,
      messageValidate,
      maxChoice,
      isMultiplceChoice,
      loadingDetail,
    } = this.state;
    const { isVisible = false, toggleModal, issue } = this.props;
    const { title = "", subjectId, fileId, subjectType } = issue;
    const enableOtherOption = !(
      subjectType === VOTE_TYPE.YESNO &&
      (this.props.checked === CONST_CHECK_VOTE.YES ||
        this.props.checked === CONST_CHECK_VOTE.NOT_CHECK)
    );

    return (
      <Modal
        animationInTiming={400}
        animationOutTiming={500}
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={500}
        isVisible={isVisible}
        onBackdropPress={toggleModal}
        backdropColor={"rgb(156,156,156)"}
        hideModalContentWhileAnimating
      >
        <KeyboardAvoidingView behavior={"position"}>
          <View
            style={{
              backgroundColor: "#ebeff5",
              maxHeight: height80,
            }}
          >
            <CustomHeader
              title={"Biểu quyết"}
              haveClose
              haveEmail={false}
              onClose={toggleModal}
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView>
                <View style={{ padding: 8 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 13 }}>
                    {"Vấn đề biểu quyết: "}
                    <Text style={{ fontWeight: "normal" }}>{title}</Text>
                  </Text>
                  {maxChoice >= 1 && (
                    <Text
                      style={{
                        fontWeight: "normal",
                        fontStyle: "italic",
                        fontSize: 12,
                        marginBottom: 15,
                      }}
                    >{`(Lựa chọn tối đa ${maxChoice} phương án)`}</Text>
                  )}
                  {loadingDetail && (
                    <ActivityIndicator
                      style={{ marginVertical: 10 }}
                      color={"#316ec4"}
                      size={"large"}
                    />
                  )}
                  {this.renderVote()}
                  {/* todo */}
                  <Text style={{ fontWeight: "bold", fontSize: 13 }}>
                    {"Ý kiến khác "}
                  </Text>
                  <TextInput
                    style={{
                      marginVertical: 8,
                      marginHorizontal: 5,
                      backgroundColor:
                        this.props.checked === CONST_CHECK_VOTE.YES &&
                        subjectType === VOTE_TYPE.YESNO
                          ? "#0000"
                          : "#fff",
                      height: 150,
                      padding: 7,
                      textAlignVertical: "top",
                    }}
                    editable={enableOtherOption}
                    multiline
                    value={this.state.content}
                    onChangeText={(content = "") => {
                      this.setState({ content: content }, () => {
                        this.props.handleCheckVote(CONST_CHECK_VOTE.NOT_CHECK, {
                          subjectId,
                          content,
                          conferenceFileId: fileId,
                        });
                      });
                    }}
                  />
                  {messageValidate.length !== 0 && (
                    <View>
                      <Text
                        style={{
                          textAlign: "center",
                          color: "red",
                          fontSize: 14,
                          paddingBottom: 10,
                        }}
                      >{`${messageValidate.replace(".", "")}!`}</Text>
                    </View>
                  )}
                  <View
                    style={[
                      styles.flexRow,
                      { justifyContent: "space-evenly", marginBottom: 8 },
                    ]}
                  >
                    <TouchableOpacity onPress={this.handleVote}>
                      <View
                        style={[
                          styles.flexRow,
                          {
                            paddingVertical: 5,
                            width: width45,
                            justifyContent: "center",
                            borderRadius: 4,
                            backgroundColor: "#316ec4",
                          },
                        ]}
                      >
                        <IconM name={"hand"} size={18} color={"#fff"} />
                        <Text
                          style={{ color: "#fff" }}
                        >{` ${"Biểu quyết"}`}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </TouchableWithoutFeedback>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.ErrorReducer.error,
    resultByUserIdAndSubjectId: state.MeetingReducer.resultByUserIdAndSubjectId,
  };
};

export default connect(mapStateToProps, {
  getResultByUserIdAndSubjectId,
})(Vote);
