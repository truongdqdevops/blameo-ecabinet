import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Text,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import CustomHeader from '../../assets/components/header';
import Notify from '../../assets/components/notify';
import styles from './style';
import {WSClose} from '../websocket/websocket';

import Loading from '../../assets/components/loading';
import Keychain from 'react-native-keychain';

import {Message} from '../../assets/utils/message';
import {Alert} from 'react-native';
import {
  getPublicKey,
  login,
  getRandomAESKey,
  logOut,
  setServerConnect,
  changePassword,
} from '../../redux/actions/authen.action';
import {encryptRSA, encryptAES} from '../../assets/utils/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loginErr = 'A database error has occured.';
class ChangePassword extends Component {
  constructor(props) {
    super(props);

    const {userInfo = {}} = this.props;
    const {appUser = {}} = userInfo;
    const {width, height} = Dimensions.get('window');
    this.state = {
      width,
      height,
      isVisible: false,
      isVisibleNotify: false,
      contentNotify: '',
      appUser,
      messageValidate: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  }

  inputCurrentPassword = (currentPassword) => {
    this.setState({
      currentPassword: currentPassword.trim(),
      messageValidate: '',
    });
  };
  inputNewPassword = (newPassword) => {
    this.setState({
      newPassword: newPassword.trim(),
      messageValidate: '',
    });
  };
  inputConfirmPassword = (confirmPassword) => {
    this.setState({
      confirmPassword: confirmPassword.trim(),
      messageValidate: '',
    });
  };
  changePassword = async () => {
    if (!this.validateChangePassword()) return;
    // if (this.props.userInfo !== null) {
    //     await this.props.logOut();
    // }
    // if (!this.props.aesPost) {
    //     await this.props.getRandomAESKey();
    // }
    // if (!this.props.publicKey) {
    //     await this.props.getPublicKey();
    // }
    // const {
    //     publicKey64 = '',
    //     aesKey = '',
    //     ivKey = '',
    //     aesPost = '',
    // } = this.props;

    // const aesEncodeKey = await encryptRSA(aesPost, publicKey64);
    // const objectData = { userName: this.state.appUser.userName, passWord: this.state.currentPassword };
    // const data = await encryptAES(objectData, aesKey, ivKey);
    // const res = await this.props.login({ aesEncodeKey, data });
    // console.log("RES LOG " + res);
    // if (this.props.userInfo) {
    //     this.setState({
    //         messageValidate: '',
    //     }, () => {
    this.updatePassword();
    //     });
    // } else {
    //     const { error = '' } = this.props;
    //     this.setState({
    //         messageValidate: error === loginErr ? Message.MSG0031 : Message.MSG0003,
    //     });
    // }
  };

  updatePassword = async () => {
    const res = await this.props.changePassword({
      AppUser: {
        id: this.props.userInfo.appUser.id,
        password: this.state.currentPassword,
        passwordNew: this.state.confirmPassword,
        salt: this.state.appUser.salt,
        userNameJoint: this.props.userInfo.appUser.userNameJoint,
      },
    });
    if (res === 'true') {
      this.setState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        isVisibleNotify: true,
        contentNotify: 'Đổi mật khẩu thành công!',
      });
    } else {
      this.setState({messageValidate: Message.MSG0035});
    }
  };
  handleLogout = async () => {
    console.log('bb change pass');
    this.setState({isVisibleNotify: false});
    await Keychain.resetGenericPassword();
    const {appUser} = this.state;
    const {userNameJoint = ''} = appUser;
    await AsyncStorage.setItem('userNameAsync', userNameJoint);
    await this.props.logOut();
    WSClose();
    setTimeout(async () => {
      this.props.navigation.navigate('StartScreen');
    }, 500);
  };
  validateSpecialPass = (pass) => {
    var re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return re.test(pass);
  };

  validateChangePassword = () => {
    const {
      currentPassword = '',
      newPassword = '',
      confirmPassword,
    } = this.state;
    let messageValidate = '';
    if (currentPassword.length === 0) {
      messageValidate = Message.MSG0027;
    } else if (newPassword.length === 0) {
      messageValidate = Message.MSG0028;
    } else if (confirmPassword.length === 0) {
      messageValidate = Message.MSG0029;
    } else if (newPassword != confirmPassword) {
      messageValidate = Message.MSG0030;
    } else if (!this.validateSpecialPass(newPassword)) {
      messageValidate = Message.MSG0034;
    } else if (newPassword.includes(' ')) {
      messageValidate = Message.MSG0034;
    }

    if (messageValidate.length !== 0) {
      this.setState({
        messageValidate,
      });
      return false;
    }
    return true;
  };
  componentWillUnmount() {
    // this.backHandler.remove();
  }

  render() {
    const {
      width,
      height,
      isVisibleNotify = false,
      contentNotify,
      appUser,
      messageValidate,
      currentPassword,
      newPassword,
      confirmPassword,
    } = this.state;
    const {fullName = '', position = ''} = appUser;
    return (
      <View
        style={[
          {
            flex: 1,
            position: 'relative',
            backgroundColor: '#fafafa',
          },
          {backgroundColor: '#fafafa'},
        ]}
      >
        <CustomHeader
          title={'Thay đổi mật khẩu'}
          navigation={this.props.navigation}
        />
        <View style={styles.container}>
          <KeyboardAvoidingView behavior={'position'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView automaticallyAdjustContentInsets={false}>
                <View style={[styles.subContainer, {marginTop: height * 0.1}]}>
                  {/* Form ChangePassword */}
                  <View>
                    <View
                      style={{
                        height: 140,
                        paddingTop: 45,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            color: '#2c64b8',
                            fontWeight: 'bold',
                            fontSize: 20,
                            textTransform: 'uppercase',
                          }}
                        >
                          {fullName}
                        </Text>
                        <Text
                          style={{
                            color: '#2c64b8',
                            fontSize: 15,
                            paddingTop: 3,
                          }}
                        >
                          {position}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.containerInput, {width: width * 0.8}]}>
                      <Text style={styles.labelInput}>
                        {'Mật khẩu hiện tại'}
                      </Text>

                      <View style={styles.subContainerInput}>
                        <TextInput
                          style={{height: 25, padding: 0}}
                          secureTextEntry
                          onChangeText={this.inputCurrentPassword}
                          value={currentPassword}
                          onSubmitEditing={() => this.refPass.focus()}
                          // blurOnSubmit={false}
                        />
                      </View>
                    </View>

                    <View style={[styles.containerInput, {width: width * 0.8}]}>
                      <Text style={styles.labelInput}>{'Mật khẩu mới'}</Text>

                      <TextInput
                        style={[
                          styles.subContainerInput,
                          {height: 25, padding: 0},
                        ]}
                        onChangeText={this.inputNewPassword}
                        secureTextEntry
                        value={newPassword}
                        ref={(refPass) => (this.refPass = refPass)}
                        onSubmitEditing={() => this.refConfirmPass.focus()}
                      />
                    </View>
                    <View style={[styles.containerInput, {width: width * 0.8}]}>
                      <Text style={styles.labelInput}>
                        {'Nhập lại mật khẩu mới'}
                      </Text>

                      <TextInput
                        style={[
                          styles.subContainerInput,
                          {height: 25, padding: 0},
                        ]}
                        onChangeText={this.inputConfirmPassword}
                        secureTextEntry
                        value={confirmPassword}
                        ref={(refConfirmPass) =>
                          (this.refConfirmPass = refConfirmPass)
                        }
                        // ref={(refPass) => this.refPass = refPass}
                        onSubmitEditing={this.changePassword}
                      />
                    </View>
                  </View>

                  {messageValidate.length !== 0 && (
                    <View>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: 'red',
                          fontSize: 14,
                        }}
                      >{`${messageValidate.replace('.', '')}!`}</Text>
                    </View>
                  )}

                  {/* Button ChangePass */}
                  <TouchableOpacity
                    onPress={() => this.changePassword()}
                    style={[styles.containerButton, {width: width * 0.75}]}
                  >
                    <Text style={styles.textButton}>{'Đổi mật khẩu'}</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </TouchableWithoutFeedback>
            <Notify
              isVisible={isVisibleNotify}
              content={contentNotify}
              width={width}
              closeNotify={this.handleLogout}
            />
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.ErrorReducer.error,
    userInfo: state.AuthenReducer.userInfo,
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
  login,
  getRandomAESKey,
  logOut,
  setServerConnect,
  changePassword,
})(ChangePassword);
