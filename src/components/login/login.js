import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  ScrollView,
  BackHandler,
  Platform,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {
  getPublicKey,
  login,
  createOTP,
  getRandomAESKey,
  logOut,
  setServerConnect,
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
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VersionCheck from 'react-native-version-check';
import {Alert} from 'react-native';
import {SERVER} from '../../services/service';
const server = {
  alphaway: 'http://git.alphawaytech.com:20080',
  rikkeiPublic: 'http://27.71.225.25:8080',
  rikkeiLocal: 'http://172.16.18.128:8080',
  sonLa: 'http://27.71.225.25:80',
  hueUBND: 'http://203.113.133.76:8080',
  hueHDND: 'http://203.113.133.76:8086',
  quangNgai: 'http://117.2.64.69:8080',
};

// const srcImg = require('../../assets/images/logo_pvn.png');
// const srcImg = require('../../assets/images/logo-toaan.png');
const srcImg = require('../../assets/images/quoc-huy.png');

const loginErr = 'A database error has occured.';
class Login extends Component {
  constructor(props) {
    super(props);

    const {width, height} = Dimensions.get('window');
    const appVersion = VersionCheck.getCurrentVersion();

    this.state = {
      username: '',
      password: '',
      messageValidate: '',
      width,
      height,
      // bb server
      serverHost: SERVER,
      // serverHost: 'http://ecabinet.vpdt.com.vn',
      appVersion: appVersion,
      firstLaunch: false,
    };
  }

  componentWillUnmount() {
    this.focusListener.remove();
    Dimensions.removeEventListener('change', this.handleRotate);
  }
  componentDidMount = async () => {
    const {navigation} = this.props;

    this.focusListener = navigation.addListener('didFocus', async () => {
      let isFirstLaunch = true;
      const firstLaunch = await AsyncStorage.getItem('firstLaunch');
      if (firstLaunch === 'firstLaunchDone') {
        isFirstLaunch = false;
      } else {
        isFirstLaunch = true;
        AsyncStorage.setItem('firstLaunch', 'firstLaunchDone');
      }
      try {
        // Retrieve the credentials
        const credentials = await Keychain.getGenericPassword();
        if (
          credentials &&
          credentials.username &&
          credentials.password &&
          !isFirstLaunch
        ) {
          if (credentials.username !== '_pfo') {
            this.setState({
              username: credentials.username,
              password: credentials.password,
            });
          } else {
            this.setState({
              username: '',
              passWord: '',
            });
          }
        } else {
          console.log('No credentials stored');
          const userNameAsync = await AsyncStorage.getItem('userNameAsync');
          if (userNameAsync != '') {
            this.setState({username: userNameAsync, passWord: ''});
          } else {
            this.setState({username: '', password: ''});
          }
        }
      } catch (error) {
        console.log("Credentials Keychain couldn't be accessed!", error);
      }

      const toggleCheckBox = await AsyncStorage.getItem('toggleCheckBox');
      if (toggleCheckBox === 'false') {
        this.setState({toggleCheckBox: false});
      } else {
        this.setState({toggleCheckBox: true});
      }

      const host = await AsyncStorage.getItem('serverHost');
      if (host !== null) {
        this.setState({serverHost: host});
      } else {
        // bb server
        this.setState({serverHost: SERVER});
        // this.setState({ serverHost: 'http://ecabinet.vpdt.com.vn' });
      }
      await this.props.setServerConnect(this.state.serverHost);

      // await this.props.setServerConnect(server.rikkeiPublic);
      const {serverConnect = ''} = this.props;
      this.setState({serverConnect});
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress,
      );
    });

    Dimensions.addEventListener('change', this.handleRotate);
  };

  handleBackPress = () => {
    BackHandler.exitApp();
  };

  checkConnectivity = async () => {
    const connectInfo = await NetInfo.fetch();
    const {isConnected, isInternetReachable} = connectInfo;

    if (!isConnected || !isInternetReachable) {
      this.setState({
        calling: false,
        notify: 'Vui lòng kiểm tra lại kết nối Internet!',
        isVisibleNotify: true,
      });
      return false;
    }
    return true;
  };

  inputUsername = (username) => {
    this.setState({
      username: username.trim(),
      messageValidate: '',
    });
  };

  inputPassword = (password) => {
    this.setState({
      password: password.trim(),
      messageValidate: '',
    });
  };

  inputServer = (serverConnect) => {
    AsyncStorage.setItem('serverHost', serverConnect.trim());
    this.setState({
      serverHost: serverConnect,
    });

    // this.setState({
    //     serverConnect: serverConnect.trim(),
    // });
  };

  handleOnBlurServer = () => {
    // const { serverConnect = '' } = this.state;
    // this.props.setServerConnect(serverConnect);
    const {serverHost = ''} = this.state;
    this.props.setServerConnect(serverHost);
  };

  handleRotate = ({ window: { width, height } }) => {
    this.setState({
      width,
      height,
    });
  };

  navigateHome = async () => {
    // if (checkPermission('FILE-VIEW')) {
    //     this.props.navigation.replace('BottomStack')
    // }
    // else {
    //     this.props.navigation.replace('BottomStackHidePLYK')
    // }
    const userId = this.props.userInfo.appUser.id;
    const enableOtp = this.props.userInfo.enableOtp;
    if (enableOtp) {
      await this.props.createOTP({userId});
      this.props.navigation.navigate('OTPScreen');
    } else {
      if (this.props.listDonVi.length > 1) {
        this.props.navigation.navigate('UnitScreen');
      } else {
        if (checkPermission('FILE-VIEW')) {
          this.props.navigation.replace('BottomStack');
        } else {
          this.props.navigation.replace('BottomStackHidePLYK');
        }
      }
    }
  };
  showConfirmAlert = () => {
    Alert.alert('Thông báo', Message.MSG0036, [
      {
        text: 'Đồng ý',
        onPress: () => {},
      },
    ]);
  };

  encryptLogin = async () => {
    if (!this.validateLogin()) return;
    this.checkSaveCredential();
    if (this.state.calling) return;

    // const haveConnection = await this.checkConnectivity();
    // if (!haveConnection) return;

    this.setState({calling: true});
    if (this.props.userInfo !== null) {
      await this.props.logOut();
    }
    if (!this.props.aesPost) {
      await this.props.getRandomAESKey();
    }
    if (!this.props.publicKey) {
      await this.props.getPublicKey();
    }

    const {
      publicKey64 = '',
      aesKey = '',
      ivKey = '',
      aesPost = '',
    } = this.props;
    if (publicKey64 && aesKey && ivKey && aesPost) {
      const aesEncodeKey = await encryptRSA(aesPost, publicKey64);
      const objectData = {
        userName: this.state.username,
        passWord: this.state.password,
      };
      const data = await encryptAES(objectData, aesKey, ivKey);
      const res = await this.props.login({aesEncodeKey, data});
      if (res && res?.messCode === -1003) {
        this.setState({
          // messageValidate: Message.MSG0036,
          calling: false,
        });
        this.showConfirmAlert();
      } else {
        if (this.props.userInfo) {
          await this.props.getListDonViAction({
            userNameJoint: this.props?.userInfo?.appUser?.userNameJoint,
          });
          this.setState(
            {
              username: '',
              password: '',
              messageValidate: '',
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
    } else {
      this.setState({
        messageValidate: Message.MSG0003,
        calling: false,
      });
    }
  };

  validateLogin = () => {
    const {username = '', password = ''} = this.state;
    let messageValidate = '';
    if (password.length === 0) {
      messageValidate = Message.MSG0002;
    }
    if (username.length === 0) {
      messageValidate = Message.MSG0001;
    }
    if (messageValidate.length !== 0) {
      this.setState({
        messageValidate,
      });
      return false;
    }
    return true;
  };

  setToggleCheckBox = (value) => {
    AsyncStorage.setItem('toggleCheckBox', value + '');
    this.setState({toggleCheckBox: value});
  };

  checkSaveCredential = async () => {
    //save state of checkbox
    const {username = '', password = '', toggleCheckBox} = this.state;
    if (toggleCheckBox) {
      await Keychain.setGenericPassword(username + '', password + '');
      console.log('credentials store for ' + username);
    } else {
      await Keychain.resetGenericPassword();
      console.log('credentials not store for ' + username);
    }
  };

  render() {
    const {
      username = '',
      password = '',
      width,
      height,
      messageValidate = '',
      isVisibleNotify,
      notify = '',
      serverConnect = '',
      toggleCheckBox,
      appVersion,
    } = this.state;

    return (
      <View style={styles.container}>
        <KeyboardAvoidingView behavior={'position'}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView automaticallyAdjustContentInsets={false}>
              <View style={[styles.subContainer, {marginTop: height * 0.1}]}>
                {/* Header */}
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

                {/* Form Login */}
                <View>
                  <View style={{marginBottom: 50}}>
                    <Text style={styles.textBody}>{'Đăng nhập hệ thống'}</Text>
                  </View>

                  <View style={[styles.containerInput, {width: width * 0.8}]}>
                    <Text style={styles.labelInput}>{'Tài khoản'}</Text>

                    <View style={styles.subContainerInput}>
                      <TextInput
                        style={{height: 25, padding: 0}}
                        onChangeText={this.inputUsername}
                        value={username}
                        onSubmitEditing={() => this.refPass.focus()}
                        blurOnSubmit={false}
                      />
                    </View>
                  </View>

                  <View style={[styles.containerInput, {width: width * 0.8}]}>
                    <Text style={styles.labelInput}>{'Mật khẩu'}</Text>

                    <TextInput
                      style={[
                        styles.subContainerInput,
                        {height: 25, padding: 0},
                      ]}
                      onChangeText={this.inputPassword}
                      secureTextEntry
                      value={password}
                      ref={(refPass) => (this.refPass = refPass)}
                      onSubmitEditing={this.encryptLogin}
                    />
                  </View>

                  <View style={[styles.containerInput, {width: width * 0.8}]}>
                    {/* <View style={[styles.containerInput, { width: 0, height: 0 }]}> */}
                    <Text style={styles.labelInput}>{'Server'}</Text>

                    <View style={styles.subContainerInput}>
                      <TextInput
                        style={{height: 25, padding: 0}}
                        onChangeText={this.inputServer}
                        // value={serverConnect}
                        autoCapitalize='none'
                        value={this.state.serverHost}
                        onBlur={this.handleOnBlurServer}
                      />
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: width * 0.8,
                    justifyContent: 'flex-start',
                  }}
                >
                  <CheckBox
                    style={{width: 20, height: 20}}
                    disabled={false}
                    boxType={'square'}
                    value={toggleCheckBox}
                    tintColors={{true: '#316ec4'}}
                    onValueChange={(newValue) =>
                      this.setToggleCheckBox(newValue)
                    }
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 14,
                      paddingLeft: 10,
                    }}
                  >
                    {'Ghi nhớ tài khoản'}
                  </Text>
                </View>
                {messageValidate.length !== 0 && (
                  <View>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: 'red',
                        fontSize: 14,
                        marginTop: 10,
                      }}
                    >{`${messageValidate.replace('.', '')}!`}</Text>
                  </View>
                )}
                {/* Button Login */}
                <TouchableOpacity
                  onPress={this.encryptLogin}
                  style={[styles.containerButton, {width: width * 0.75}]}
                >
                  <Text style={styles.textButton}>{'Đăng nhập'}</Text>
                </TouchableOpacity>
                <View>
                  <Text
                    style={[styles.textVersion]}
                  >{`Phiên bản ${appVersion}`}</Text>
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

          <Loading loading={this.state.calling} />
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.ErrorReducer.error,
    userInfo: state.AuthenReducer.userInfo,
    OTPInfo: state.AuthenReducer.OTPInfo,
    publicKey: state.AuthenReducer.publicKey,
    publicKey64: state.AuthenReducer.publicKey64,
    aesKey: state.AuthenReducer.aesKey,
    ivKey: state.AuthenReducer.ivKey,
    aesPost: state.AuthenReducer.aesPost,
    listDonVi: state.AuthenReducer.listDonVi,
    serverConnect: state.AuthenReducer.serverConnect,
  };
};

export default connect(mapStateToProps, {
  getPublicKey,
  login,
  createOTP,
  getRandomAESKey,
  logOut,
  setServerConnect,
  getListDonViAction,
})(Login);
