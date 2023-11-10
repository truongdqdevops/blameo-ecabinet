import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import styles from './style';

class Confirm extends PureComponent {
    render() {
        const { width, isVisible = false, titleHeader = '', content = '', contentCancel = '', onCancel, onOk } = this.props;

        return (
            <Modal
                animationInTiming={400}
                animationOutTiming={500}
                backdropTransitionInTiming={500}
                backdropTransitionOutTiming={500}
                isVisible={isVisible}
                onBackdropPress={onCancel}
                backdropColor={'rgb(156,156,156)'}
                hideModalContentWhileAnimating
            >
                <View style={{ backgroundColor: '#ebeff5' }}>
                    <View style={{ backgroundColor: '#316ec4', paddingVertical: 8 }}>
                        <Text style={styles.headerJoinText}>
                            {titleHeader || 'Xác nhận'}
                        </Text>
                    </View>

                    <View>
                        <Text style={{ textAlign: 'center', marginTop: 30 }}>
                            {content}
                        </Text>
                        <View style={[styles.flexRow, styles.buttonJoinContainer]}>
                            <TouchableOpacity
                                style={{ backgroundColor: '#026ABD', borderRadius: 4, width: width * 0.38 }}
                                onPress={onCancel}
                            >
                                <Text style={{ color: '#fff', paddingVertical: 8, textAlign: 'center' }}>{contentCancel || 'Huỷ bỏ'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ backgroundColor: '#026ABD', borderRadius: 4, width: width * 0.38 }}
                                onPress={onOk}
                            >
                                <Text style={{ color: '#fff', paddingVertical: 8, textAlign: 'center' }}>{'Đồng ý'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal >
        );
    };
};

export default Confirm;
