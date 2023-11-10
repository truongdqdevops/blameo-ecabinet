import { createStackNavigator } from 'react-navigation-stack';
import { fromBottom } from 'react-navigation-transitions';
import ResolutionScreen from '../components/resolution/resolution';

export default DocumentStack = createStackNavigator(
    {
        ResolutionScreen: {
            screen: ResolutionScreen,
        },
        
    },
    {
        initialRouteName: 'ResolutionScreen',
        headerMode: 'none',
        transitionConfig: () => fromBottom(600),
        navigationOptions: {
            headerMode: 'screen',
        }
    },
);
