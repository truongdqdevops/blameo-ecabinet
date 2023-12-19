import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Table, Rows } from "react-native-table-component";
import { PieChart } from "react-native-svg-charts";
import IconB from "react-native-vector-icons/FontAwesome";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import { getResultBySubject } from "../../redux/actions/feedback.action";
import stylesCommon from "../../assets/css/style-common";
import { Constants } from "../../assets/utils/constants";
import { TYPE_LABEL } from "./constant";
import ModalDropdown from "react-native-modal-dropdown";
import IconC from "react-native-vector-icons/AntDesign";
import { Text as SvgText } from "react-native-svg";

const dataDropDown = {
  all: "Tính trên tổng phiếu đã gửi",
  answer: "Tính trên tổng phiếu trả lời",
};

const NOT_ANSWER_SYMBOL = "CHUA_TRA_LOI";
const NO_SYMBOL = "NO";
const YES_SYMBOL = "YES";
const OTHER_ANSWER_SYMBOL = "PHUONG_AN_KHAC";
const OTHER_COMMENT_SYMBOL = "Y_KIEN_KHAC";

const FIXED_SYMBOL = [
  NOT_ANSWER_SYMBOL,
  NO_SYMBOL,
  YES_SYMBOL,
  OTHER_ANSWER_SYMBOL,
  OTHER_COMMENT_SYMBOL,
];

const FIXED_INDEX_SYMBOL = {
  [YES_SYMBOL]: 996,
  [NO_SYMBOL]: 997,
  [OTHER_ANSWER_SYMBOL]: 998,
  [NOT_ANSWER_SYMBOL]: 999,
  [OTHER_COMMENT_SYMBOL]: 1000,
};

class FeedbackResultDetail extends Component {
  constructor(props) {
    super(props);
    const { width } = Dimensions.get("window");

    this.state = {
      width,
      listDataTable: {},
      containerDataTable: [],
      dataPieChart: [],
      containerPieChart: [],
      substitute: dataDropDown.all,
      pieChart: [],
      infoData: [],
    };
  }

  componentDidMount = async () => {
    await this.props.getResultBySubject({
      fileId: this.props.fileId,
      subjectId: this.props.subjectId,
    });
    this.renderItems(dataDropDown.all);
  };
  _renderRight() {
    const { width } = Dimensions.get("window");
    return (
      <View
        style={{ marginLeft: 5, position: "absolute", right: width * 0.15 }}
      >
        <IconC name="caretdown" size={16} color="#2c64b8" />
      </View>
    );
  }

  _dropdown_2_renderRow(rowData, rowID, highlighted) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState(
            {
              substitute: rowData,
              messageValidate: "",
            },
            () => {
              this.refs.dropdown_2.hide();
              this.renderItems(rowData);
            }
          );
        }}
        underlayColor="cornflowerblue"
      >
        <View style={[styles.dropdown_2_row, { backgroundColor: "white" }]}>
          <Text
            style={[
              styles.dropdown_2_row_text,
              highlighted && { color: "#2c64b8" },
            ]}
          >
            {rowData?.length > 35 ? rowData.slice(0, 35) + "..." : rowData}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  isFixedLabel = (key) => FIXED_SYMBOL.includes(key);

  getLegendLabelByKey = (key) => `Phương án ${key}`;

  buildInfoItem = (value = []) => {
    if (value.length === 0) {
      return [
        [
          <Text style={{ textAlign: "center", color: "grey" }}>
            Không có bản ghi
          </Text>,
        ],
      ];
    }
    return value.map((element, index) => {
      const stt = index + 1;
      const { positionName = "", fullName = "" } = element;
      return [
        <Text style={{ textAlign: "center", color: "black" }}>{stt}</Text>,
        <Text style={[styles.contentTableText, { textAlign: "left" }]}>
          {positionName} {fullName}
        </Text>,
      ];
    });
  };

  buildRowInfo = (value, label, color) => {
    return (
      <View style={{ padding: 10 }}>
        <View
          style={{
            backgroundColor: color,
            flexDirection: "row",
            alignItems: "center",
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            padding: 5,
            justifyContent: "center",
          }}
        >
          <Text
            style={[
              styles.normalTxt,
              {
                fontWeight: "bold",
                color: "white",
              },
            ]}
          >
            {`${value.length} người chọn ${label}`}
          </Text>
        </View>

        <View>
          <Table borderStyle={{ borderWidth: 1, borderColor: "black" }}>
            <Rows
              flexArr={[1, 9]}
              data={this.buildInfoItem(value)}
              style={styles.contentTable}
            />
          </Table>
        </View>
      </View>
    );
  };

  isFilterVotesSent = (type) => type === dataDropDown.all;

  orderObjectData = (inputData) => {
    let obj = {};
    const orderKeys = [];
    Object.keys(inputData).forEach((key) => {
      if (this.isFixedLabel(key)) {
        orderKeys.push({
          key,
          order: FIXED_INDEX_SYMBOL[key],
        });
      } else {
        orderKeys.push({
          key,
          order: parseInt(key),
        });
      }
    });

    orderKeys.sort((a, b) => a.order - b.order);

    orderKeys.forEach(({ key }) => {
      obj[key] = inputData[key];
    });

    return obj;
  };

  mapperVotesAnswered = (inputData) => {
    const pieChart = [];
    const infoData = [];

    const ignoreKeys = [NOT_ANSWER_SYMBOL, OTHER_COMMENT_SYMBOL];
    Object.entries(this.orderObjectData(inputData)).forEach(
      ([key, value], index) => {
        const color = Constants.COLOR_LIST[index];
        const label = this.isFixedLabel(key)
          ? TYPE_LABEL[key]
          : this.getLegendLabelByKey(key);
        const amount = value.length;

        const isIgnore = ignoreKeys.includes(key) || amount === 0;

        if (!isIgnore) {
          pieChart.push({
            key,
            label,
            amount,
            color,
            svg: {
              fill: color,
            },
          });
          infoData.push(this.buildRowInfo(value, label, color));
        }
      }
    );

    return {
      pieChart,
      infoData,
    };
  };

  mapperVotesSent = (inputData) => {
    const pieChart = [];
    const infoData = [];
    Object.entries(this.orderObjectData(inputData)).forEach(
      ([key, value], index) => {
        const color = Constants.COLOR_LIST[index];
        const label = this.isFixedLabel(key)
          ? TYPE_LABEL[key]
          : this.getLegendLabelByKey(key);
        const amount = value.length;

        if (key !== OTHER_COMMENT_SYMBOL) {
          pieChart.push({
            key,
            label,
            amount,
            color,
            svg: {
              fill: color,
            },
          });
        }
        infoData.push(this.buildRowInfo(value, label, color));
      }
    );

    return {
      pieChart,
      infoData,
    };
  };

  buildLegend = (data = []) => {
    return data.map(({ key, label, amount, color }) => (
      <View key={key} style={styles.itemDetailVote}>
        <View style={[styles.colorItem, { backgroundColor: color }]} />
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
          {`${label} (${amount})`}
        </Text>
      </View>
    ));
  };

  buildPieChart = () => {
    const containerPieChart = [];
    const { width, pieChart, infoData } = this.state;
    const dataAvailable = pieChart.some((item) => item.amount > 0);

    if (dataAvailable) {
      const Labels = ({ slices }) => {
        const pieData = slices.map((slice, index) => slice.data.amount);

        return slices.map((slice, index) => {
          const { pieCentroid, data } = slice;
          const percentage = (
            (data.amount / pieData.reduce((a, b) => a + b, 0)) *
            100
          ).toFixed(0);

          if (data.amount > 0) {
            return (
              <SvgText
                key={index}
                x={pieCentroid[0]}
                y={pieCentroid[1]}
                fill={"white"}
                textAnchor={"middle"}
                alignmentBaseline={"middle"}
                fontSize={18}
                stroke={"black"}
                strokeWidth={0.2}
                fontWeight={"bold"}
              >
                {`${percentage}%`}
              </SvgText>
            );
          } else {
            return null;
          }
        });
      };

      containerPieChart.push(
        <View key={0}>
          <View
            style={{
              flexDirection: width > height ? "row" : "column",
              justifyContent: width > height ? "space-evenly" : "center",
              alignItems: "center",
              alignSelf: "stretch",
            }}
          >
            <PieChart
              style={styles.pieChart}
              valueAccessor={({ item }) => item.amount}
              data={pieChart}
              spacing={0}
              outerRadius={"95%"}
            >
              <Labels />
            </PieChart>

            <View style={{ marginTop: 10 }}>
              <View>{this.buildLegend(pieChart)}</View>
            </View>
          </View>
          {infoData}
        </View>
      );
    } else {
      containerPieChart.push(
        <View
          key={0}
          style={[stylesCommon.w100, stylesCommon.mt10, stylesCommon.alignCen]}
        >
          <Text>Chưa có kết quả lấy ý kiến cho nội dung này</Text>
        </View>
      );
    }

    this.setState({
      containerPieChart,
    });
  };

  renderItems = (type) => {
    const { infoData, pieChart } = this.isFilterVotesSent(type)
      ? this.mapperVotesSent(this.props.resultBySubject)
      : this.mapperVotesAnswered(this.props.resultBySubject);

    this.setState(
      {
        infoData,
        pieChart,
      },
      () => {
        this.buildPieChart();
      }
    );
  };

  render() {
    const { isVisible = false, toggleModal } = this.props;
    const { containerPieChart } = this.state;

    return (
      <Modal
        animationIn="bounceInDown"
        animationOut="bounceOutUp"
        isVisible={isVisible}
        onBackdropPress={toggleModal}
        backdropColor={"rgb(156,156,156)"}
        animationInTiming={400}
        animationOutTiming={500}
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={500}
        hideModalContentWhileAnimating
        style={{ width, marginLeft: 0 }}
      >
        <View style={{ backgroundColor: "#EBEFF5", height: height * 0.9 }}>
          <View style={{ height: 150 }}>
            <View
              style={{
                backgroundColor: "#326EC4",
                paddingVertical: 8,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <IconB name="times" size={20} color="#326EC4" />
              </View>

              <View>
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: 15,
                  }}
                >
                  KẾT QUẢ LẤY Ý KIẾN CHO TỪNG NỘI DUNG
                </Text>
              </View>

              <View style={{ right: 10 }}>
                <TouchableOpacity
                  style={{ justifyContent: "center", alignItems: "center" }}
                  onPress={toggleModal}
                >
                  <IconB name="times" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={[stylesCommon.row, { padding: 10, flexWrap: "wrap" }]}>
              <View style={{ width: 70 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  Nội dung:
                </Text>
              </View>
              <View style={{ width: width - 135 }}>
                <Text style={{ fontSize: 16 }}>{this.props.title}</Text>
              </View>
            </View>
            {this.state.substitute ? (
              <ModalDropdown
                defaultIndex={-1}
                defaultValue={this.state.substitute}
                ref="dropdown_2"
                options={Object.values(dataDropDown)}
                style={{
                  height: 27,
                }}
                defaultTextStyle={{
                  height: 40,
                  textAlign: "center",
                  paddingTop: 5,
                  paddingRight: 50,
                  paddingLeft: 10,
                  width: width * 0.8,
                  borderWidth: 0.5,
                  marginLeft: width * 0.1,
                }}
                textStyle={styles.dropdown_2_text}
                dropdownStyle={styles.dropdown_2_dropdown}
                renderRightComponent={this._renderRight.bind(this)}
                renderRow={this._dropdown_2_renderRow.bind(this)}
              />
            ) : null}
          </View>
          <ScrollView>{containerPieChart}</ScrollView>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.ErrorReducer.error,
    resultBySubject: state.FeedbackReducer.resultBySubject,
    summaryByFileId: state.FeedbackReducer.summaryByFileId,
    listDonVi: state.AuthenReducer.listDonVi,
  };
};

export default connect(mapStateToProps, { getResultBySubject })(
  FeedbackResultDetail
);

const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
  contentTable: {
    backgroundColor: "white",
    height: 40,
  },
  dropdown_2_text: {
    marginVertical: 10,
    marginHorizontal: 6,
    fontSize: 18,
    color: "#2c64b8",
  },
  dropdown_2_dropdown: {
    width: width * 0.8,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 3,
    marginLeft: width * 0.1,
    height: 85,
  },

  dropdown_2_row: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
  },
  dropdown_2_image: {
    marginLeft: 4,
    width: 30,
    height: 30,
  },
  dropdown_2_row_text: {
    marginHorizontal: 4,
    fontSize: 16,
    color: "navy",
    textAlignVertical: "center",
  },
  dropdown_2_separator: {
    height: 1,
    backgroundColor: "cornflowerblue",
  },
  contentTableText: {
    padding: 5,
    textAlign: "center",
  },
  normalTxt: {
    color: "black",
    fontSize: 15,
  },
  pieChart: {
    height: 200,
    width: 200,
    marginTop: 10,
    alignSelf: "center",
  },
  itemDetailVote: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  colorItem: {
    width: 15,
    height: 15,
    marginRight: 10,
  },
});
