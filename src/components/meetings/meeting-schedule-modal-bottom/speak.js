import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-material-dropdown';
import { OPINION_STATUS } from '../const';
import styles from '../style';
import { Message } from '../../../assets/utils/message';
import { TITLE_MEETING } from '../../../assets/utils/title';

class ModalSpeak extends Component {
    constructor(props) {
        super(props);

        this.state = {
            validate: '',
            fileId: this.props.fileId || '',
        };
    }

    convertListData = (listContent = []) => {
        const listContents = [{ label: 'Vui lòng chọn', value: '' }];
        listContent.forEach(element => {
            const { title = '', fileId } = element;
            const newElement = { label: title, value: fileId };
            listContents.push(newElement);
        });
        return listContents;
    };

    submitSpeak = async () => {
        const { fileId = '' } = this.state;
        const { isMeetingDetail } = this.props;
        if (!isMeetingDetail) {
            if (fileId === '') {
                this.setState({
                    validate: Message.MSG0013
                });
                return;
            }
        }

        this.props.toggleModal();
        setTimeout(async () => {
            const ConferenceOpinionEntity = {
                content: '',
                conferenceId: this.props.selectedMeeting.conferenceId,
                status: OPINION_STATUS.SPEAK,
                conferenceFileId: fileId || this.props.fileId,
            };

            const res = await this.props.addOpinionResources({ ConferenceOpinionEntity, isPhatBieu: true });
            const notify = res === 'true' ? Message.MSG0015 : Message.MSG0021;
            await this.props.syncMeeting(notify, isMeetingDetail ? 'speak' : false);
            this.setState({
                validate: '',
                fileId: ''
            });
        }, 450);
    };

    render() {
        const { validate = '' } = this.state;
        const { width, isVisible = false, toggleModal, isMeetingDetail, listContent = [] } = this.props;

        return (
            <Modal
                animationInTiming={400}
                animationOutTiming={500}
                backdropTransitionInTiming={500}
                backdropTransitionOutTiming={500}
                isVisible={isVisible}
                onBackdropPress={() => { this.setState({ validate: '' }); toggleModal(); }}
                backdropColor={'rgb(156,156,156)'}
                hideModalContentWhileAnimating
            >
                <View style={{ backgroundColor: '#ebeff5' }}>
                    <View style={{ backgroundColor: '#316ec4', paddingVertical: 8 }}>
                        <Text style={styles.headerJoinText}>
                            {'Đăng ký phát biểu'}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                        {!isMeetingDetail && (
                            <View style={[styles.flexRowAlignCenter, { marginBottom: 10 }]}>
                                <Text style={{ width: width * 0.2 }}>
                                    {`${TITLE_MEETING.CONTENT}`}
                                    <Text style={{ textAlign: 'center', color: 'red' }}>*{' '}</Text>
                                    <Text>:</Text>
                                </Text>

                                <View style={[styles.flexRowAlignCenter, { justifyContent: 'space-between', backgroundColor: '#fff', marginLeft: 10 }]}>
                                    <Dropdown
                                        data={this.convertListData(listContent)}
                                        containerStyle={{ width: width * 0.5, height: 27, paddingLeft: 10 }}
                                        dropdownPosition={0}
                                        dropdownOffset={{ top: 0, left: 0 }}
                                        inputContainerStyle={{ borderBottomColor: 'transparent' }}
                                        selectedItemColor={'rgba(0, 0, 0, .38)'}
                                        itemColor={'rgba(0, 0, 0, .87)'}
                                        textColor={this.state.fileId === '' ? 'rgba(0, 0, 0, .38)' : 'rgba(0, 0, 0, .87)'}
                                        value={''}
                                        fontSize={15}
                                        onChangeText={(value) => this.setState({ fileId: value, validate: value ? '' : Message.MSG0013 })}
                                    />
                                </View>
                            </View>
                        )}

                        <View style={{ width: width * 0.7 }}>
                            {validate !== '' && (
                                <Text style={{ textAlign: 'center', color: 'red' }}>
                                    {`*${validate}`}
                                </Text>
                            )}
                        </View>

                        <View style={{ width: width * 0.85 + 10, paddingHorizontal: 10 }}>
                            <Text style={{ textAlign: 'center', marginVertical: 20, fontWeight: 'bold' }}>
                                {'Xác nhận đăng ký phát biểu về nội dung này?'}
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.flexRowAlignCenter, styles.buttonJoinContainer, { marginTop: 20 }]}>
                        <TouchableOpacity
                            style={{ backgroundColor: '#316ec4', borderRadius: 4, width: width * 0.38 }}
                            onPress={() => { this.setState({ validate: '' }); toggleModal(); }}
                        >
                            <Text style={{ color: '#fff', paddingVertical: 8, textAlign: 'center' }}>{'Huỷ bỏ'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ backgroundColor: '#316ec4', borderRadius: 4, width: width * 0.38 }}
                            onPress={this.submitSpeak}
                        >
                            <Text style={{ color: '#fff', paddingVertical: 8, textAlign: 'center' }}>{'Đồng ý'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };
};

const mapStateToProps = state => {
    return {
        error: state.ErrorReducer.error,
        selectedMeeting: state.MeetingReducer.selectedMeeting,
        userInfo: state.AuthenReducer.userInfo,
    };
};

export default connect(
    mapStateToProps, {}
)(ModalSpeak);
