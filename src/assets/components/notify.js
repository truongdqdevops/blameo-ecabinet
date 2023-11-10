import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import styles from './style';

class Notify extends PureComponent {
    render() {
        const { header = 'Thông báo', content = '', width, isVisible = false, closeNotify } = this.props;

        return (
            <Modal
                animationInTiming={400}
                animationOutTiming={500}
                backdropTransitionInTiming={500}
                backdropTransitionOutTiming={500}
                isVisible={isVisible}
                onBackdropPress={closeNotify}
                backdropColor={'rgb(156,156,156)'}
                hideModalContentWhileAnimating
            >
                <View style={{ backgroundColor: '#ebeff5' }}>
                    <View style={{ backgroundColor: '#316ec4', paddingVertical: 8 }}>
                        <Text style={styles.headerJoinText}>
                            {header}
                        </Text>
                    </View>

                    <View>
                        <Text style={{ textAlign: 'center', marginTop: 30, paddingHorizontal: 30 }}>
                            {content}
                        </Text>
                        <View style={[styles.flexRow, styles.buttonJoinContainer]}>
                            <TouchableOpacity
                                style={{ backgroundColor: '#026ABD', borderRadius: 4, width: width * 0.38 }}
                                onPress={closeNotify}
                            >
                                <Text style={{ color: '#fff', paddingVertical: 8, textAlign: 'center' }}>{'OK'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal >
        );
    };
};

export default Notify;
