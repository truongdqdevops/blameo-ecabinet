import { createStackNavigator } from 'react-navigation-stack';
import { fromBottom } from 'react-navigation-transitions';
import DocumentHomeScreen from '../components/document/document-home';

export default createStackNavigator(
    {
        DocumentHomeScreen: {
            screen: DocumentHomeScreen,
        },
    },
    {
        initialRouteName: 'DocumentHomeScreen',
        headerMode: 'none',
        transitionConfig: () => fromBottom(600),
        navigationOptions: {
            headerMode: 'screen',
        }
    },
);
