import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
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
    Animated,
    Easing
} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import styles from './style';
import LottieView from 'lottie-react-native';
import CountDown from 'react-native-countdown-component';
import CustomHeader from '../../assets/components/header';
import { getPublicKey, login, getRandomAESKey, createOTP, validateOTP, logOut, setServerConnect } from '../../redux/actions/authen.action';
import { checkPermission } from '../../assets/utils/utils';
import { Message } from '../../assets/utils/message';

const srcOTP = require('../../assets/images/otp.json');

class OTPScreen extends Component {
    constructor(props) {
        super(props);

        const { width, height } = Dimensions.get('window');
        const timeOTP = this.props.OTPInfo.secondTimeout
        this.state = {
            width,
            height,
            messageValidate: '',
            enableVerifyButton: false,
            timeOTP: timeOTP,
            isResendOTP: false,
            enteredOtp: "",
            uniqueValue: 1,
            clearInput: false,
            isOTPExpire: false
        };
        this.animatedValue = new Animated.Value(0)
        this.animatedValuePhone = new Animated.Value(0)

        console.log("OTP infor: " + JSON.stringify(this.props.OTPInfo))
    }
    handleAnimation = (isShakingPhone) => {
        // A loop is needed for continuous animation
        if (!isShakingPhone)
            Animated.loop(
                // Animation consists of a sequence of steps
                Animated.sequence([
                    // start rotation in one direction (only half the time is needed)
                    Animated.timing(this.animatedValue, { toValue: 1.0, duration: 150, easing: Easing.linear, useNativeDriver: true }),
                    // rotate in other direction, to minimum value (= twice the duration of above)
                    Animated.timing(this.animatedValue, { toValue: -1.0, duration: 300, easing: Easing.linear, useNativeDriver: true }),
                    // return to begin position
                    Animated.timing(this.animatedValue, { toValue: 0.0, duration: 150, easing: Easing.linear, useNativeDriver: true })
                ]),
                { iterations: 1 }
            ).start();
        else {
            Animated.loop(
                // Animation consists of a sequence of steps
                Animated.sequence([
                    // start rotation in one direction (only half the time is needed)
                    Animated.timing(this.animatedValuePhone, { toValue: 1.0, duration: 150, easing: Easing.linear, useNativeDriver: true }),
                    // rotate in other direction, to minimum value (= twice the duration of above)
                    Animated.timing(this.animatedValuePhone, { toValue: -1.0, duration: 300, easing: Easing.linear, useNativeDriver: true }),
                    // return to begin position
                    Animated.timing(this.animatedValuePhone, { toValue: 0.0, duration: 150, easing: Easing.linear, useNativeDriver: true })
                ]),
                { iterations: 1 }
            ).start();
        }
    }
    handleGoBack = async () => {
        this.props.navigation.replace('StartScreen');
    }


    navigateHome = () => {
        if (checkPermission('FILE-VIEW')) {
            this.props.navigation.replace('BottomStack')
        }
        else {
            this.props.navigation.replace('BottomStackHidePLYK')
        }
    };

    reSendOTP = async () => {
        this.setState({
            uniqueValue: this.state.uniqueValue + 1,
            messageValidate: "",
            isResendOTP: true,
            enteredOtp: "",
            isOTPExpire: false,
            timeOTP: this.props.OTPInfo.secondTimeout,
            clearInput: false
        })
        this.animatedValue.stopAnimation();
        this.handleAnimation(true);
        const userId = this.props.userInfo.appUser.id;
        await this.props.createOTP({ userId });
    }

    onOTPChange = (code) => {
        if (code.length !== 6) {
            this.setState({
                enableVerifyButton: false,
                messageValidate: "",
            })
        }
        this.setState({ enteredOtp: code });
    }

    onCodeFilled = (code) => {
        this.setState({
            enableVerifyButton: true,
            enteredOtp: code
        })
    }

    verifyOTPCode = async () => {
        const userId = this.props.userInfo.appUser.id;
        const res = await this.props.validateOTP({ userId, code: this.state.enteredOtp });
        console.log("MESS" + JSON.stringify(res))
        if (res) { // sentOtp is my variable prestored for comparison
            // All Good and proceed
            if (checkPermission('FILE-VIEW')) {
                this.props.navigation.replace('BottomStack')
            }
            else {
                this.props.navigation.replace('BottomStackHidePLYK')
            }
        } else {
            const { error = '' } = this.props;
            if (error === 'Quá số lần nhập sai OTP cho phép') {
                this.setState({
                    messageValidate: 'Quá số lần nhập sai OTP cho phép'
                    // calling: false,
                })
                this.setState({
                    isOTPExpire: true,
                    clearInput: true,
                    enableVerifyButton: false,
                    uniqueValue: this.state.uniqueValue + 1,
                    timeOTP: 0,
                })
                this.handleAnimation(false);
            }
            else {
                this.setState({
                    enteredOtp: "",
                    messageValidate: "Mã OTP không chính xác",
                    clearInput: true,
                    enableVerifyButton: false,
                }); // Reset the OTP if incorrect
                setTimeout(
                    function () {
                        this.setState({ clearInput: false });
                    }
                        .bind(this),
                    1000
                );
            }

        }

    }

    render() {
        const { width, height, messageValidate, enableVerifyButton, timeOTP, isResendOTP, enteredOtp, clearInput, isOTPExpire } = this.state;

        return (
            <View style={styles.container}>
                <CustomHeader
                    title={'Xác thực OTP          '}
                    haveEmail={false}
                    haveBack={true}
                    navigation={this.props.navigation}
                    width={width}
                    onPressButton={this.handleGoBack}
                />
                <ScrollView automaticallyAdjustContentInsets={false}>
                    <View style={[styles.subContainer]}>
                        <View key={this.state.uniqueValue}>
                            <LottieView
                                source={srcOTP}
                                autoPlay
                                loop={false}
                                style={{ width: 280, height: 280 }}
                            />
                        </View>
                        <Animated.View style={{
                            transform: [{
                                translateX: this.animatedValuePhone.interpolate({
                                    inputRange: [0, 0.25, 0.50, 0.75, 1],
                                    outputRange: [10, 20, 10, 20, 10]
                                })
                            }]
                        }}>
                            <Text style={{ width: 280, textAlign: 'center', marginTop: 10, fontSize: 16 }}>
                                {`Mã xác thực đã được gửi về số điện thoại +${this.props.OTPInfo.smsMoblie}`}
                            </Text>
                        </Animated.View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 20 }}>
                                {`Nhập mã xác thực`}
                            </Text>
                            <Text style={{ fontSize: 18, position: 'relative', left: 3 }}>
                                {` (`}
                            </Text>
                            <View key={this.state.uniqueValue}>
                                <CountDown
                                    size={8}
                                    until={timeOTP}
                                    onFinish={() => this.setState({ messageValidate: "Mã OTP hết hiệu lực, vui lòng gửi lại", enableVerifyButton: false, isOTPExpire: true }, this.handleAnimation(false))}
                                    digitTxtStyle={{ color: '#000000', fontSize: 18 }}
                                    digitStyle={{ backgroundColor: '#fff', width: 25 }}
                                    timeLabelStyle={{ color: 'red' }}
                                    separatorStyle={{ color: '#000000' }}
                                    timeToShow={['M', 'S']}
                                    timeLabels={{ m: null, s: null }}
                                    showSeparator
                                />
                            </View>
                            <Text style={{ fontSize: 18, position: 'relative', right: 3 }}>
                                {`)`}
                            </Text>
                        </View>
                        <View pointerEvents={isOTPExpire ? "none" : "auto"}>
                            <OTPInputView
                                style={{ width: width > 600 ? 400 : '85%', height: 100 }}
                                pinCount={6}
                                code={enteredOtp}
                                selectionColor={"#316ec4"}
                                onCodeChanged={code => { this.onOTPChange(code) }}
                                codeInputFieldStyle={styles.underlineStyleBase}
                                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                                onCodeFilled={(code => {
                                    this.onCodeFilled(code)
                                })}
                                autoFocusOnLoad
                                clearInputs={clearInput}
                            />
                        </View>

                        {messageValidate.length !== 0 && (
                            <View>
                                <Text style={{ textAlign: 'center', color: 'red', fontSize: 16 }}>{`${messageValidate.replace('.', '')}!`}</Text>
                            </View>
                        )}

                        <TouchableOpacity onPress={this.verifyOTPCode} disabled={!enableVerifyButton}
                            style={enableVerifyButton ? [styles.containerButton, { width: width > 600 ? 300 : '75%' }] : [styles.containerButtonDisable, { width: width > 600 ? 300 : '75%' }]}>
                            <Text style={styles.textButton}>{'Xác nhận'}</Text>
                        </TouchableOpacity>

                        <View style={{ flexDirection: "row", justifyContent: 'center', marginBottom: height * .1, }}>
                            <Text style={{ textAlign: 'center', fontSize: 16 }}>
                                {`Không nhận được mã? `}
                            </Text>

                            <TouchableOpacity hitSlop={{ top: 10, left: 30, bottom: 30, right: 30 }} onPress={this.reSendOTP}>
                                <Animated.View style={{
                                    transform: [{
                                        translateX: this.animatedValue.interpolate({
                                            inputRange: [0, 0.25, 0.50, 0.75, 1],
                                            outputRange: [10, 20, 10, 20, 10]
                                        })
                                    }]
                                }}>
                                    <Text style={{ textAlign: 'center', color: '#316ec4', fontSize: 16, textDecorationLine: 'underline' }}>
                                        {`Gửi lại`}
                                    </Text>
                                </Animated.View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        error: state.ErrorReducer.error,
        userInfo: state.AuthenReducer.userInfo,
        OTPInfo: state.AuthenReducer.OTPInfo,
        publicKey: state.AuthenReducer.publicKey,
        publicKey64: state.AuthenReducer.publicKey64,
        aesKey: state.AuthenReducer.aesKey,
        ivKey: state.AuthenReducer.ivKey,
        aesPost: state.AuthenReducer.aesPost,
        serverConnect: state.AuthenReducer.serverConnect,
    };
};
export default connect(
    mapStateToProps,
    { getPublicKey, login, createOTP, validateOTP, getRandomAESKey, logOut, setServerConnect }
)(OTPScreen);

