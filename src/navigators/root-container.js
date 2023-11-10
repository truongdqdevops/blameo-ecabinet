import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Text, View } from 'react-native';
//  import { fromBottom } from 'react-navigation-transitions';
import IconFA from 'react-native-vector-icons/FontAwesome';
import LoginScreen from '../components/login/login';
import UnitScreen from '../components/login/unit';
import OTPScreen from '../components/login/otp'
import HomeScreen from '../components/home/home';
import MeetingScheduleStack from './meetings-stack';
import FeedbackStack from './feedback-stack';
import NotificationStack from './notification-stack';
import Notification from '../assets/components/notification';
import ExpandMenuStack from './expand-menu-stack';

const BottomTabNavigator = createBottomTabNavigator(
    {
        HomeStack: {
            screen: HomeScreen,
            navigationOptions: {
                tabBarLabel: <Text style={{ textAlign: 'center', color: '#fff', paddingBottom: 3 }}>Trang chủ</Text>,
                tabBarIcon: <IconFA name="home" size={25} color="#fff" />
            }
        },
        MeetingScheduleStack: {
            screen: MeetingScheduleStack,
            navigationOptions: {
                tabBarLabel: <Text style={{ textAlign: 'center', color: '#fff', paddingBottom: 3 }}>Lịch họp</Text>,
                tabBarIcon: <IconFA name="calendar" size={23} color="#fff" />
            }
        },
        FeedbackStack: {
            screen: FeedbackStack,
            navigationOptions: {
                tabBarLabel: <Text style={{ textAlign: 'center', color: '#fff', paddingBottom: 3 }}>Lấy ý kiến</Text>,
                tabBarIcon: <View style={{ width: 30, flexDirection: 'row', justifyContent: 'center' }}>
                    <IconFA name="commenting-o" size={25} color="#fff" />
                </View>
            }
        },
        NotificationStack: {
            screen: NotificationStack,
            navigationOptions: {
                tabBarLabel: <Text style={{ textAlign: 'center', color: '#fff', paddingBottom: 3 }}>Thông báo</Text>,
                tabBarIcon: <Notification />,
            }
        },
        ExpandMenuStack: {
            screen: ExpandMenuStack,
            navigationOptions: {
                tabBarLabel: <Text style={{ textAlign: 'center', color: '#fff', paddingBottom: 3 }}>Mở rộng</Text>,
                tabBarIcon: <IconFA name="navicon" size={25} color="#fff" />
            }
        },
        // ResolutionStack: {
        //     screen: ResolutionStack,
        //     navigationOptions: {
        //         tabBarLabel: <Text style={{ textAlign: 'center', color: '#fff', paddingBottom: 3 }}>Nghị quyết</Text>,
        //         tabBarIcon: <IconFA name="file-text-o" size={23} color="#fff" />
        //     }
        // },
        // DocumentStack: {
        //     screen: DocumentStack,
        //     navigationOptions: {
        //         tabBarLabel: <Text style={{ textAlign: 'center', color: '#fff', paddingBottom: 3 }}>Kho tài liệu</Text>,
        //         tabBarIcon: <IconFA name="file-zip-o" size={23} color="#fff" />
        //     }
        // },
        // LawDatabaseStack: {
        //     screen: LawStack,
        //     navigationOptions: {
        //         tabBarLabel: <Text style={{ textAlign: 'center', color: '#fff', paddingBottom: 3 }}>CSDL Luật</Text>,
        //         tabBarIcon: <IconFA name="inbox" size={27} color="#fff" />
        //     }
        // },
        // SearchStack: {
        //     screen: SearchScreen,
        //     navigationOptions: {
        //         tabBarLabel: <Text style={{ textAlign: 'center', color: '#fff', paddingBottom: 3 }}>Tìm kiếm</Text>,
        //         tabBarIcon: <IconFA name="search" size={25} color="#fff" />
        //     }
        // }
    },
    {
        initialRouteName: 'HomeStack',
        resetOnBlur: true,
        navigationOptions: {
            gesturesEnabled: false,
            header: null
        },
        swipeEnabled: false,
        tabBarOptions: {
            pressColor: '#142a49',
            inactiveBackgroundColor: '#26436f',
            activeBackgroundColor: '#2e5fa4',
            showLabel: true,
            showIcon: true,
            safeAreaInset: { bottom: 'never', top: 'never' },
            style: {
                height: 56,
                flexDirection: 'row',
                alignItem: 'center',
                backgroundColor: '#1d3c68',
            },
            labelStyle: {},
            tabStyle: {
                flex: 1,
                justifyContent: 'space-evenly',
                width: 95,
            },
        },
        lazy: true
    }
);
const BottomTabNavigatorHidePLYK = createBottomTabNavigator(
    {
        HomeStack: {
            screen: HomeScreen,
            navigationOptions: {
                tabBarLabel: <Text style={{ textAlign: 'center', color: '#fff', paddingBottom: 3 }}>Trang chủ</Text>,
                tabBarIcon: <IconFA name="home" size={25} color="#fff" />
            }
        },
        MeetingScheduleStack: {
            screen: MeetingScheduleStack,
            navigationOptions: {
                tabBarLabel: <Text style={{ textAlign: 'center', color: '#fff', paddingBottom: 3 }}>Lịch họp</Text>,
                tabBarIcon: <IconFA name="calendar" size={23} color="#fff" />
            }
        },
        NotificationStack: {
            screen: NotificationStack,
            navigationOptions: {
                tabBarLabel: <Text style={{ textAlign: 'center', color: '#fff', paddingBottom: 3 }}>Thông báo</Text>,
                tabBarIcon: <Notification />,
            }
        },

        ExpandMenuStack: {
            screen: ExpandMenuStack,
            navigationOptions: {
                tabBarLabel: <Text style={{ textAlign: 'center', color: '#fff', paddingBottom: 3 }}>Mở rộng</Text>,
                tabBarIcon: <IconFA name="navicon" size={25} color="#fff" />
            }
        },

    },
    {
        initialRouteName: 'HomeStack',
        resetOnBlur: true,
        navigationOptions: {
            gesturesEnabled: false,
            header: null
        },
        swipeEnabled: false,
        tabBarOptions: {
            pressColor: '#142a49',
            inactiveBackgroundColor: '#26436f',
            activeBackgroundColor: '#2e5fa4',
            showLabel: true,
            showIcon: true,
            safeAreaInset: { bottom: 'never', top: 'never' },
            style: {
                height: 56,
                flexDirection: 'row',
                alignItem: 'center',
                backgroundColor: '#1d3c68',
            },
            labelStyle: {},
            tabStyle: {
                flex: 1,
                justifyContent: 'space-evenly',
                width: 95,
            },
        },
        lazy: true
    }
);
const AppNavigator = createStackNavigator(
    {
        // start
        StartScreen: {
            screen: LoginScreen
        },
        UnitScreen: {
            screen: UnitScreen
        },
        OTPScreen:{
            screen: OTPScreen
        },
        BottomStack: {
            screen: BottomTabNavigator
        },
        BottomStackHidePLYK: {
            screen: BottomTabNavigatorHidePLYK
        },
    },
    {
        initialRouteName: 'StartScreen',
        headerMode: 'none',
        // transitionConfig: () => fromBottom(600)
    }
);

const AppContainer = createAppContainer(AppNavigator);
export default AppContainer;