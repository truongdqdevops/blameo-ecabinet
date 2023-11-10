import { hostURL } from '../../services/service';
import store from '../../redux/store';
import { updateConferenceWS, updateNotifyWS } from '../../redux/actions/websocket.action';
import { Alert } from 'react-native';
import PushNotification from 'react-native-push-notification';
let ws;
let isOpen = false;

export const WSInitial = () => {
    const linkWS = `ws://${hostURL().replace('https://', '').replace('http://', '').replace('webresources', 'ws')}`;
    ws = new WebSocket(linkWS);
    console.log("WEBSOCKET link" + linkWS)
};
let navigation;
export const WSOpen = () => {
    isOpen = true;
    ws.onopen = () => {
        const { userInfo } = store.getState().AuthenReducer;
        if (userInfo) {
            const pingData = {
                command: '3',
                data: {
                    ping: 'ping',
                    userId: userInfo.appUser.id,
                }
            };
            const stringifyPingData = JSON.stringify(pingData);
            ws.send(stringifyPingData);
            setInterval(() => {
                ws.send(stringifyPingData);
            }, 10000);
            console.log("WEBSOCKET OPEN ,pingData: " + stringifyPingData);
        }
    };
};

export const WSMessage = (gotNavigation) => {
    ws.onmessage = async (e) => {
        const { data } = JSON.parse(e.data);
        const { command = 3 } = JSON.parse(e.data);

        if (data !== 'PONG') {
            const { conferenceId, message } = data;

            //nhan thong bao ve may
            if (command === 10) {
                // console.log("navigation is" + navigation);
                navigation = gotNavigation;
                PushNotification.localNotification({
                    autoCancel: true,
                    bigText:
                        'Đồng chí vừa nhận được thông báo mới.',
                    subText: 'Ấn vào để xem chi tiết',
                    title: message,
                    message: 'Xem thêm',
                    vibrate: true,
                    vibration: 300,
                    playSound: false,
                    soundName: 'default',
                })
                // await store.dispatch(updateNotifyWS(message));
            } else
                //update total thong bao
                if (command === 5) {
                    if (message) {
                        await store.dispatch(updateNotifyWS(message));
                    }
                }
            if (conferenceId) {
                await store.dispatch(updateConferenceWS(conferenceId));
            }

        }
        // console.log("WEBSOCKET DATA" + e.data);
    };
};

export const WSError = () => {
    ws.onerror = (e) => {
        console.log(e.message);
    };
    console.log("WEBSOCKET ERROR" + e.message);
};

export const WSClose = () => {
    if (isOpen) {
        ws.close();
        ws.onclose = (e) => {
            console.log(e.code, e.reason);
        };
        isOpen = false;
    }
    console.log("WEBSOCKET CLOSED");
};
PushNotification.configure({
    // (required) Called when a remote or local notification is opened or received
    onNotification: function (notification) {
        foreground: true, 
        console.log('LOCAL NOTIFICATION ==>', notification);
        //Navigate here
        navigation.navigate('NotificationScreen');
    },
})