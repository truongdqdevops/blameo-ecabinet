import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {PieChart} from 'react-native-svg-charts';
import {Buffer} from 'buffer';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconF from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import Modal from 'react-native-modal';
import {WebView} from 'react-native-webview';
import {hostURL, serverChat} from '../../services/service';
import {
  chooseMeeting,
  getMeetingById,
} from '../../redux/actions/meetings.action';
import {
  getDashboard,
  getDashboardConfirme,
  getListConfernce,
} from '../../redux/actions/home.action';
import {encode, logOut} from '../../redux/actions/authen.action';
import {
  updateConferenceWS,
  updateNotifyWS,
} from '../../redux/actions/websocket.action';
import styles from './style';
import CustomHeader from '../../assets/components/header';
import Loading from '../../assets/components/loading';
import {Constants} from '../../assets/utils/constants';
import {checkPermission} from '../../assets/utils/utils';
import {WSOpen, WSMessage, WSError, WSInitial} from '../websocket/websocket';
import {Alert} from 'react-native';

const PERMISSION = {
  VIEW: 'HOME-00000000',
};

class Home extends Component {
  constructor(props) {
    super(props);

    const {width, height} = Dimensions.get('window');
    this.state = {
      width,
      height,
      componentTotalMeeting: [],
      dataAggregate: [],
      dataMeetings: [],
      bodyConfirmeReq: {
        totalConfirme: '',
        totalUnconfirme: '',
        totalAbsence: '',
      },
      showMore: false,
      isRefreshing: false,
      permissionView: checkPermission(PERMISSION.VIEW),
      permissionViewPLYK: checkPermission('FILE-VIEW'),
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      Alert.alert('Reload');
    }
  }
  componentWillMount = () => {
    this.props.navigation.addListener('willFocus', async () => {
      if (this.props.navigation.isFocused()) {
        this.handleReloadScreen();
      }
    });
  };
  componentDidMount = async () => {
    if (this.state.permissionView) {
      await this.handleReloadScreen();
    }

    WSInitial();
    WSOpen();
    WSMessage(this.props.navigation);
    WSError();
  };
  onScreenFocus = async () => {
    this.handleReloadScreen();
  };
  handleReloadScreen = async () => {
    this.setState({isRefreshing: true});
    const {width, height} = this.state;
    const isStanding = width < height;
    const size = width < height ? width * 0.43 : width * 0.3;
    const {bodyConfirmeReq = {}} = this.state;
    await Promise.all([
      this.props.getDashboard(),
      this.props.getDashboardConfirme(bodyConfirmeReq),
      this.props.getListConfernce(),
    ]);
    this.renderDataPieChart(this.props.summary, isStanding);
    this.renderDataAggregate(this.props.totalMeeting, size);
    this.renderDataNearestMeetings(this.props.listMeeting, width);
    this.setState({isRefreshing: false});
  };

  renderDataPieChart = (inputData, isStanding) => {
    const data = [];
    let total = 0;
    const componentTotalMeeting = [];
    const labelArr = [];
    const typeLabel = {
      answered: 'Đã trả lời',
      inDue: 'Sắp đến hạn trả lời',
      outDue: 'Quá hạn trả lời',
    };

    Object.keys(typeLabel).forEach((element) => {
      if (element !== 'send') {
        const value = inputData[element] || 0;
        total += value;
      }
    });

    Object.keys(typeLabel).forEach((element, index) => {
      if (element !== 'send') {
        const key = element;
        const value = inputData[element] || 0;
        data.push({
          key,
          amount: value ? value.toString() : 0,
          svg: {
            fill: Constants.COLOR_LIST[index],
          },
        });
        if (index === 2) {
          const valueEnd =
            100 -
            Math.round((inputData['answered'] / total) * 10000) / 100 -
            Math.round((inputData['inDue'] / total) * 10000) / 100;
          const roundValue = Math.round(valueEnd * 100) / 100;
          labelArr.push(
            <View key={key} style={styles.itemDetailVote}>
              <View
                style={[
                  styles.colorItem,
                  {backgroundColor: Constants.COLOR_LIST[index]},
                ]}
              />
              <Text>{`${typeLabel[key]}: ${value} (${roundValue}%)`}</Text>
            </View>,
          );
        } else {
          labelArr.push(
            <View key={key} style={styles.itemDetailVote}>
              <View
                style={[
                  styles.colorItem,
                  {backgroundColor: Constants.COLOR_LIST[index]},
                ]}
              />
              <Text>{`${typeLabel[key]}: ${value} (${Math.round(
                (value / total) * 10000,
              ) / 100}%)`}</Text>
            </View>,
          );
        }
      }
    });

    if (total === 0) {
      componentTotalMeeting.push(
        <View key={0} style={{flexDirection: 'row', marginVertical: 10}}>
          <Text style={{fontSize: 16}}>{'Không có dữ liệu'}</Text>
        </View>,
      );
    } else {
      componentTotalMeeting.push(
        <View
          key={0}
          style={{
            flexDirection: !isStanding ? 'row' : 'column',
            justifyContent: !isStanding ? 'space-evenly' : 'center',
            alignItems: 'center',
            alignSelf: 'stretch',
          }}
        >
          <PieChart
            style={styles.pieChart}
            valueAccessor={({item}) => item.amount}
            data={data}
            spacing={0}
            outerRadius={'95%'}
            innerRadius={'55%'}
            padAngle={0}
          />

          <View style={{marginTop: 20}}>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 15,
                justifyContent: 'center',
              }}
            >
              <Text style={{fontSize: 16}}>{'Tổng số: '}</Text>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>{total}</Text>
              <Text style={{fontSize: 16}}>{' (phiếu)'}</Text>
            </View>
            <View style={{paddingLeft: 20}}>{labelArr}</View>
          </View>
        </View>,
      );
    }
    this.setState({
      componentTotalMeeting,
    });
  };

  renderDataAggregate = (inputData, size) => {
    const dataAggregate = [];
    const meetingType = {
      totalNoComment: 'Cuộc họp chưa cho ý kiến trước phiên họp',
      totalNoStated: 'Cuộc họp chưa đăng ký phát biểu',
      totalUnConfirme: 'Cuộc họp chưa xác nhận tham gia',
    };
    Object.keys(meetingType).forEach((element, index) => {
      const key = element;
      const value = inputData[element] || 0;
      dataAggregate.push(
        <View key={key} style={[styles.aggregateItem, {width: size}]}>
          <Text
            style={{
              fontSize: 37,
              color: Constants.COLOR_LIST[index],
              paddingRight: 3,
            }}
          >
            {value < 10 ? `0${value}` : value}
          </Text>
          <View style={{width: '72%'}}>
            <Text
              numberOfLines={3}
              style={{
                marginRight: 5,
                fontSize: 13,
                textAlignVertical: 'center',
              }}
            >
              {meetingType[key]}
            </Text>
          </View>
        </View>,
      );
    });

    this.setState({
      dataAggregate,
    });
  };

  renderDataNearestMeetings = (inputData, size) => {
    const dataMeetings = [];
    if (inputData.length === 0) {
      dataMeetings.push(
        <View key={0}>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 10,
            }}
          >
            <Text style={{fontSize: 16}}>{'Không có dữ liệu'} </Text>
          </View>
        </View>,
      );
    } else {
      inputData.forEach((element, index) => {
        const {
          conferenceId = 0,
          name,
          strStartDate,
          location,
          meetingTime,
          status,
          statusName,
          color,
        } = element;
        let isKhachMoi = false;
        if (this.props.userInfo != null)
          isKhachMoi = this.props.userInfo.code === 'ROLE_KHACHMOI';
        const startMoment = moment(strStartDate, 'DD/MM/YYYY HH:mm');

        dataMeetings.push(
          <View key={index.toString()} style={styles.meetingItem}>
            <TouchableOpacity onPress={this.navigateContent(element)}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{width: size * 0.5}}>
                  <Text
                    style={{fontSize: 13, fontWeight: 'bold', color: 'black'}}
                  >
                    {name}
                  </Text>
                </View>
                {!isKhachMoi && (
                  <View style={{width: size * 0.26, paddingRight: 1}}>
                    <Text
                      style={[
                        {backgroundColor: color},
                        styles.meetingItemStatus,
                      ]}
                    >
                      {statusName}
                    </Text>
                  </View>
                )}
              </View>

              <View
                style={{
                  width: size * 0.22,
                  borderTopColor: '#707070',
                  borderTopWidth: 1,
                  marginTop: 5,
                }}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 5,
                }}
              >
                <View style={{flexDirection: 'column', width: size * 0.73}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{width: 20}}>
                      <IconM name='calendar-clock' size={15} color='#707070' />
                    </View>
                    <Text>{`${startMoment
                      .startOf('minutes')
                      .fromNow()
                      .replace('một', '1')} (${startMoment.format(
                      'DD/MM/YYYY',
                    )})`}</Text>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{width: 20}}>
                      <IconM name='clock-outline' size={15} color='#707070' />
                    </View>
                    <Text>{meetingTime}</Text>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{width: 21, left: -1}}>
                      <IconM
                        name='map-marker-outline'
                        size={17}
                        color='#707070'
                      />
                    </View>
                    <Text>{location}</Text>
                  </View>
                </View>

                {/* <TouchableOpacity onPress={this.navigateContent(conferenceId, 0)}> */}
                <View>
                  <IconM name='chevron-right' size={25} color='#707070' />
                </View>
              </View>

              {status === 1 && (
                <TouchableOpacity>
                  <View style={[styles.meetingButton, {width: size * 0.25}]}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                      }}
                    >
                      VÀO HỌP
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>,
        );
      });
    }

    this.setState({
      dataMeetings,
    });
  };

  navigateContent = (navigateMeeting) => async () => {
    this.props.navigation.navigate('MeetingScheduleScreen', {
      navigateMeeting,
      from: 'Home',
    });
  };

  handleChatBox = async () => {
    const {id = '', userName = '', salt = ''} = this.props.userInfo.appUser;
    const bodyEncodeChatReq = [userName, salt, id.toString()];
    await this.props.encode(bodyEncodeChatReq);

    const {encodedDataChat = [], sessionId} = this.props;
    const base64HostURL = Buffer.from(hostURL(), 'utf8').toString('base64');

    let linkChat = '';
    if (encodedDataChat.length === 3) {
      linkChat = `${serverChat.server1}/?username=${encodedDataChat[0]}&password=${encodedDataChat[1]}&userid=${encodedDataChat[2]}&sessionid=${sessionId}&serviceVofficeUrl=${base64HostURL}`;
    }
    this.setState({
      linkChat,
      isVisible: true,
      loadingChat: true,
    });
  };

  handleRotate = (event) => {
    const {nativeEvent: {layout: {width, height} = {}} = {}} = event;
    this.setState({
      width,
      height,
    });
    const isStanding = width < height;
    const size = width < height ? width * 0.43 : width * 0.3;
    this.renderDataPieChart(this.props.summary, isStanding);
    this.renderDataAggregate(this.props.totalMeeting, size);
    this.renderDataNearestMeetings(this.props.listMeeting, width);
  };

  render() {
    const {
      dataAggregate,
      dataMeetings,
      componentTotalMeeting,
      linkChat,
      width,
      permissionViewPLYK,
      showMore,
    } = this.state;

    return (
      <View style={styles.container}>
        <CustomHeader
          title={'HỆ THỐNG THÔNG TIN PHỤC VỤ HỌP VÀ XỬ LÝ CÔNG VIỆC'}
          // title={'HỆ THỐNG THÔNG TIN PHỤC VỤ HỌP VÀ XỬ LÝ CÔNG VIỆC CỦA UBND'}
          // title={'HỆ THỐNG PHÒNG HỌP KHÔNG GIẤY'}
          navigation={this.props.navigation}
          width={width}
        />

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.handleReloadScreen}
            />
          }
        >
          <TouchableWithoutFeedback>
            <View style={styles.subContainer}>
              {/* LỊCH HỌP GẦN NHẤT */}
              <View style={styles.partContainer}>
                <Text style={styles.headerPartText}>{'Lịch họp gần nhất'}</Text>
                <View
                  style={{
                    flexDirection: 'column',
                    alignSelf: 'stretch',
                  }}
                >
                  {dataMeetings <= 3
                    ? dataMeetings
                    : showMore
                    ? dataMeetings
                    : dataMeetings.slice(0, 3)}
                </View>
                {dataMeetings.length > 3 ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({showMore: !this.state.showMore});
                    }}
                    style={{
                      width: '100%',
                      paddingHorizontal: 5,
                      paddingVertical: 5,
                    }}
                  >
                    <Text style={{textAlign: 'right', color: 'blue'}}>
                      {' '}
                      {showMore ? 'Thu hẹp' : 'Mở rộng'}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {/* PHIẾU LẤY Ý KIẾN */}
              {permissionViewPLYK && (
                <View style={styles.partContainer}>
                  <Text style={styles.headerPartText}>
                    {`Phiếu lấy ý kiến thành viên`}
                  </Text>

                  {componentTotalMeeting}
                </View>
              )}

              {/* THỐNG KÊ CHUNG */}
              <View style={[styles.partContainer, {marginBottom: 10}]}>
                <Text style={styles.headerPartText}>{'Thống kê chung'}</Text>

                <View style={styles.contentAggregateContainer}>
                  {dataAggregate}
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>

        {/* <TouchableOpacity style={styles.containerChat} onPress={this.handleChatBox}>
                    <IconF name='rocketchat' size={25} color="#fff" />
                </TouchableOpacity> */}

        <Modal
          animationInTiming={400}
          animationOutTiming={500}
          backdropTransitionInTiming={500}
          backdropTransitionOutTiming={500}
          isVisible={this.state.isVisible}
          // isVisible={this.state.a.a}
          backdropColor={'rgb(156,156,156)'}
          hideModalContentWhileAnimating
        >
          <View
            style={{
              flex: 0.8,
              backgroundColor: '#ebeff5',
              paddingHorizontal: 0,
            }}
          >
            <CustomHeader
              title={'Chatbox'}
              haveClose
              onClose={() => this.setState({isVisible: false})}
              customHeight={35}
            />
            <View style={{flex: 1}}>
              {!linkChat ? (
                <Text>{'Hiện tại không thể kết nối tới Chatbox'}</Text>
              ) : (
                <WebView
                  source={{uri: linkChat}}
                  onLoadEnd={() => this.setState({loadingChat: false})}
                />
              )}

              <Loading loading={this.state.loadingChat} />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.ErrorReducer.error,
    summary: state.HomeReducer.summary,
    totalMeeting: state.HomeReducer.totalMeeting,
    userInfo: state.AuthenReducer.userInfo,
    sessionId: state.AuthenReducer.sessionId,
    encodedDataChat: state.AuthenReducer.encodedDataChat,
    listMeeting: state.HomeReducer.listMeeting,
  };
};

export default connect(mapStateToProps, {
  chooseMeeting,
  getDashboard,
  getDashboardConfirme,
  getListConfernce,
  getMeetingById,
  encode,
  updateConferenceWS,
  updateNotifyWS,
  logOut,
})(Home);
