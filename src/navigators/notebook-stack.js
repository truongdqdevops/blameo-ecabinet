import { createStackNavigator } from 'react-navigation-stack';
import { fromBottom } from 'react-navigation-transitions';
import NotebookScreen from '../components/document/notebook';

export default createStackNavigator(
    {
        NotebookScreen: {
            screen: NotebookScreen,
        },
    },
    {
        initialRouteName: 'NotebookScreen',
        headerMode: 'none',
        transitionConfig: () => fromBottom(600),
        navigationOptions: {
            headerMode: 'screen',
        }
    },
);
