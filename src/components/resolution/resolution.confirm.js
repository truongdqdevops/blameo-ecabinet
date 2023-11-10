import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import stylesCommon from '../../assets/css/style-common';

class ModalConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { isVisible = false, height, closeModal, confirmModal } = this.props;

        return (
            <Modal
                animationIn="bounceInDown"
                animationOut="bounceOutUp"
                // backdropColor="#C4C4C4"
                style={{ height }}
                isVisible={isVisible}
                onBackdropPress={closeModal}
                backdropColor={'rgb(0,0,0)'}
                animationInTiming={200}
                animationOutTiming={200}
                backdropTransitionInTiming={200}
                backdropTransitionOutTiming={0}
            >
                <View style={[stylesCommon.column, { backgroundColor: '#ebeff5' }]}>
                    <View style={[stylesCommon.container, stylesCommon.alignCen]}>
                        <Text style={[stylesCommon.bold, stylesCommon.lblBack]}> Xác nhận </Text>
                    </View>
                    <View>
                        <Text style={[stylesCommon.ml30, stylesCommon.mr5, stylesCommon.mb20]}>
                            Tôi ĐỒNG Ý với tất cả các nội dung trong Dự thảo Nghị quyết ?
                        </Text>
                    </View>
                    <View style={[stylesCommon.row, stylesCommon.mt15]}>
                        <View style={[stylesCommon.w50, stylesCommon.alignCen, stylesCommon.border]}>
                            <TouchableOpacity style={[stylesCommon.mt10, stylesCommon.mb10]} onPress={closeModal}>
                                <Text style={stylesCommon.lblCustomBlue}> Huỷ bỏ</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[stylesCommon.w50, stylesCommon.alignCen, stylesCommon.border]}>
                            <TouchableOpacity style={[stylesCommon.mt10, stylesCommon.mb10]} onPress={confirmModal}>
                                <Text style={[stylesCommon.lblCustomBlue, stylesCommon.bold]}>Đồng ý</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };
};

export default ModalConfirm;
