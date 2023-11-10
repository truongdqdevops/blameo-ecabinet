import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import {Table, Row} from 'react-native-table-component';
import Modal from 'react-native-modal';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScrollView} from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import {getListAssignParticipant} from '../../../redux/actions/meetings.action';
import {DEPARTMENT_TYPE_NAME, PARTICIPANT_STATUS} from '../const';
import styles from '../style';

class ModalAssign extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableHead: ['STT', 'Chức vụ', 'Tên', 'Thao tác'],
      isVisible: false,
    };
  }

  renderListAssignParticipant = (inputData) => {
    const listAssignParticipant = [];
    let stt = 1;
    inputData.forEach((element, index) => {
      const {userName, position, fullName, status} = element;
      if (userName !== DEPARTMENT_TYPE_NAME) {
        const itemData = [
          <Text style={{textAlign: 'center', textAlignVertical: 'center'}}>
            {stt}
          </Text>,
          <Text style={styles.contentTableText2}>{position}</Text>,
          <Text style={styles.contentTableText2}>{fullName}</Text>,
          <View style={{alignItems: 'center'}}>
            {status !== PARTICIPANT_STATUS.JOIN && (
              <TouchableOpacity onPress={() => this.props.deleteAssign(index)}>
                <IconM name={'delete'} size={20} color={'#ef5c22'} />
              </TouchableOpacity>
            )}
          </View>,
        ];
        const rowData = (
          <Row
            key={index.toString()}
            flexArr={[2, 8, 8, 3]}
            data={itemData}
            style={[styles.contentTable2, {minHeight: 40}]}
          />
        );
        listAssignParticipant.push(rowData);
        stt += 1;
      }
    });

    return listAssignParticipant;
  };

  renderListAllAssignParticipant = (inputData) => {
    const listAssignParticipant = [];
    let stt = 1;
    inputData.forEach((element, index) => {
      const {fullName, position, selected} = element;
      if (fullName !== DEPARTMENT_TYPE_NAME) {
        const itemData = [
          <Text style={{textAlign: 'center', textAlignVertical: 'center'}}>
            {stt}
          </Text>,
          <Text style={styles.contentTableText2}>{position}</Text>,
          <Text style={styles.contentTableText2}>{fullName}</Text>,
          <View style={[styles.flexRowAlignCenter, {justifyContent: 'center'}]}>
            <CheckBox
              value={selected}
              customLabel={<Text />}
              tintColor={'grey'}
              boxType={'square'}
              onCheckColor={'#4281D0'}
              tintColors={{true: '#4281D0', false: 'grey'}}
              style={[
                {height: 21, width: 21},
                Platform.OS === 'android' && {
                  transform: [{scaleX: 1.5}, {scaleY: 1.5}],
                },
              ]}
              onValueChange={() => this.props.chooseAssign(index)}
              noFeedback
            />
          </View>,
        ];
        const rowData = (
          <Row
            key={index.toString()}
            flexArr={[2, 8, 8, 3]}
            data={itemData}
            style={[styles.contentTable2, {minHeight: 40}]}
          />
        );
        listAssignParticipant.push(rowData);
        stt += 1;
      }
    });

    return listAssignParticipant;
  };

  onPressSubmit = () => {
    this.props.toggleModal();
    setTimeout(() => {
      this.props.submitAssign();
    }, 450);
  };

  render() {
    const {tableHead = []} = this.state;
    const {
      width,
      height,
      isVisible = false,
      toggleModal,
      newListAssignParticipant = [],
      lstMember = [],
    } = this.props;
    const checkAll = this.props.checkValueAll();

    return (
      <Modal
        animationInTiming={400}
        animationOutTiming={500}
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={500}
        isVisible={isVisible}
        onBackdropPress={toggleModal}
        backdropColor={'rgb(156,156,156)'}
        hideModalContentWhileAnimating
      >
        <View style={{backgroundColor: '#ebeff5', height: height * 0.7}}>
          <View style={{backgroundColor: '#316ec4', paddingVertical: 8}}>
            <Text style={styles.headerJoinText}>{'Phân công tham dự'}</Text>
          </View>

          <View style={{flex: 1}}>
            <View
              style={[
                styles.flexRowAlignCenter,
                {marginLeft: 10, marginVertical: 10},
              ]}
            >
              <View style={{width: 100}}>
                <Text>{'Chọn cán bộ: '}</Text>
              </View>
              <TouchableOpacity
                style={{width: 50}}
                onPress={() => this.setState({isVisible: true})}
              >
                <View style={{backgroundColor: '#316ec4'}}>
                  <Text
                    style={{
                      color: '#fff',
                      textAlign: 'center',
                      marginVertical: 3,
                    }}
                  >
                    {'Chọn'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <Table borderStyle={{borderWidth: 1, borderColor: '#ccc'}}>
              <Row
                flexArr={[2, 8, 8, 3]}
                data={tableHead}
                style={styles.headerTable}
                textStyle={styles.headerTableText}
              />
            </Table>
            <ScrollView>
              <Table borderStyle={{borderWidth: 1, borderColor: '#ccc'}}>
                {this.renderListAssignParticipant(lstMember)}
              </Table>
            </ScrollView>
          </View>

          <View
            style={[
              styles.flexRowAlignCenter,
              {justifyContent: 'space-evenly', marginVertical: 15},
            ]}
          >
            <TouchableOpacity
              style={{
                backgroundColor: '#316ec4',
                borderRadius: 4,
                width: width * 0.38,
              }}
              onPress={() => {
                toggleModal();
                this.props.cancelAssign();
              }}
            >
              <Text
                style={{color: '#fff', paddingVertical: 8, textAlign: 'center'}}
              >
                {'Huỷ bỏ'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#316ec4',
                borderRadius: 4,
                width: width * 0.38,
              }}
              onPress={this.onPressSubmit}
            >
              <Text
                style={{color: '#fff', paddingVertical: 8, textAlign: 'center'}}
              >
                {'Đồng ý'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          animationInTiming={400}
          animationOutTiming={500}
          backdropTransitionInTiming={500}
          backdropTransitionOutTiming={500}
          isVisible={this.state.isVisible}
          onBackdropPress={() => this.setState({isVisible: false})}
          backdropColor={'rgb(156,156,156)'}
          hideModalContentWhileAnimating
        >
          <View
            style={{
              backgroundColor: '#ebeff5',
              height: height * 0.6,
            }}
          >
            <View style={{backgroundColor: '#316ec4', paddingVertical: 8}}>
              <Text style={styles.headerJoinText}>{'Chọn cán bộ'}</Text>
            </View>

            <Table borderStyle={{borderWidth: 1, borderColor: '#ccc'}}>
              <Row
                flexArr={[2, 8, 8, 3]}
                data={[
                  'STT',
                  'Chức vụ',
                  'Tên',
                  <View
                    style={[
                      styles.flexRowAlignCenter,
                      {justifyContent: 'center'},
                    ]}
                  >
                    <CheckBox
                      value={checkAll}
                      tintColor={'grey'}
                      boxType={'square'}
                      onCheckColor={'#4281D0'}
                      tintColors={{true: '#4281D0', false: 'grey'}}
                      style={[
                        {height: 21, width: 21},
                        Platform.OS === 'android' && {
                          transform: [{scaleX: 1.5}, {scaleY: 1.5}],
                        },
                      ]}
                      onValueChange={() => {
                        this.props.setAllListAssignParticipant(
                          this.props.newListAssignParticipant,
                          !checkAll,
                        );
                      }}
                      noFeedback
                    />
                  </View>,
                ]}
                style={styles.headerTable}
                textStyle={styles.headerTableText}
              />
            </Table>

            <ScrollView>
              <Table borderStyle={{borderWidth: 1, borderColor: '#ccc'}}>
                {this.renderListAllAssignParticipant(newListAssignParticipant)}
              </Table>
            </ScrollView>

            <View
              style={[
                styles.flexRowAlignCenter,
                {justifyContent: 'space-evenly', marginVertical: 15},
              ]}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: '#316ec4',
                  borderRadius: 4,
                  width: width * 0.38,
                }}
                onPress={() => {
                  this.setState({isVisible: false});
                  this.props.cancelChoose();
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    paddingVertical: 8,
                    textAlign: 'center',
                  }}
                >
                  {'Huỷ bỏ'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#316ec4',
                  borderRadius: 4,
                  width: width * 0.38,
                }}
                onPress={() => {
                  this.setState({isVisible: false});
                  this.props.submitChoose();
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    paddingVertical: 8,
                    textAlign: 'center',
                  }}
                >
                  {'Đồng ý'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.ErrorReducer.error,
    selectedMeeting: state.MeetingReducer.selectedMeeting,
    listAssignParticipant: state.MeetingReducer.listAssignParticipant,
    userInfo: state.AuthenReducer.userInfo,
  };
};

export default connect(mapStateToProps, {getListAssignParticipant})(
  ModalAssign,
);
