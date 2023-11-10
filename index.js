/**
 * @format
 */
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/crashlytics';
import '@react-native-firebase/analytics';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { YellowBox } from 'react-native';
if (__DEV__) {
    import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}
YellowBox.ignoreWarnings([
    'Warning: componentWillMount is deprecated',
    'Warning: componentWillUpdate is deprecated',
    'Warning: componentWillReceiveProps is deprecated',
]);
AppRegistry.registerComponent(appName, () => App);
console.disableYellowBox = true;
