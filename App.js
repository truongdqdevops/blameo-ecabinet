import React, { PureComponent } from 'react';
import { SafeAreaView } from 'react-native';
import { Provider } from 'react-redux';
import Store from './src/redux/store';
import AppContainer from './src/navigators/root-container';

export default class App extends PureComponent {
    render() {
        return (
            <Provider store={Store}>
                <SafeAreaView style={{ flex: 1 }}>
                    <AppContainer />
                </SafeAreaView>
            </Provider>
        );
    }
}
