import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import styles from '../style';
import { Message } from '../../../assets/utils/message';

class ModalJoin extends Component {

    submitJoin = async () => {
        // const { conferenceParticipant } = this.props;
        const conferenceParticipant = {
            conferenceParticipantId: this.props.conferenceParticipantIdAssign,
            conferenceId: this.props.selectedMeeting.conferenceId,
            userId: this.props.userId.id,
            checked: false,
            extend: false,
            intExtend: 0,
            type: "MEMBER",
            countOpinion: 0,
            selected:0,
            modifyBy: 0,
            status: 1,
            loaiGiayMoi: "Mời cá nhân"
        };
        const res = await this.props.updateParticipant({ conferenceParticipant });
        const notify = res === 'true' ? Message.MSG0017 : Message.MSG0003;
        await this.props.syncMeeting(notify, true);
    };

    onPressSubmit = () => {
        this.props.toggleModal();
        setTimeout(() => {
            this.submitJoin();
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
                            {'Xác nhận tham gia phiên họp?'}
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

export default ModalJoin;
