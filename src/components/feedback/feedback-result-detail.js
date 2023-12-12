/* eslint-disable no-restricted-syntax */

import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {Table, Rows} from 'react-native-table-component';
import {PieChart} from 'react-native-svg-charts';
import IconB from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import {getResultBySubject} from '../../redux/actions/feedback.action';
import stylesCommon from '../../assets/css/style-common';
import {Constants} from '../../assets/utils/constants';
import {TYPE_LABEL} from './constant';
import ModalDropdown from 'react-native-modal-dropdown';
import IconC from 'react-native-vector-icons/AntDesign';
import {Text as SvgText} from 'react-native-svg';

const dataDropDown = {
  all: 'Tính trên tổng phiếu đã gửi',
  answer: 'Tính trên tổng phiếu trả lời',
};

class FeedbackResultDetail extends Component {
  constructor(props) {
    super(props);
    const {width} = Dimensions.get('window');

    this.state = {
      width,
      listDataTable: {},
      containerDataTable: [],
      dataPieChart: [],
      containerPieChart: [],
      substitute: dataDropDown.all,
    };
  }

  componentDidMount = async () => {
    await this.props.getResultBySubject({
      fileId: this.props.fileId,
      subjectId: this.props.subjectId,
    });
    this.renderDataPieChart(this.props.resultBySubject);
    this.renderDataTable(this.props.resultBySubject);
    this.renderItems(this.props.resultBySubject);
  };
  _renderRight() {
    const {width, height} = Dimensions.get('window');
    return (
      <View style={{marginLeft: 5, position: 'absolute', right: width * 0.15}}>
        <IconC name='caretdown' size={16} color='#2c64b8' />
      </View>
    );
  }

  _dropdown_2_renderButtonText(rowData) {
    // const {name} = rowData;
    return `${rowData}`;
  }

  _dropdown_2_renderRow(rowData, rowID, highlighted) {
    let evenRow = rowID % 2;
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState(
            {
              substitute: rowData,
              messageValidate: '',
            },
            () => {
              this.refs.dropdown_2.hide();
              this.clickDropDown(this.props.resultBySubject, rowData);
            },
          );
        }}
        underlayColor='cornflowerblue'
      >
        <View style={[styles.dropdown_2_row, {backgroundColor: 'white'}]}>
          <Text
            style={[
              styles.dropdown_2_row_text,
              highlighted && {color: '#2c64b8'},
            ]}
          >
            {rowData?.length > 35 ? rowData.slice(0, 35) + '...' : rowData}
            {/* {`${rowData.name}`} */}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  clickDropDown = (inputData, dataRow) => {
    const data = [];
    let number = 0;
    for (const [key, value] of Object.entries(inputData)) {
      number += 1;
      if (![TYPE_LABEL.Y_KIEN_KHAC].includes(TYPE_LABEL[key])) {
        data.push({
          key,
          amount: value.length,
          svg: {
            fill: Constants.COLOR_LIST[number - 1],
          },
        });
      }
    }
    const nativeData = [...data];
    if (dataRow === dataDropDown.all) {
      const findSubject = this.props?.summaryByFileId?.summary?.find(
        (i) => i?.subjectId === this?.props?.subjectId,
      );
      if (findSubject) {
        const totalMember = findSubject.totalMembers;
        const countTotalAnswer = data.reduce((a, b) => a + b.amount, 0);
        console.log('bb countTotalAnswer', countTotalAnswer);
        console.log('bb data dataPieChart', data);
        this.setState(
          {
            dataPieChart: [
              ...nativeData,
              {
                key: 9999,
                amount: totalMember - countTotalAnswer,
                svg: {
                  fill: 'gray',
                },
              },
            ],
            containerPieChart: [...this.state.containerPieChart],
          },
          () => {
            this.renderItems(this.props.resultBySubject);
          },
        );
      }
    } else {
      console.log('bb data dataPieChart 2', nativeData);
      this.setState(
        {
          dataPieChart: [...nativeData],
          containerPieChart: [...this.state.containerPieChart],
        },
        () => {
          this.renderItems(this.props.resultBySubject);
        },
      );
    }
  };

  renderDataPieChart = (inputData) => {
    const data = [];
    let number = 0;
    const listDataTable = {};
    const labelArr = [];

    for (const [key, value] of Object.entries(inputData)) {
      number += 1;
      if (![TYPE_LABEL.Y_KIEN_KHAC].includes(TYPE_LABEL[key])) {
        data.push({
          key,
          amount: value.length,
          svg: {
            fill: Constants.COLOR_LIST[number - 1],
          },
        });
      }

      if (![TYPE_LABEL.Y_KIEN_KHAC].includes(TYPE_LABEL[key])) {
        const isNotAnswer = TYPE_LABEL[key] === TYPE_LABEL.CHUA_TRA_LOI
        if (Number.isInteger(parseInt(key, 10))) {
          TYPE_LABEL[key] = `Phương án ${key}`;
        }
        labelArr.push(
          <View key={key} style={styles.itemDetailVote}>
            <View
              style={[
                styles.colorItem,
                {backgroundColor: isNotAnswer ? 'gray' : Constants.COLOR_LIST[number - 1]},
              ]}
            />
            <Text style={{fontSize: 15, fontWeight: 'bold'}}>
              {`${TYPE_LABEL[key]} (${value.length})`}
            </Text>
          </View>,
        );

        listDataTable[key] = [];
        if (value.length === 0) {
          listDataTable[key].push([
            <Text style={{textAlign: 'center', color: 'grey'}}>
              Không có bản ghi
            </Text>,
          ]);
        } else {
          value.forEach((element, index) => {
            const stt = index + 1;
            const {positionName = ''} = element;

            listDataTable[key].push([
              <Text style={{textAlign: 'center', color: 'black'}}>{stt}</Text>,
              <Text style={[styles.contentTableText, {textAlign: 'left'}]}>
                {positionName}
              </Text>,
            ]);
          });
        }
      }
    }
    const nativeData = [...data];
    if (this.state.substitute === dataDropDown.all) {
      const findSubject = this.props.summaryByFileId.summary.find(
        (i) => i.subjectId === this.props.subjectId,
      );
      if (findSubject) {
        const totalMember = findSubject.totalMembers;
        const countTotalAnswer = nativeData.reduce((a, b) => a + b.amount, 0);
        console.log('bb countTotalAnswer', countTotalAnswer, totalMember);
        console.log('bb data dataPieChart', nativeData);
        this.setState({
          dataPieChart: [
            ...nativeData,
            {
              key: 10000,
              amount: totalMember - countTotalAnswer,
              svg: {
                fill: 'gray',
              },
            },
          ],
          labelArr,
          listDataTable,
        });
      }
    } else {
      console.log('bb data dataPieChart 2 render', nativeData);
      this.setState({
        dataPieChart: [...nativeData],
        labelArr,
        listDataTable,
      });
    }
  };

  renderDataTable = (inputData) => {
    const containerDataTable = [];
    const {listDataTable} = this.state;
    let number = 0;
    for (const [key, value] of Object.entries(inputData)) {
      number += 1;
      if (Number.isInteger(parseInt(key, 10))) {
        TYPE_LABEL[key] = `Phương án ${key}`;
      }
      if (
        TYPE_LABEL[key] !== TYPE_LABEL.CHUA_TRA_LOI &&
        TYPE_LABEL[key] !== TYPE_LABEL.PHUONG_AN_KHAC
      ) {
        containerDataTable.push(
          <View key={key} style={{padding: 10}}>
            <View
              style={{
                backgroundColor: Constants.COLOR_LIST[number - 1],
                flexDirection: 'row',
                alignItems: 'center',
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                padding: 5,
                justifyContent: 'center',
              }}
            >
              <Text
                style={[
                  styles.normalTxt,
                  {
                    fontWeight: 'bold',
                    color: 'white',
                  },
                ]}
              >
                {`${value.length} người chọn ${TYPE_LABEL[key]}`}
              </Text>
            </View>

            <View>
              <Table borderStyle={{borderWidth: 1, borderColor: 'black'}}>
                <Rows
                  flexArr={[1, 9]}
                  data={listDataTable[key]}
                  style={styles.contentTable}
                />
              </Table>
            </View>
          </View>,
        );
        this.setState({
          containerDataTable,
        });
      }
    }
  };

  handleRotate = (event) => {
    const {nativeEvent: {layout: {width} = {}} = {}} = event;
    this.renderDataPieChart(this.props.resultBySubject);
    this.renderDataTable(this.props.resultBySubject);
    this.renderItems(this.props.resultBySubject);
    this.setState({
      width,
    });
  };

  renderItems = (inputData) => {
    const containerPieChart = [];
    const {width, dataPieChart, labelArr, containerDataTable} = this.state;
    let checkDataNotNull = false;
    this.renderDataPieChart(this.props.resultBySubject);
    this.renderDataTable(this.props.resultBySubject);

    for (const [value] of Object.entries(inputData)) {
      if (value.length > 0) {
        checkDataNotNull = true;
      }
    }
    if (checkDataNotNull) {
      const Labels = ({slices, height, width}) => {
        const pieData = slices.map((slice, index) => slice.data.amount);

        return slices.map((slice, index) => {
          const {labelCentroid, pieCentroid, data} = slice;
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
                fill={'white'}
                textAnchor={'middle'}
                alignmentBaseline={'middle'}
                fontSize={18}
                stroke={'black'}
                strokeWidth={0.2}
                fontWeight={'bold'}
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
              flexDirection: width > height ? 'row' : 'column',
              justifyContent: width > height ? 'space-evenly' : 'center',
              alignItems: 'center',
              alignSelf: 'stretch',
            }}
          >
            <PieChart
              style={styles.pieChart}
              valueAccessor={({item}) => item.amount}
              data={dataPieChart}
              spacing={0}
              outerRadius={'95%'}
            >
              <Labels />
            </PieChart>

            <View style={{marginTop: 10}}>
              <View>{labelArr}</View>
            </View>
          </View>
          {containerDataTable}
        </View>,
      );
    } else {
      containerPieChart.push(
        <View
          key={0}
          style={[stylesCommon.w100, stylesCommon.mt10, stylesCommon.alignCen]}
        >
          <Text>Chưa có kết quả lấy ý kiến cho nội dung này</Text>
        </View>,
      );
    }

    this.setState({
      containerPieChart,
    });
  };

  render() {
    const {isVisible = false, toggleModal} = this.props;
    const {containerPieChart} = this.state;

    return (
      <Modal
        animationIn='bounceInDown'
        animationOut='bounceOutUp'
        isVisible={isVisible}
        onBackdropPress={toggleModal}
        backdropColor={'rgb(156,156,156)'}
        animationInTiming={400}
        animationOutTiming={500}
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={500}
        hideModalContentWhileAnimating
        style={{width, marginLeft: 0}}
      >
        <View style={{backgroundColor: '#EBEFF5', height: height * 0.9}}>
          <View
            style={{
              backgroundColor: '#326EC4',
              paddingVertical: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <IconB name='times' size={20} color='#326EC4' />
            </View>

            <View>
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: 15,
                }}
              >
                KẾT QUẢ LẤY Ý KIẾN CHO TỪNG NỘI DUNG
              </Text>
            </View>

            <View style={{right: 10}}>
              <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center'}}
                onPress={toggleModal}
              >
                <IconB name='times' size={20} color='white' />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[stylesCommon.row, {padding: 10, flexWrap: 'wrap'}]}>
            <View style={{width: 70}}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 'bold',
                  color: 'black',
                }}
              >
                Nội dung:
              </Text>
            </View>
            <View style={{width: width - 135}}>
              <Text style={{fontSize: 16}}>{this.props.title}</Text>
            </View>
          </View>
          {this.state.substitute ? (
            <ModalDropdown
              defaultIndex={-1}
              defaultValue={this.state.substitute}
              ref='dropdown_2'
              options={[
                'Tính trên tổng phiếu đã gửi',
                'Tính trên tổng phiếu trả lời',
              ]}
              style={{
                height: 27,
              }}
              defaultTextStyle={{
                height: 40,
                textAlign: 'center',
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
              renderButtonText={(rowData) =>
                this._dropdown_2_renderButtonText(rowData)
              }
              renderRow={this._dropdown_2_renderRow.bind(this)}
            />
          ) : null}

          <ScrollView contentContainerStyle={{marginTop: 30}}>
            {containerPieChart}
          </ScrollView>
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

export default connect(mapStateToProps, {getResultBySubject})(
  FeedbackResultDetail,
);

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  contentTable: {
    backgroundColor: 'white',
    height: 40,
  },
  dropdown_2_text: {
    marginVertical: 10,
    marginHorizontal: 6,
    fontSize: 18,
    color: '#2c64b8',
  },
  dropdown_2_dropdown: {
    width: width * 0.8,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 3,
    marginLeft: width * 0.1,
    height: 85,
  },

  dropdown_2_row: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  dropdown_2_image: {
    marginLeft: 4,
    width: 30,
    height: 30,
  },
  dropdown_2_row_text: {
    marginHorizontal: 4,
    fontSize: 16,
    color: 'navy',
    textAlignVertical: 'center',
  },
  dropdown_2_separator: {
    height: 1,
    backgroundColor: 'cornflowerblue',
  },
  contentTableText: {
    padding: 5,
    textAlign: 'center',
  },
  normalTxt: {
    color: 'black',
    fontSize: 15,
  },
  pieChart: {
    height: 200,
    width: 200,
    marginTop: 10,
    alignSelf: 'center',
  },
  itemDetailVote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  colorItem: {
    width: 15,
    height: 15,
    marginRight: 10,
  },
});
