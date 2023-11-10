import React, {Component} from 'react';
import {connect} from 'react-redux';
import IconC from 'react-native-vector-icons/AntDesign';
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  ScrollView,
  BackHandler,
  TouchableHighlight,
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import {
  getPublicKey,
  login,
  createOTP,
  getRandomAESKey,
  logOut,
  setServerConnect,
  loginWithUnit,
  getListDonViAction,
} from '../../redux/actions/authen.action';
import {
  encryptRSA,
  encryptAES,
  checkPermission,
} from '../../assets/utils/utils';
import {Message} from '../../assets/utils/message';
import Loading from '../../assets/components/loading';
import Notify from '../../assets/components/notify';
import styles from './style';
import * as Keychain from 'react-native-keychain';
import {Dropdown} from 'react-native-material-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VersionCheck from 'react-native-version-check';
import {SERVER} from '../../services/service';
import DeviceInfo from 'react-native-device-info';

const srcImg = require('../../assets/images/quoc-huy.png');

const loginErr = 'A database error has occured.';
class Unit extends Component {
  constructor(props) {
    super(props);
    const {width, height} = Dimensions.get('window');
    const appVersion = VersionCheck.getCurrentVersion();

    this.state = {
      username: '',
      password: '',
      messageValidate: '',
      substitute: null,
      width,
      height,
      serverHost: SERVER,
      appVersion: appVersion,
      firstLaunch: false,
    };
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    // BackHandler.exitApp();
  };

  navigateHome = async () => {
    const userId = this.props.userInfo.appUser.id;
    if (checkPermission('FILE-VIEW')) {
      this.props.navigation.replace('BottomStack');
    } else {
      this.props.navigation.replace('BottomStackHidePLYK');
    }
  };

  componentDidMount() {
    this.props.getListDonViAction({
      userNameJoint: this.props?.userInfo?.appUser?.userNameJoint,
    });
    this.setState({
      substitute: {
        accountId: this.props?.userInfo?.appUser?.accountId,
        name: this.props?.userInfo?.appUser?.accountName,
      },
    });
  }

  encryptLogin = async () => {
    this.setState({calling: true});
    if (!this.state.substitute) {
      this.setState({
        messageValidate: 'Vui lòng chọn đơn vị',
        calling: false,
      });
      return;
    }
    const nameDevice = await DeviceInfo.getDeviceName();
    const objectData = {
      userName: this.props?.userInfo?.appUser?.userNameJoint,
      userId: this.state.substitute.accountId,
      mobile: 'mobile ' + nameDevice,
    };
    const res = await this.props.loginWithUnit(objectData);
    if (res && res?.messCode === -1003) {
      this.setState({
        calling: false,
      });
      this.showConfirmAlert();
    } else {
      if (this.props.userInfo) {
        this.setState(
          {
            calling: false,
          },
          () => {
            this.navigateHome();
          },
        );
      } else {
        const {error = ''} = this.props;
        this.setState({
          messageValidate:
            error === loginErr ? Message.MSG0019 : Message.MSG0003,
          calling: false,
        });
      }
    }
  };
  showConfirmAlert = (message, typeSubmit) => {
    Alert.alert('Thông báo', Message.MSG0036, [
      {
        text: 'Đồng ý',
        onPress: () => {},
      },
    ]);
  };
  _dropdown_2_renderButtonText(rowData) {
    const {name} = rowData;
    return `${name}`;
  }
  _dropdown_2_renderRow(rowData, rowID, highlighted) {
    let evenRow = rowID % 2;
    return (
      <TouchableOpacity
        onPress={() => {
          this.selectItem(rowID, rowData);
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
            {rowData.name?.length > 35
              ? rowData.name.slice(0, 35) + '...'
              : rowData.name}
            {/* {`${rowData.name}`} */}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  _dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    if (rowID == DEMO_OPTIONS_1.length - 1) return;
    let key = `spr_${rowID}`;
    return <View style={styles.dropdown_2_separator} key={key} />;
  }

  _renderRight() {
    const {width, height} = Dimensions.get('window');
    return (
      <View style={{marginLeft: 5, position: 'absolute', right: width * 0.15}}>
        <IconC name='caretdown' size={16} color='#2c64b8' />
      </View>
    );
  }
  selectItem(idx, value) {
    this.setState({
      substitute: value,
      messageValidate: '',
    });
    this.refs.dropdown_2.hide();
  }

  render() {
    const {
      width,
      height,
      isVisibleNotify,
      notify = '',
      messageValidate = '',
      substitute,
    } = this.state;

    return (
      <View style={styles.container}>
        <KeyboardAvoidingView behavior={'position'}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView automaticallyAdjustContentInsets={false}>
              <View style={[styles.subContainer, {marginTop: height * 0.1}]}>
                <View
                  style={{
                    marginBottom: 40,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <View style={{marginBottom: 5}}>
                    <Image source={srcImg} style={{width: 150, height: 150}} />
                  </View>

                  <Text style={styles.textHeader}>
                    {'Hệ thống phòng họp không giấy'}
                  </Text>
                </View>

                <View>
                  <View style={{marginBottom: 50}}>
                    <Text style={styles.textBody}>{'Đăng nhập hệ thống'}</Text>
                  </View>

                  <View
                    style={[
                      styles.containerInput,
                      {
                        width: width,
                        justifyContent: 'center',
                      },
                    ]}
                  >
                    <Text style={{marginLeft: width * 0.1}}>
                      Chọn đơn vị truy cập
                    </Text>
                    {this?.props?.listDonVi?.length > 0 && substitute ? (
                      <ModalDropdown
                        defaultIndex={-1}
                        defaultValue={substitute?.name}
                        ref='dropdown_2'
                        options={this.props.listDonVi}
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
                  </View>
                </View>
                {messageValidate.length !== 0 && (
                  <View style={{marginTop: 10, marginHorizontal: 10}}>
                    <Text
                      style={{textAlign: 'center', color: 'red', fontSize: 14}}
                    >{`${messageValidate.replace('.', '')}!`}</Text>
                  </View>
                )}
                {/* Button Login */}
                <View
                  style={{
                    flexDirection: 'row',
                    width: width * 0.8,
                    justifyContent: 'space-between',
                    // paddingHorizontal: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={this.handleBackPress}
                    style={[styles.containerButtonWhite, {width: width * 0.35}]}
                  >
                    <Text style={styles.textButtonBlue}>{'Quay lại'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this.encryptLogin}
                    style={[styles.containerButton, {width: width * 0.35}]}
                  >
                    <Text style={styles.textButton}>{'Truy cập'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>

          <Notify
            isVisible={isVisibleNotify}
            content={notify}
            width={width}
            closeNotify={() => this.setState({isVisibleNotify: false})}
          />
        </KeyboardAvoidingView>
        <Loading loading={this.state.calling} />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.ErrorReducer.error,
    userInfo: state.AuthenReducer.userInfo,
    OTPInfo: state.AuthenReducer.OTPInfo,
    listDonVi: state.AuthenReducer.listDonVi,
    publicKey: state.AuthenReducer.publicKey,
    publicKey64: state.AuthenReducer.publicKey64,
    aesKey: state.AuthenReducer.aesKey,
    ivKey: state.AuthenReducer.ivKey,
    aesPost: state.AuthenReducer.aesPost,
    serverConnect: state.AuthenReducer.serverConnect,
  };
};

export default connect(mapStateToProps, {
  getPublicKey,
  loginWithUnit,
  createOTP,
  getRandomAESKey,
  logOut,
  setServerConnect,
  getListDonViAction,
})(Unit);
