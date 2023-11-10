import { createStackNavigator } from 'react-navigation-stack';
import { fromBottom } from 'react-navigation-transitions';
import MeetingScheduleScreen from '../components/meetings/meeting-schedule';
import MeetingScheduleDetailScreen from '../components/meetings/meeting-schedule-detail/meeting-schedule-detail';

export default createStackNavigator(
    {
        MeetingScheduleScreen: {
            screen: MeetingScheduleScreen,
        },
        MeetingScheduleDetailScreen: {
            screen: MeetingScheduleDetailScreen,
        }
    },
    {
        initialRouteName: 'MeetingScheduleScreen',
        headerMode: 'none',
        transitionConfig: () => fromBottom(600),
        navigationOptions: {
            headerMode: 'screen',
        }
    },
);
