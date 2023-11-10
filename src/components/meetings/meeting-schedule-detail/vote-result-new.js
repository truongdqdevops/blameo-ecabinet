import React, { Component } from "react";
import { connect } from "react-redux";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { PieChart } from "react-native-svg-charts";
import { Row, Rows, Table } from "react-native-table-component";
import Modal from "react-native-modal";
import {
  Collapse,
  CollapseBody,
  CollapseHeader
} from "accordion-collapse-react-native";
import {
  getCResultBySubjectId,
  getCResultBySubjectId_2,
  getListMemById
} from "../../../redux/actions/meetings.action";
import CustomHeader from "../../../assets/components/header";
import {
  ANSWER_TYPE,
  LIST_PROPS_VOTE_RESULT_YESNO,
  LIST_VOTE_RESULT,
  OBJECT_RESPONSE_VOTE_RESULT,
  PARTICIPANT_STATUS,
  SUBJECT_TYPES,
  VOTE_TYPE
} from "../const";
import styles from "./style";

class VoteResult extends Component {
  constructor(props) {
    super(props);
    const { width, height } = Dimensions.get("window");
    this.state = {
      width,
      height,
      dataPieChart: [],
      totalValue: 0,
      labelArr: [],
      headerTable: ["STT", "Họ tên - Chức vụ"],
      headerTableYKienKhac: ["STT", "Người nêu ý kiến", "Ý kiến"],
      headerTableResult: ["STT", "Phương án", "Kết quả"],
      dataTableYKienKhac: [],
      dataTableResult: [],
      strAnswered: "",
      isMultipleSelect: false
    };
  }

  componentDidMount() {
    this.setState({ loadingGetVoteResult: true }, () => {
      setTimeout(async () => {
        const { subjectId, conferenceId } = this.props;
        await Promise.all([
          // this.props.getCResultBySubjectId({ subjectId }),
          this.props.getCResultBySubjectId_2({ conferenceId, subjectId }),
          this.props.getListMemById({ conferenceId })
        ]);
        const {
          listMems = [],
          issue = {},
          permissionViewResult,
          resultCBySubjectId_2: data = {}
        } = this.props;

        this.setState({ isMultipleSelect: data.isMultipleSelect });
        this.setState({ loadingGetVoteResult: false });
        if (data.isMultipleSelect) {
          this.drawTableResult(
            data.inventorySubjectEntity,
            data.conferenceFileResultItemEntity
          );
          if (permissionViewResult) {
            this.renderDataTable(data.conferenceFileResultItemEntity);
          }
        } else {
          const listMemsJoined =
            listMems.filter(
              element => PARTICIPANT_STATUS.JOIN === element.status
            ) || [];
          const totalJoined = listMemsJoined.length;
          const { countAnswer = 0, subjectType = "", type = "" } = issue;
          const isWithOut = type === SUBJECT_TYPES.WITHOUT;
          const voteDone = countAnswer >= totalJoined;

          this.setState({
            strAnswered: data?.inventorySubjectEntity?.strAnswered || "",
            loadingGetVoteResult: false
          });
          this.renderDataPieChart(
            data.conferenceFileResultItemEntity,
            subjectType,
            isWithOut
          );
          if (permissionViewResult) {
            this.renderDataTable(data.conferenceFileResultItemEntity);
          }
        }
        this.setState({ loadingGetVoteResult: false });
      }, 500);
    });
  }

  renderDataPieChart = (data, type, isWithOut) => {
    const dataP = [];
    let total = 0;
    const labelArr = [];
    if (type === VOTE_TYPE.YESNO) {
      const arrProps = Object.keys(LIST_PROPS_VOTE_RESULT_YESNO);
      arrProps.forEach((element, index) => {
        const dataElement = data[element];
        let amount = 0;
        if (isWithOut) {
          amount = dataElement.length > 0 ? dataElement[0].answer : 0;
        } else {
          amount = dataElement.length > 0 ? dataElement.length : 0;
        }

        total += amount;
        dataP.push({
          key: index,
          amount,
          svg: {
            fill: colorSlide[index]
          }
        });
        element !== ANSWER_TYPE.PHUONG_AN_KHAC &&
          labelArr.push(
            <View key={(index + 1).toString()} style={styles.itemDetailVote}>
              <View
                style={[
                  styles.colorItem,
                  { backgroundColor: colorSlide[index] }
                ]}
              />
              <Text>{`${LIST_PROPS_VOTE_RESULT_YESNO[element]}: ${amount}`}</Text>
            </View>
          );
      });
    } else {
      const arrProps = Object.keys(data);
      const indexPhuongAnKhac =
        arrProps?.indexOf(ANSWER_TYPE.PHUONG_AN_KHAC) || "";
      const indexChuaTraLoi = arrProps?.indexOf(ANSWER_TYPE.CHUA_TRA_LOI) || "";

      if (indexPhuongAnKhac !== -1 && indexChuaTraLoi !== -1) {
        [arrProps[indexPhuongAnKhac], arrProps[indexChuaTraLoi]] = [
          arrProps[indexChuaTraLoi],
          arrProps[indexPhuongAnKhac]
        ];
      }
      arrProps.forEach((element, index, key) => {
        if (element && element !== ANSWER_TYPE.Y_KIEN_KHAC) {
          const dataElement = data[element];
          let title = "";

          let amount = 0;
          if (isWithOut) {
            amount = dataElement.length > 0 ? dataElement[0].answer : 0;
          } else {
            amount = dataElement.length > 0 ? dataElement.length : 0;
          }
          if (element.match(/^\d+$/)) {
            title = dataElement[0].title;
            amount--;
          }
          if (element) {
            total += amount;
            dataP.push({
              key: index,
              amount,
              svg: {
                fill: colorSlide[index]
              }
            });
            labelArr.push(
              <View key={(index + 1).toString()} style={styles.itemDetailVote}>
                {element && (
                  <View
                    style={[
                      styles.colorItem,
                      { backgroundColor: colorSlide[index] }
                    ]}
                  />
                )}

                {element.match(/^\d+$/) && title !== "" && (
                  <Text ellipsizeMode="tail">{`${title}: ${amount}`}</Text>
                )}
                {element === ANSWER_TYPE.PHUONG_AN_KHAC && (
                  <Text>{`Phương án khác: ${amount}`}</Text>
                )}
                {element === ANSWER_TYPE.CHUA_TRA_LOI && (
                  <Text>{`Chưa trả lời: ${amount}`}</Text>
                )}
              </View>
            );
          }
        }
      });
    }
    this.setState({
      dataPieChart: dataP,
      totalValue: total,
      labelArr
    });
  };

  drawTableResult = (data, dataConferenceFileResultItemEntity) => {
    const dataTableResult = [];
    data.listItem.forEach((element, index) => {
      const { title = "", strRatio = "", countSelected = 0 } = element;
      const itemData = [
        <Text style={{ textAlign: "center", textAlignVertical: "center" }}>
          {index + 1}
        </Text>,
        <Text style={styles.contentTableText}>{`${title}`}</Text>,
        <Text
          style={{ textAlign: "center" }}
        >{`${countSelected}(${strRatio})`}</Text>
      ];
      dataTableResult.push(itemData);
    });

    this.setState({
      dataTableResult: dataTableResult,
      strAnswered: data.strAnswered
    });
  };

  renderDataTable = data => {
    const allData = [];
    const dataTableYKienKhac = [];
    const {
      issue: { subjectType }
    } = this.props;
    Object.keys(data).forEach(key => {
      const dataChild = data[key] || [];
      let checkYesNo = false;
      dataChild.forEach(e => {
        const { no = "", subjectItemId = "" } = e;
        if (no === 1 || subjectItemId === 1) {
          checkYesNo = true;
        }
      });
      if (key === OBJECT_RESPONSE_VOTE_RESULT.Y_KIEN_KHAC) {
        dataChild.forEach((element, index) => {
          const stt = index + 1;
          const { content = "", positionName = "" } = element;
          const itemData = [
            <Text style={{ textAlign: "center", textAlignVertical: "center" }}>
              {stt}
            </Text>,
            <Text style={styles.contentTableText}>{positionName}</Text>,
            <Text style={styles.contentTableText}>{content}</Text>
          ];
          dataTableYKienKhac.push(itemData);
        });
      } else if (key.match(/^\d+$/)) {
        allData.push(this.getDataOneTable(data, key));
      }
    });
    this.setState({
      dataTableYKienKhac,
      otherCommentLength: dataTableYKienKhac.length
    });
    allData.push(this.getDataOneTable(data, OBJECT_RESPONSE_VOTE_RESULT.YES));
    if (subjectType !== VOTE_TYPE.YESNO) {
      allData.push(
        this.getDataOneTable(data, OBJECT_RESPONSE_VOTE_RESULT.PHUONG_AN_KHAC)
      );
      allData.push(
        this.getDataOneTable(data, OBJECT_RESPONSE_VOTE_RESULT.CHUA_TRA_LOI)
      );
      allData.push(
        this.getDataOneTable(data, OBJECT_RESPONSE_VOTE_RESULT.Y_KIEN_KHAC)
      );
    } else {
      allData.push(
        this.getDataOneTable(data, OBJECT_RESPONSE_VOTE_RESULT.Y_KIEN_KHAC)
      );
      allData.push(
        this.getDataOneTable(data, OBJECT_RESPONSE_VOTE_RESULT.CHUA_TRA_LOI)
      );
    }
    this.setState({
      allData
    });
  };

  getDataOneTable = (data, key) => {
    if (!data[key]) return null;
    const dataChild = key ? data[key] : data;
    const dataTable = [];
    const {
      headerTable,
      otherCommentLength = 0,
      headerTableYKienKhac,
      dataTableYKienKhac
    } = this.state;
    let titleHeader = "";
    dataChild.forEach((element, index) => {
      if (index < 1) {
        if (key.match(/^\d+$/)) {
          titleHeader = dataChild[0].title;
          return;
        }
      }
      const stt = titleHeader !== "" ? index : index + 1;
      const { positionName = "" } = element;
      const itemData = [
        <Text style={{ textAlign: "center", textAlignVertical: "center" }}>
          {stt}
        </Text>,
        <Text style={styles.contentTableText}>{positionName}</Text>
      ];
      dataTable.push(itemData);
    });
    const labelHeader = this.getLabelCollapseHeader(key, titleHeader);
    const countAnswer =
      titleHeader !== "" ? dataChild.length - 1 : dataChild.length;
    let collapseData;

    if (key === OBJECT_RESPONSE_VOTE_RESULT.Y_KIEN_KHAC) {
      collapseData = (
        <Collapse style={{ marginBottom: 10 }}>
          <CollapseHeader>
            <View style={styles.headerCollapse}>
              <Text style={styles.headerCollapseText}>
                {`Ý kiến khác (${otherCommentLength})`}
              </Text>
            </View>
          </CollapseHeader>

          <CollapseBody style={{ marginVertical: 5 }}>
            <Table borderStyle={{ borderWidth: 1, borderColor: "#707070" }}>
              <Row
                flexArr={[2, 9, 9]}
                data={headerTableYKienKhac}
                style={styles.headerTable}
                textStyle={styles.headerTableText}
              />
              <Rows
                flexArr={[2, 9, 9]}
                data={dataTableYKienKhac}
                style={styles.contentTable}
              />
            </Table>
          </CollapseBody>
        </Collapse>
      );
    } else {
      collapseData = (
        <Collapse style={{ marginBottom: 10 }} key={key}>
          <CollapseHeader>
            <View style={styles.headerCollapse}>
              <Text style={styles.headerCollapseText}>
                {`${labelHeader} (${countAnswer})`}
              </Text>
            </View>
          </CollapseHeader>
          <CollapseBody style={{ marginVertical: 5 }}>
            <Table borderStyle={{ borderWidth: 1, borderColor: "#707070" }}>
              <Row
                flexArr={[2, 7]}
                data={headerTable}
                style={styles.headerTable}
                textStyle={styles.headerTableText}
              />
              <Rows
                flexArr={[2, 7]}
                data={dataTable}
                style={styles.contentTable}
              />
            </Table>
          </CollapseBody>
        </Collapse>
      );
    }
    return collapseData;
  };

  getLabelCollapseHeader = (value, titleHeader) => {
    if (titleHeader !== "") return titleHeader;
    else {
      if (value.match(/^\d+$/)) {
        return `${LIST_VOTE_RESULT.PHUONG_AN} ${value}`;
      }
      return LIST_VOTE_RESULT[value];
    }
  };

  render() {
    const {
      width,
      height,
      dataPieChart,
      totalValue,
      labelArr,
      notComplete,
      headerTableYKienKhac = [],
      headerTableResult = [],
      dataTableYKienKhac = [],
      otherCommentLength = 0,
      loadingGetVoteResult = true,
      dataTableResult = [],
      strAnswered = "0/0",
      isMultipleSelect
    } = this.state;
    const {
      isVisible = false,
      toggleModal,
      issue,
      permissionViewResult
    } = this.props;
    const { title = "", type = "", subjectType = "" } = issue;

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
        style={{ width, marginTop: 0, marginLeft: 0 }}
      >
        <View
          style={[
            { backgroundColor: "#ebeff5" },
            loadingGetVoteResult
              ? { height: height * 0.3 }
              : { height: height * 0.9 }
          ]}
        >
          <CustomHeader
            title={"Kết quả biểu quyết"}
            haveClose
            haveEmail={false}
            style={[{ marginTop: 30 }]}
            onClose={toggleModal}
          />
          {loadingGetVoteResult ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size={"large"} color={"#316ec4"} />
            </View>
          ) : (
            <View>
              {/* {notComplete ? (
                                <View>
                                    <Text style={{ textAlign: 'center', fontSize: 15, paddingTop: 20, paddingHorizontal: 12 }}>{notComplete}</Text>
                                    <View style={[styles.buttonOKContainer, styles.flexRow]}>
                                        <TouchableOpacity
                                            style={{ backgroundColor: '#316ec4', borderRadius: 4, width: width * 0.38 }}
                                            onPress={toggleModal}
                                        >
                                            <Text style={{ color: '#fff', paddingVertical: 8, textAlign: 'center' }}>{'OK'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) :  */}

              {/* ( */}
              <View
                style={{
                  paddingBottom: 10,
                  height: width > "85%" ? height : "95%"
                }}
              >
                <Text style={{ fontSize: 16, padding: 8, paddingLeft: 20 }}>
                  <Text style={{ fontWeight: "bold" }}>{title}</Text>
                </Text>
                {subjectType !== VOTE_TYPE.OPTION_2 && (
                  <Text
                    style={styles.textVoted}
                  >{`Đã bỏ phiếu: ${strAnswered}`}</Text>
                )}
                <TouchableWithoutFeedback>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {!isMultipleSelect ? (
                      <View
                        style={{
                          flexDirection: width > height ? "row" : "column",
                          justifyContent:
                            width > height ? "space-evenly" : "center",
                          alignItems: "center",
                          alignSelf: "stretch",
                          marginBottom: 15
                        }}
                      >
                        <PieChart
                          style={styles.pieChart}
                          valueAccessor={({ item }) => item.amount}
                          data={dataPieChart}
                          spacing={0}
                          outerRadius={"95%"}
                          innerRadius={"55%"}
                          padAngle={0}
                        />

                        <View style={{ marginTop: 20, alignItems: "center" }}>
                          {/* <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                                                        <Text style={{ fontSize: 16 }}>{'Tổng số: '}</Text>
                                                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{totalValue}</Text>
                                                        <Text style={{ fontSize: 16 }}>{` ${'(phiếu)'}`}</Text>
                                                    </View> */}
                          <View>{labelArr}</View>
                        </View>
                      </View>
                    ) : (
                      <View>
                        <Text
                          style={styles.textVoted}
                        >{`Đã bỏ phiếu: ${strAnswered}`}</Text>
                        <View style={styles.tableResultVote}>
                          <Table>
                            <Row
                              flexArr={[2, 9, 3]}
                              data={headerTableResult}
                              style={{ backgroundColor: "#fff" }}
                              textStyle={styles.headerTableText}
                            />
                            <Rows
                              flexArr={[2, 9, 3]}
                              data={dataTableResult}
                              style={{ backgroundColor: "#FFF" }}
                            />
                          </Table>
                        </View>
                        <View>{labelArr}</View>
                      </View>
                    )}
                    {permissionViewResult && type !== SUBJECT_TYPES.WITHOUT && (
                      // {type !== SUBJECT_TYPES.WITHOUT && (
                      <View style={{ paddingHorizontal: 10 }}>
                        {this.state.allData || null}
                      </View>
                    )}
                  </ScrollView>
                </TouchableWithoutFeedback>
              </View>
              {/* ) */}
              {/* } */}
            </View>
          )}
        </View>
      </Modal>
    );
  }
}

const colorSlide = [
  "#316ec4",
  "#e34141",
  "#fba500",
  "#21a465",
  "#30ad23",
  "#c62d64",
  "#fab368",
  "#7fbf7f",
  "#97cae0",
  "#559fa2",
  "#edca98",
  "#95ecbe",
  "#a6b896",
  "#a7e7d1",
  "#fff3c3",
  "#911eb4",
  "#f032e6",
  "e6beff"
];

const mapStateToProps = state => {
    return {
        error: state.ErrorReducer.error,
        resultCBySubjectId: state.MeetingReducer.resultCBySubjectId,
        resultCBySubjectId_2: state.MeetingReducer.resultCBySubjectId_2,
        listMems: state.MeetingReducer.listMems
    };
};

export default connect(mapStateToProps, {
    getCResultBySubjectId,
    getCResultBySubjectId_2,
    getListMemById
})(VoteResult);
