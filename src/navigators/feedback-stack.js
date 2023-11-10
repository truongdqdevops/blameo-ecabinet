import { createStackNavigator } from 'react-navigation-stack'
import { fromBottom } from 'react-navigation-transitions'
import FeedbackScreen from '../components/feedback/feedback'
import FeedbackResultScreen from '../components/feedback/feedback-result'
import FeedbackResultDetailScreen from '../components/feedback/feedback-result-detail'

export default FeedbackStack = createStackNavigator(
    {
        FeedbackScreen: {
            screen: FeedbackScreen
        },
        FeedbackResultScreen: {
            screen: FeedbackResultScreen
        },
        FeedbackResultDetailScreen: {
            screen: FeedbackResultDetailScreen
        }
    },
    {
        initialRouteName: 'FeedbackScreen',
        headerMode: 'none',
        transitionConfig: () => fromBottom(600),
        navigationOptions: {
            headerMode: 'screen'
        }
    }
)
