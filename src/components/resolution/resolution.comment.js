import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import stylesCommon from '../../assets/css/style-common';

class ModalComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: null
        };
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
                <View style={{ backgroundColor: '#ebeff5' }}>
                    <View style={[stylesCommon.row, stylesCommon.spaceBetween]}>
                        <View style={[stylesCommon.ml20, stylesCommon.mt10]}>
                            <Text style={stylesCommon.lblCustomBlue}> Góp ý cho dự thảo nghị quyết</Text>
                        </View>
                        <TouchableOpacity style={stylesCommon.border} onPress={closeModal}>
                            <IconM name="close" size={25} color="silver" />
                        </TouchableOpacity>
                    </View>
                    <View style={stylesCommon.container}>
                        <View style={stylesCommon.mb10}>
                            <TextInput
                                style={[stylesCommon.txtMutipleLine, { height: 200, textAlignVertical: 'top' }]}
                                scrollEnabled
                                placeholder='Nhập nội dung góp ý'
                                multiline
                                numberOfLines={10}
                                onChangeText={txt => {
                                    this.setState({ content: txt });
                                }}
                            />
                        </View>
                        <View>
                            <Text style={[stylesCommon.lblCustomBlue, stylesCommon.fontSize12]}>Sửa trực tiếp trên dự thảo</Text>
                        </View>
                        <View style={[stylesCommon.row, stylesCommon.right]}>
                            <View style={stylesCommon.mr10}>
                                <TouchableOpacity style={[stylesCommon.circleButton, stylesCommon.backgroundCustomBlue]} onPress={confirmModal(this.state.content)}>
                                    <IconM name="check" size={25} color="white" />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity style={[stylesCommon.circleButton, stylesCommon.backgroundGray]} onPress={closeModal}>
                                    <IconM name="close" size={25} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };
};

export default ModalComment;
