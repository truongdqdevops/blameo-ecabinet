import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, Text, Animated } from 'react-native';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { getCountUnreadMessage } from '../../redux/actions/notification.action';
import { updateNotifyWS } from '../../redux/actions/websocket.action';
import styles from './style';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Alert } from 'react-native';

class Notification extends PureComponent {

    constructor(props) {
        super(props)
        this.animatedValue = new Animated.Value(0)
        this.handleAnimation
    }

    componentDidMount = async () => {
        await this.props.getCountUnreadMessage();
    }

    componentDidUpdate = async (prevProps) => {
        if (this.props.wsCountNotify === null) return;
        if (this.props.wsCountNotify !== prevProps.wsCountNotify) {
            await this.props.updateNotifyWS(null);
            this.props.getCountUnreadMessage();
        }
    }
    handleAnimation = () => {
        // A loop is needed for continuous animation
        Animated.loop(
            // Animation consists of a sequence of steps
            Animated.sequence([
                // start rotation in one direction (only half the time is needed)
                Animated.timing(this.animatedValue, { toValue: 1.0, duration: 150, easing: Easing.linear, useNativeDriver: true }),
                // rotate in other direction, to minimum value (= twice the duration of above)
                Animated.timing(this.animatedValue, { toValue: -1.0, duration: 300, easing: Easing.linear, useNativeDriver: true }),
                // return to begin position
                Animated.timing(this.animatedValue, { toValue: 0.0, duration: 150, easing: Easing.linear, useNativeDriver: true })
            ])
        ).start();
    }
    render() {
        return (

            <Animated.View style={{ width: 30 }, {
                transform: [{
                    rotate: this.animatedValue.interpolate({
                        inputRange: [-1, 1],
                        outputRange: ['-0.1rad', '0.1rad']
                    })
                }]
            }} onPress={this.handleAnimation}>
                <IconFA name="bell-o" size={25} color="#fff" />
                {this.props.countUnreadMessage > 0 && (
                    <View style={styles.containerBadge}>
                        <Text style={styles.textBadge}>{this.props.countUnreadMessage}</Text>
                    </View>
                )}
            </Animated.View>
        );
    };
};

const mapStateToProps = state => {
    return {
        error: state.ErrorReducer.error,
        totalMeeting: state.MeetingReducer.totalMeeting,
        countUnreadMessage: state.NotificationReducer.countUnreadMessage,
        wsCountNotify: state.WSReducer.wsCountNotify,
    };
};

export default connect(
    mapStateToProps, {
    getCountUnreadMessage,
    updateNotifyWS,
}
)(Notification);
