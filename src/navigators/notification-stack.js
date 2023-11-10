import { createStackNavigator } from 'react-navigation-stack';
import { fromBottom } from 'react-navigation-transitions';
import NotificationScreen from '../components/notification/notification';

export default createStackNavigator(
    {
        NotificationScreen: {
            screen: NotificationScreen,
        },
    },
    {
        initialRouteName: 'NotificationScreen',
        headerMode: 'none',
        transitionConfig: () => fromBottom(600),
        navigationOptions: {
            headerMode: 'screen',
        }
    },
);
