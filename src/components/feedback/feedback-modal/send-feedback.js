/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

class ModalSendFeedback extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    };

    sendFeedback = async () =>{
        const {fileId} = this.props.selectedFeedback;
        const res  = await this.props.sendFileToVoOffice({fileId});
        await this.props.syncFeedback(res, false);
    }

    render() {
        const { width, isVisible = false, toggleModal } = this.props;

        return (
            <Modal
                isVisible={isVisible}
                onBackdropPress={toggleModal}
                backdropColor={'rgb(156,156,156)'}
                animationInTiming={400}
                animationOutTiming={500}
                backdropTransitionInTiming={500}
                backdropTransitionOutTiming={500}
                hideModalContentWhileAnimating
            >
                <View style={{ backgroundColor: '#EBEFF5' }}>
                    <View style={{ backgroundColor: '#326EC4', paddingVertical: 8 }}>
                        <Text style={styles.headerJoinText}>
                            {'Gửi văn thư'}
                        </Text>
                    </View>

                    <View>
                        <Text style={{ textAlign: 'center', marginTop: 30, fontSize: 15 }}>
                            {'Xác nhận chuyển văn thư cơ quan để gửi đơn vị tham mưu xử lý ?'}
                        </Text>
                        <View style={[styles.flexRow, styles.buttonJoinContainer]}>
                            <TouchableOpacity
                                style={{ backgroundColor: '#326EC4', width: width * 0.38 }}
                                onPress={toggleModal}
                            >
                                <Text style={styles.txtButton}>{'Huỷ bỏ'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ backgroundColor: '#326EC4', width: width * 0.38 }}
                                onPress={() => { toggleModal(); this.sendFeedback(); }}
                            >
                                <Text style={styles.txtButton}>{'Đồng ý'}</Text>
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
        selectedFeedback: state.FeedbackReducer.selectedFeedback,
    };
};

export default connect(
    mapStateToProps, {}
)(ModalSendFeedback);

const styles = StyleSheet.create({
    headerJoinText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15
    },

    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    buttonJoinContainer: {
        justifyContent: 'space-evenly',
        marginTop: 30,
        marginBottom: 15
    },

    txtButton: {
        color: '#fff',
        paddingVertical: 8,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15
    }
});
