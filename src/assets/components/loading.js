import React, { PureComponent } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
} from 'react-native';

class Loading extends PureComponent {
    render() {
        const { loading = false } = this.props;

        return loading && (
            <View style={{ width: '100%', height: '100%', position: 'absolute' }}>
                <View style={{ position: 'absolute', alignSelf: 'center', height: '100%', width: '100%', justifyContent: 'center', zIndex: 1 }}>
                    <ActivityIndicator color={'#316ec4'} size={'large'} style={{ marginBottom: 5 }} />
                    <Text style={{ color: '#316ec4', textAlign: 'center', paddingLeft: 5 }}>{'Loading...'}</Text>
                </View>
                <View style={{ backgroundColor: 'rgb(156,156,156)', flex: 1, opacity: 0.3 }} />
            </View>
        );
    };
};

export default Loading;
