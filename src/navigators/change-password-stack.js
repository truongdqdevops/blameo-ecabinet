import { createStackNavigator } from 'react-navigation-stack';
import { fromBottom } from 'react-navigation-transitions';
import ChangePasswordScreen from '../components/account/change-password';
export default createStackNavigator(
    {
        ChangePasswordScreen: {
            screen: ChangePasswordScreen,
        },
    },
    {
        initialRouteName: 'ChangePasswordScreen ',
        headerMode: 'none',
        transitionConfig: () => fromBottom(600),
        navigationOptions: {
            headerMode: 'screen',
        }
    },
);
