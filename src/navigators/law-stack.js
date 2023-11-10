import { createStackNavigator } from 'react-navigation-stack'
import { fromBottom } from 'react-navigation-transitions'
import LawDatabaseScreen from '../components/law-database/law-database'

export default LawStack = createStackNavigator(
    {
        LawDatabaseScreen: {
            screen: LawDatabaseScreen
        }
    },
    {
        initialRouteName: 'LawDatabaseScreen',
        headerMode: 'none',
        transitionConfig: () => fromBottom(600),
        navigationOptions: {
            headerMode: 'screen'
        }
    }
)
