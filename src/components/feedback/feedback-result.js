import React, { Component } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { Row, Rows, Table } from "react-native-table-component";
import { connect } from "react-redux";
import { PERMISSIONS, TYPE_FILE } from "./constant";
import ShowFiles from "../document/show-files";
import {
  getFeedbackById,
  getListFeedback,
  getSummaryById,
  SelectedFeedback
} from "../../redux/actions/feedback.action";
import { checkPermission } from "../../assets/utils/utils";
import MHeader from "../../assets/components/header";
import FeedbackResultDetail from "./feedback-result-detail";
import Loading from "../../assets/components/loading";
import styles from "./styles/feedback-result-style";

class FeedbackResult extends Component {
  constructor(props) {
    super(props);
    // const { width, height } = Dimensions.get('window');

    this.state = {
      tableHead1: [],
      tableHead2: [],
      tableHead3: [],
      tableData1: [],
      tableData2: [],
      tableData3: [],
      isFbReplyVisible: false,
      isDrawerOpen: false,
      isFbReplyDetailVisible: false,
      extraData: {
        loading: false,
        isRefreshing: false
      },
      fileId: 0,
      subjectId: 0,
      contentFileId: 0,
      contentTitle: "",
      scrLoading: true,
      selectedFeedback: {}
    };
  }

  componentDidMount = async () => {
    const { selectedFeedback = {} } = this.props;
    const { fileId } = selectedFeedback;
    console.log("===selectedFeedback: ", selectedFeedback);
    this.renderHeaderTable1();
    this.renderHeaderTable2();
    this.renderHeaderTable3();
    await this.props.getSummaryById({ fileId: fileId });
    this.setState(
      {
        fileId,
        contentTitle: this.props.summaryByFileId.summary[0].title,
        scrLoading: false
      },
      () => {
        this.renderDataTable3(this.props.summaryByFileId);
        this.renderDataTable1(this.props.summaryByFileId);
        this.renderDataTable2(this.props.summaryByFileId);
      }
    );
  };

  toggleModal() {
    this.setState({
      isFbReplyVisible: !this.state.isFbReplyVisible
    });
  }

  renderFooter = () => {
    if (!this.state.extraData.loading) return null;
    return <ActivityIndicator style={{ color: "#000", marginVertical: 10 }} />;
  };

  getMostAnswerSummary = () => {
    const { summaryByFileId = {} } = this.props;
    const { summary = [] } = summaryByFileId;
    let ind = -1;
    summary.forEach((sum, index) => {
      const { items = [], subjectType } = sum;
      if (
        (ind === -1 || items.length > summary[ind].items.length) &&
        subjectType === "OPTION"
      ) {
        ind = index;
      }
    });
    return ind > -1 ? summary[ind] : null;
  };

  renderHeaderTable1() {
    const mostAnswerSummary = this.getMostAnswerSummary();

    let itemData = [];
    let flexArrTable1 = [4, 2, 2, 2];
    let maxLengthItemsOption = 3;

    if (mostAnswerSummary === null) {
      itemData = [
        <Text style={[styles.headerTableText, { textAlign: "left" }]}>
          Nội dung
        </Text>,
        <Text style={styles.headerTableText}>PA 1</Text>,
        <Text style={styles.headerTableText}>PA 2</Text>,
        <Text style={styles.headerTableText}>PA khác</Text>
      ];
    } else {
      const lengthItems = mostAnswerSummary.items.length;
      maxLengthItemsOption =
        maxLengthItemsOption < lengthItems ? lengthItems : maxLengthItemsOption;
      itemData.push(
        <Text style={[styles.headerTableText, { textAlign: "left" }]}>
          Nội dung
        </Text>
      );
      for (let index = 1; index < lengthItems; index += 1) {
        itemData.push(
          <Text style={styles.headerTableText}>{`PA ${index}`}</Text>
        );
      }
      itemData.push(<Text style={styles.headerTableText}>PA khác</Text>);
      if (mostAnswerSummary.items.length > 3) {
        const titleFlex = 45;
        const itemFlex = 120 / lengthItems;
        flexArrTable1 = [titleFlex];
        for (let index = 1; index <= lengthItems; index += 1) {
          flexArrTable1.push(itemFlex);
        }
      }
    }
    this.setState({
      tableHead1: itemData,
      flexArrTable1,
      maxLengthItemsOption
    });
  }

  renderDataTable1 = inputData => {
    const tableData1 = [];
    const { summary = [] } = inputData;
    const { maxLengthItemsOption } = this.state;

    if (summary.length === 0) {
      tableData1.push([
        <Text style={{ textAlign: "center", color: "grey" }}>
          Không có bản ghi
        </Text>
      ]);
    } else {
      summary.forEach(element => {
        if (element.subjectType === "OPTION") {
          const { title = "", items = [], subjectId = 0 } = element;
          const itemData = [
            <Text
              style={{ textAlign: "left", color: "#3127F1" }}
              onPress={() =>
                this.setState({
                  isFbReplyDetailVisible: true,
                  subjectId,
                  contentTitle: title
                })
              }
            >
              {title}
            </Text>
          ];

          for (let index = 0; index < maxLengthItemsOption; index += 1) {
            if (index < items.length) {
              const { no, countItem } = items[index];
              if (no === "PHUONG_AN_KHAC") {
                itemData[maxLengthItemsOption] = (
                  <Text style={styles.contentTableText}>{countItem}</Text>
                );
              } else {
                itemData[no] = (
                  <Text style={styles.contentTableText}>{countItem}</Text>
                );
              }
            } else {
              itemData[index] = <Text style={styles.contentTableText}> </Text>;
            }
          }
          tableData1.push(itemData);
        }
      });
    }

    this.setState({
      tableData1
    });
  };

  renderHeaderTable2() {
    const itemData = [
      <Text style={[styles.headerTableText, { textAlign: "left" }]}>
        Nội dung
      </Text>,
      <Text style={styles.headerTableText}>Đồng ý</Text>,
      <Text style={styles.headerTableText}>Không đồng ý</Text>,
      <Text style={styles.headerTableText}>Phương án khác</Text>
    ];
    this.setState({
      tableHead2: itemData
    });
  }

  renderHeaderTable3() {
    const itemData = [
      <Text style={[styles.headerTableText, { textAlign: "left" }]}>
        Chức vụ
      </Text>,
      <Text style={[styles.headerTableText, { textAlign: "left" }]}>
        Họ và tên
      </Text>,
      <Text style={[styles.headerTableText, { textAlign: "left" }]}>
        Phiếu ghi ý kiến
      </Text>,
      <Text
        style={[styles.headerTableText, { textAlign: "left", paddingLeft: 5 }]}
      >
        Ngày gửi
      </Text>
    ];
    this.setState({
      tableHead3: itemData
    });
  }

  // handleRotate = event => {
  //     const { nativeEvent: { layout: { width, height } = {} } = {} } = event;
  //     this.setState({
  //         width,
  //         height
  //     });
  // };

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

  renderDataTable3 = inputData => {
    const tableData3 = [];
    const { member = [] } = inputData;
    const permissionResult = checkPermission(PERMISSIONS.XEM_KQ_PLYK);

    member.forEach((element, index) => {
      const stt = index + 1;
      const {
        fullName = "",
        positionName = "",
        attachmentName = "",
        strModifiedDate = "",
        attachmentId = "",
        userId = ""
      } = element;
      let fileName;
      if (this.props.selectedFeedback?.voteType?.code === TYPE_FILE.KIN) {
        if (permissionResult || this.props.userInfo.appUser.id === userId) {
          fileName = (
            <Text
              style={[
                styles.contentTableText,
                { color: "#3127F1", textAlign: "left" }
              ]}
              onPress={() =>
                this.setState({
                  isVisibleShowFile: true,
                  contentFileId: attachmentId
                })
              }
            >
              {attachmentName}
            </Text>
          );
        }
      }
      if (this.props.selectedFeedback?.voteType?.code === TYPE_FILE.CONG_KHAI) {
        fileName = (
          <Text
            style={[
              styles.contentTableText,
              { color: "#3127F1", textAlign: "left" }
            ]}
            onPress={() =>
              this.setState({
                isVisibleShowFile: true,
                contentFileId: attachmentId
              })
            }
          >
            {attachmentName}
          </Text>
        );
      }
      const itemData = [
        <Text style={{ textAlign: "left" }}>
          {`${stt}.` + ` ${positionName}`}
        </Text>,
        <Text style={[styles.contentTableText, { textAlign: "left" }]}>
          {fullName}
        </Text>,
        fileName,
        <Text style={{ paddingLeft: 10 }}>{strModifiedDate}</Text>
      ];
      tableData3.push(itemData);
    });

    if (tableData3.length === 0) {
      tableData3.push([
        <Text style={{ textAlign: "center", color: "grey" }}>
          Không có bản ghi
        </Text>
      ]);
    }

    this.setState({
      tableData3
    });
  };

  renderDataTable2 = inputData => {
    const tableData2 = [];
    const { summary = [] } = inputData;
    summary.forEach(element => {
      if (element.subjectType === "YESNO") {
        const { title = "", items = [], subjectId = 0 } = element;
        const itemAnother = items.find(item => item.no === "ANOTHER");
        const itemNo = items.find(item => item.no === "NO");
        const itemYes = items.find(item => item.no === "YES");
        const itemData = [
          <Text
            style={{ textAlign: "left", color: "#3127F1" }}
            onPress={() =>
              this.setState({
                isFbReplyDetailVisible: true,
                subjectId,
                contentTitle: title
              })
            }
          >
            {title}
          </Text>,
          <Text style={styles.contentTableText}>{itemYes?.countItem ?? 0}</Text>,
          <Text style={styles.contentTableText}>{itemNo?.countItem ?? 0}</Text>,
          <Text style={styles.contentTableText}>{itemAnother?.countItem ?? 0}</Text>
        ];
        tableData2.push(itemData);
      }
    });

    if (tableData2.length === 0) {
      tableData2.push([
        <Text style={{ textAlign: "center", color: "grey" }}>
          Không có bản ghi
        </Text>
      ]);
    }

    this.setState({
      tableData2
    });
  };

  render() {
    const {
      isFbReplyDetailVisible = false,
      isVisibleShowFile = false,
      contentFileId = 0,
      flexArrTable1 = [],
      tableHead1 = [],
      tableHead2 = [],
      tableHead3 = [],
      tableData1 = [],
      tableData2 = [],
      tableData3 = [],
      subjectId = 0,
      fileId = 0,
      contentTitle
    } = this.state;

    return (
      <View style={styles.container}>
        <MHeader
          title="KẾT QUẢ PHIẾU LẤY Ý KIẾN"
          haveClose
          onClose={() =>
            this.props.navigation.navigate("FeedbackScreen", { fileId })
          }
        />

        <View style={styles.subContainer}>
          <ScrollView>
            <TouchableWithoutFeedback>
              <View>
                <View style={{ padding: 10 }}>
                  <View
                    style={{
                      borderBottomColor: "#cccccc",
                      borderBottomWidth: 1,
                      backgroundColor: "#DADDE2"
                    }}
                  >
                    <Text style={[styles.normalTxt, { fontWeight: "bold" }]}>
                      Các nội dung lấy ý kiến theo phương án
                    </Text>
                  </View>

                  <View style={{ marginTop: 7 }}>
                    <Table>
                      <Row
                        flexArr={flexArrTable1}
                        data={tableHead1}
                        style={styles.headerTable}
                        textStyle={styles.headerTableText}
                      />
                      <Rows
                        flexArr={flexArrTable1}
                        data={tableData1}
                        style={styles.contentTable}
                      />
                    </Table>
                  </View>
                </View>

                <View style={{ padding: 10 }}>
                  <View
                    style={{
                      borderBottomColor: "#cccccc",
                      borderBottomWidth: 1,
                      backgroundColor: "#DADDE2"
                    }}
                  >
                    <Text
                      style={[
                        styles.normalTxt,
                        {
                          fontWeight: "bold"
                        }
                      ]}
                    >
                      Các nội dung lấy ý kiến đồng ý/không đồng ý
                    </Text>
                  </View>

                  <View style={{ marginTop: 7 }}>
                    <Table>
                      <Row
                        flexArr={[4, 2, 2, 2]}
                        data={tableHead2}
                        style={styles.headerTable}
                        textStyle={styles.headerTableText}
                      />
                      <Rows
                        flexArr={[4, 2, 2, 2]}
                        data={tableData2}
                        style={styles.contentTable}
                      />
                    </Table>
                  </View>
                </View>

                <View style={{ padding: 10 }}>
                  <View
                    style={{
                      borderBottomColor: "#cccccc",
                      borderBottomWidth: 1,
                      backgroundColor: "#DADDE2"
                    }}
                  >
                    <Text
                      style={[
                        styles.normalTxt,
                        {
                          fontWeight: "bold"
                        }
                      ]}
                    >
                      {/* Danh sách Thành viên UBND */}
                      Danh sách thành viên
                    </Text>
                  </View>

                  <View style={{ marginTop: 7 }}>
                    <Table>
                      <Row
                        flexArr={[3, 3, 2, 2]}
                        data={tableHead3}
                        style={styles.headerTable}
                        textStyle={styles.headerTableText}
                      />
                    </Table>
                    <ScrollView>
                      <TouchableWithoutFeedback>
                        <Table>
                          <Rows
                            flexArr={[3, 3, 1.5, 2.5]}
                            data={tableData3}
                            style={styles.contentTable}
                          />
                        </Table>
                      </TouchableWithoutFeedback>

                      {isVisibleShowFile && (
                        <ShowFiles
                          isVisible
                          title={"Nội dung tài liệu"}
                          fileId={contentFileId}
                          toggleModal={() =>
                            this.setState({ isVisibleShowFile: false })
                          }
                        />
                      )}
                    </ScrollView>
                  </View>

                  {isFbReplyDetailVisible && (
                    <FeedbackResultDetail
                      width={width}
                      height={height}
                      isVisible={isFbReplyDetailVisible}
                      subjectId={subjectId}
                      fileId={fileId}
                      title={contentTitle}
                      toggleModal={() =>
                        this.setState({ isFbReplyDetailVisible: false })
                      }
                    />
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>

          <Loading loading={this.state.scrLoading} />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
    return {
        error: state.ErrorReducer.error,
        selectedFeedback: state.FeedbackReducer.selectedFeedback,
        summaryByFileId: state.FeedbackReducer.summaryByFileId,
        totalFeedback: state.FeedbackReducer.totalFeedback,
        userInfo: state.AuthenReducer.userInfo
    };
};

export default connect(
    mapStateToProps,
    {SelectedFeedback, getListFeedback, getFeedbackById, getSummaryById}
)(FeedbackResult);

const {height, width} = Dimensions.get('window');
