import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput,
    KeyboardAvoidingView,
} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import { PARTICIPANT_STATUS } from '../const';
import { getListAllDeputyForMobile } from '../../../redux/actions/meetings.action';
import styles from '../style';
import { Message } from '../../../assets/utils/message';
import { TITLE_MEETING } from '../../../assets/utils/title';
import { Alert } from 'react-native';

class ModalAuthority extends Component {
    constructor(props) {
        super(props);

        const { width, height } = this.props;

        this.state = {
            isVisibleAuthorityStart: false,
            timeStart: '',
            isVisibleAuthorityEnd: false,
            timeEnd: '',
            substitute: null,
            reasonAuthority: '',
            validate: {},
            listSubs: [{ label: 'Vui lòng chọn', value: null }],
            height20: height * 0.2,
            width30: width * 0.3,
            width38: width * 0.38,
            width50: width * 0.5,
            width70: width * 0.7,
            width80: width * 0.8,
        };
    };

    componentDidMount = async () => {
        const conferenceId = this.props.selectedMeeting.conferenceId;
        await this.props.getListAllDeputyForMobile({ conferenceId: conferenceId });
        this.generateListSubs();
    };

    generateListSubs = () => {
        const { listAllDeputyForMobile = [] } = this.props;
        const { listSubs = [] } = this.state;

        listAllDeputyForMobile.forEach((element) => {
            const { fullName = '', id = 0 } = element;
            const newElement = { label: fullName, value: id };
            listSubs.push(newElement);
        });
        // Alert.alert("listAllDeputyForMobile", listAllDeputyForMobile + "");
        this.setState({ listSubs });
    };

    handleDatePicked = (type) => (date) => {
        const { timeStart = '', timeEnd = '' } = this.state;
        const { strEndDate = '', strStartDate = '' } = this.props;
        const timeStartProps = moment(strStartDate, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm');
        const timeEndProps = moment(strEndDate, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm');
        const inputDate = moment(date).format('YYYY-MM-DD HH:mm');

        if (moment(inputDate).isBefore(timeStartProps, 'minutes')) {
            this.setState({
                isVisibleAuthorityStart: false,
                isVisibleAuthorityEnd: false,
                validate: {
                    time: Message.MSG0005
                }
            });
            return;
        };

        if (moment(inputDate).isAfter(timeEndProps, 'minutes')) {
            this.setState({
                isVisibleAuthorityStart: false,
                isVisibleAuthorityEnd: false,
                validate: {
                    time: Message.MSG0006
                }
            });
            return;
        };

        if (type === 'start') {
            if (moment(timeEnd).isBefore(inputDate, 'minutes')) {
                this.setState({
                    isVisibleAuthorityStart: false,
                    isVisibleAuthorityEnd: false,
                    validate: {
                        time: Message.MSG0008
                    }
                });
                return;
            }

            this.setState({
                timeStart: inputDate,
                isVisibleAuthorityStart: false,
            });
            return;
        };

        if (type === 'end') {
            if (moment(timeStart).isAfter(inputDate, 'minutes')) {
                this.setState({
                    isVisibleAuthorityStart: false,
                    isVisibleAuthorityEnd: false,
                    validate: {
                        time: Message.MSG0007
                    }
                });
                return;
            }

            this.setState({
                timeEnd: inputDate,
                isVisibleAuthorityEnd: false,
            });
            return;
        };
    };

    submitAuthority = async () => {
        const { reasonAuthority = '', substitute = null } = this.state;
        if (substitute === null) {
            this.setState({
                validate: {
                    reason: Message.MSG0025
                }
            });
            return;
        }
        if (reasonAuthority.trim() === '') {
            this.setState({
                validate: {
                    reason: Message.MSG0010
                }
            });
            return;
        };
        // let { timeStart = '', timeEnd = '' } = this.state;
        const { strEndDate = '', strStartDate = '' } = this.props;
        const currentDate = moment()
            .utcOffset('+7:00')
            .format('YYYY-MM-DD HH:mm');
        const startDate = moment(strStartDate, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm');
        // Alert.alert(currentDate+"");

        // if (timeStart === '') {
        //     timeStart = moment(strStartDate, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm');
        // }
        // if (timeEnd === '') {
        //     timeEnd = moment(strEndDate, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm');
        // }

        this.setState({
            validate: {}
        });
        this.props.toggleModal();

        setTimeout(async () => {
            const conferenceParticipant = {
                conferenceId: this.props.selectedMeeting.conferenceId,
                status: PARTICIPANT_STATUS.ABSENT,
                conferenceParticipantId: this.props.selectedMeeting.conferenceParticipantId,
                // userId: this.props.userInfo.appUser.id,
                description: reasonAuthority.trim(),
                assignId: parseInt(substitute + ""),
                strStartAbsentDate: startDate,
                strEndAbsentDate: startDate,
            };
            var notify = ""
            if (currentDate > startDate) {
                notify = 'Đồng chí không được ủy quyền do đã vào phiên họp';
                await this.props.syncMeeting(notify, true);
            } else{
                const res = await this.props.updateConferenceParticipantAndDelegation({ conferenceParticipant });
                notify = res === 'true' ? Message.MSG0024 : Message.MSG0003;
                if (notify === Message.MSG0024) {
                    this.props.toggleAuthorityButton(false);
                }
                this.setState({ reasonAuthority: '' });
                await this.props.syncMeeting(notify, true);
            }
           
        }, 450);
    };

    render() {
        const {
            timeStart = '',
            timeEnd = '',
            listSubs = [],
            validate: { time = '', reason = '' },
            height20,
            width30,
            width38,
            width50,
            width70,
            width80,
        } = this.state;
        const { isVisible = false, toggleModal } = this.props;
        const { strEndDate = '', strStartDate = '' } = this.props;
        const timeStartProps = moment(strStartDate, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm');
        const timeEndProps = moment(strEndDate, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm');

        return (
            <Modal
                animationInTiming={400}
                animationOutTiming={500}
                backdropTransitionInTiming={500}
                backdropTransitionOutTiming={500}
                isVisible={isVisible}
                onBackdropPress={() => { this.setState({ validate: {} }); toggleModal(); }}
                backdropColor={'rgb(156,156,156)'}
                hideModalContentWhileAnimating
            >
                <KeyboardAvoidingView
                    behavior={'position'}
                >
                    <View style={{ backgroundColor: '#ebeff5' }}>
                        <View style={{ backgroundColor: '#316ec4', paddingVertical: 8 }}>
                            <Text style={styles.headerJoinText}>
                                {'Ủy quyền'}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                            {/* Authority time */}
                            {/* <View style={[styles.flexRowAlignCenter, { marginBottom: 10 }]}>
                                <Text style={{ width: width30 }}>
                                    {`${TITLE_MEETING.TIME}: `}
                                </Text>

                                <TouchableWithoutFeedback onPress={() => this.setState({ isVisibleAuthorityStart: true, validate: { ... this.state.validate, time: '' } })}>
                                    <View style={[styles.flexRowAlignCenter, { justifyContent: 'space-between', backgroundColor: '#fff', marginLeft: 10, width: width50 }]}>
                                        <Text style={{ paddingLeft: 10 }}>
                                            {`Từ ${timeStart || timeStartProps}`}
                                        </Text>

                                        <IconM name={'menu-down'} size={25} color={'#8b8b8b'} />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            <View style={[styles.flexRowAlignCenter, { marginBottom: 10 }]}>
                                <View style={{ width: width30 }} />
                                <TouchableWithoutFeedback onPress={() => this.setState({ isVisibleAuthorityEnd: true, validate: { ... this.state.validate, time: '' } })}>
                                    <View style={[styles.flexRowAlignCenter, { justifyContent: 'space-between', backgroundColor: '#fff', marginLeft: 10, width: width50 }]}>
                                        <Text style={{ paddingLeft: 10 }}>
                                            {`Đến ${timeEnd || timeEndProps}`}
                                        </Text>

                                        <IconM name={'menu-down'} size={25} color={'#8b8b8b'} />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            <View style={{ width: width70 }}>
                                {time !== '' && (
                                    <Text style={{ textAlign: 'center', color: 'red', paddingBottom: 10 }}>
                                        {`*${time}`}
                                    </Text>
                                )}
                            </View>

                            <View>
                                <DateTimePicker
                                    date={moment(timeStart || timeStartProps, 'YYYY-MM-DD HH:mm').toDate()}
                                    mode={'datetime'}
                                    locale={'vi_VN'}
                                    isVisible={this.state.isVisibleAuthorityStart}
                                    onConfirm={this.handleDatePicked('start')}
                                    onCancel={() => this.setState({ isVisibleAuthorityStart: false })}
                                />
                            </View>

                            <View>
                                <DateTimePicker
                                    date={moment(timeEnd || timeEndProps, 'YYYY-MM-DD HH:mm').toDate()}
                                    mode={'datetime'}
                                    locale={'vi_VN'}
                                    isVisible={this.state.isVisibleAuthorityEnd}
                                    onConfirm={this.handleDatePicked('end')}
                                    onCancel={() => this.setState({ isVisibleAuthorityEnd: false })}
                                />
                            </View> */}

                            {/* Authority substitute */}
                            <View style={[styles.flexRowAlignCenter, { marginBottom: 10 }]}>
                                <Text style={{ width: width30 }}>
                                    {`${TITLE_MEETING.AUTHORIZED_PERSON}`}
                                    <Text style={{ color: 'red' }}>{'*'}</Text>
                                    {': '}
                                </Text>

                                <View style={[styles.flexRowAlignCenter, { justifyContent: 'space-between', backgroundColor: '#fff', marginLeft: 10 }]}>
                                    <Dropdown
                                        data={listSubs}
                                        containerStyle={{ width: width50, height: 27, paddingLeft: 10 }}
                                        dropdownPosition={0}
                                        dropdownOffset={{ top: 0, left: 0 }}
                                        inputContainerStyle={{ borderBottomColor: 'transparent' }}
                                        selectedItemColor={'rgba(0, 0, 0, .38)'}
                                        itemColor={'rgba(0, 0, 0, .87)'}
                                        textColor={this.state.substitute === null ? 'rgba(0, 0, 0, .38)' : 'rgba(0, 0, 0, .87)'}
                                        value={null}
                                        fontSize={15}
                                        onChangeText={(value) => this.setState({ substitute: value })}
                                    />
                                </View>
                            </View>

                            {/* Reason */}
                            <View style={{
                                justifyContent: 'flex-start',
                                marginBottom: 10
                            }}>
                                <Text>
                                    {TITLE_MEETING.REASON}
                                    <Text style={{ color: 'red' }}>{'* '}</Text>
                                    {':'}
                                </Text>
                                <TextInput
                                    style={[styles.inputReason, { width: width80 + 10, height: height20, padding: 7, textAlignVertical: 'top' }]}
                                    multiline
                                    maxLength = {500}
                                    onChangeText={reasonAuthority => {
                                        this.setState({
                                            reasonAuthority,
                                            validate: {
                                                ...this.state.validate,
                                                reason: reasonAuthority === '' ? Message.MSG0010 : ''
                                            }
                                        });
                                    }}
                                />
                            </View>

                            <View style={{ width: width70 }}>
                                {reason !== '' && (
                                    <Text style={{ textAlign: 'center', color: 'red' }}>
                                        {`*${reason}`}
                                    </Text>
                                )}
                            </View>
                        </View>

                        <View style={[styles.flexRowAlignCenter, styles.buttonJoinContainer, { marginTop: 10 }]}>
                            <TouchableOpacity
                                style={{ backgroundColor: '#316ec4', borderRadius: 4, width: width38 }}
                                onPress={() => { this.setState({ validate: {} }); toggleModal(); }}
                            >
                                <Text style={{ color: '#fff', paddingVertical: 8, textAlign: 'center' }}>{'Huỷ bỏ'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ backgroundColor: '#316ec4', borderRadius: 4, width: width38 }}
                                onPress={() => { this.submitAuthority(); }}
                            >
                                <Text style={{ color: '#fff', paddingVertical: 8, textAlign: 'center' }}>{'Đồng ý'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        );
    };
};

const mapStateToProps = state => {
    return {
        error: state.ErrorReducer.error,
        selectedMeeting: state.MeetingReducer.selectedMeeting,
        userInfo: state.AuthenReducer.userInfo,
        listAllDeputyForMobile: state.MeetingReducer.listAllDeputyForMobile,
    };
};

export default connect(
    mapStateToProps, { getListAllDeputyForMobile }
)(ModalAuthority);
