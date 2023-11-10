import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import styles from '../style';

class ModalRefuse extends Component {

    submitRefuse = async () => {
        // const conferenceParticipant = {
        //     conferenceId: this.props.selectedMeeting.conferenceId,
        //     status: PARTICIPANT_STATUS.JOIN,
        //     userId: this.props.userInfo.appUser.id,
        // };

        // const res = await this.props.updateParticipant({ conferenceParticipant });
        // const notify = res === 'true' ? Message.MSG0017 : Message.MSG0003;
        // await this.props.syncMeeting(notify, true);
    };

    onPressSubmit = () => {
        this.props.toggleModal();
        setTimeout(() => {
            this.props.refuseJoin();
        }, 450);
    };

    render() {
        const { width, isVisible = false, toggleModal } = this.props;

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
                <View style={{ backgroundColor: '#ebeff5' }}>
                    <View style={{ backgroundColor: '#316ec4', paddingVertical: 8 }}>
                        <Text style={styles.headerJoinText}>
                            {'Xác nhận'}
                        </Text>
                    </View>

                    <View>
                        <Text style={{ textAlign: 'center', marginTop: 30 }}>
                            {'Xác nhận từ chối tham gia phiên họp?'}
                        </Text>
                        <View style={[styles.flexRowAlignCenter, styles.buttonJoinContainer]}>
                            <TouchableOpacity
                                style={{ backgroundColor: '#316ec4', borderRadius: 4, width: width * 0.38 }}
                                onPress={toggleModal}
                            >
                                <Text style={{ color: '#fff', paddingVertical: 8, textAlign: 'center' }}>{'Huỷ bỏ'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ backgroundColor: '#316ec4', borderRadius: 4, width: width * 0.38 }}
                                onPress={this.onPressSubmit}
                            >
                                <Text style={{ color: '#fff', paddingVertical: 8, textAlign: 'center' }}>{'Đồng ý'}</Text>
                            </TouchableOpacity>
                        </View>
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
)(ModalRefuse);
