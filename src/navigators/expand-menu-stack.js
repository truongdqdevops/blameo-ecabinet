import { createStackNavigator } from 'react-navigation-stack';
import { fromBottom } from 'react-navigation-transitions';
import ExpandMenuScreen from '../components/expand/expand';
import DocumentStack from './document-stack';
import ChangePasswordStack from '../components/account/change-password';
import LawStack from './law-stack';
import SearchScreen from '../components/search/search';
import ResolutionStack from './resolution-stack';

export default createStackNavigator(
    {
        ExpandMenuScreen: {
            screen: ExpandMenuScreen,
        },
        LawStack: {
            screen: LawStack
        },
        ResolutionStack: {
            screen: ResolutionStack
        },
        DocumentStack: {
            screen: DocumentStack
        },
        ChangePasswordStack: {
            screen: ChangePasswordStack
        },
        SearchStack: {
            screen: SearchScreen
        },
    },
    {
        initialRouteName: 'ExpandMenuScreen',
        headerMode: 'none',
        transitionConfig: () => fromBottom(600),
        navigationOptions: {
            headerMode: 'screen',
        }
    },
);
