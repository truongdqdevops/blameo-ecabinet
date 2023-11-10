import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    Dimensions,
    ActivityIndicator,
    Alert
} from 'react-native';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Modal from 'react-native-modal';
import { ScrollView } from 'react-native-gesture-handler';
import styles from './style';
import CustomHeader from '../../assets/components/header';
import { getAllNotify, getNotifyPostById, updateStatusNotifyObject, getCountUnreadMessage, updateReadAllByUserId } from '../../redux/actions/notification.action';
import { updateNotifyWS } from '../../redux/actions/websocket.action';
import { chooseMeeting } from '../../redux/actions/meetings.action';
import Notify from '../../assets/components/notify';
import { Message } from '../../assets/utils/message';
import { NOTIFY_TYPES_LABEL, TIME_FORMAT, DEFAULT_VALUE_NOTIFY, NOTIFY_OBJECT_TYPE, NOTIFY_ACTION_CODE, NOTIFY_LABELS } from './const';

class Notification extends Component {
    constructor(props) {
        super(props);

        const { width } = Dimensions.get('window');
        this.state = {
            isVisibleNotify: false,
            notify: "",
            width,
            extraData: {
                loading: false,
                isRefreshing: false,
            },
            startDateStr: '',
            endDateStr: moment().format(TIME_FORMAT.DISPLAY),
            endDate: moment().format(TIME_FORMAT.DISPLAY),
            bodyReq: {
                pageSize: DEFAULT_VALUE_NOTIFY.PAGE_SIZE,
                activePage: DEFAULT_VALUE_NOTIFY.ACTIVE_PAGE,
                accountId: this.props.userInfo.appUser.id,
            }
        };
    }

    componentDidMount = () => {
        this.handleReloadScreen();
    };

    componentDidUpdate = async (prevProps) => {
        const { wsCountNotify } = this.props;
        if (wsCountNotify !== null && wsCountNotify !== prevProps.wsCountNotify) {
            await this.props.updateNotifyWS(null);
            this.handleReloadScreen();
        }
    };

    searchNotify = async (isLoadmore) => {
        if (!isLoadmore) {
            this.listNotifyRef.scrollToOffset({ animated: true, offset: 0 });
        }
        let { bodyReq = {} } = this.state;
        const { startDateStr = '', endDateStr = '', listNotify = [] } = this.state;
        bodyReq = {
            ...bodyReq,
            startDateStr,
            endDateStr,
        };

        await this.props.getAllNotify(bodyReq);

        this.setState({
            isRefreshing: false,
            loadingMore: false,
            listNotify: isLoadmore ? listNotify.concat(this.props.listUnreadMessage) : this.props.listUnreadMessage,
        });
    }

    handleReloadScreen = async () => {
        this.setState({
            isRefreshing: true,
            startDateStr: '',
            startDate: '',
            endDateStr: moment().format(TIME_FORMAT.DISPLAY),
            endDate: moment().format(TIME_FORMAT.DISPLAY),
            bodyReq: {
                pageSize: DEFAULT_VALUE_NOTIFY.PAGE_SIZE,
                activePage: DEFAULT_VALUE_NOTIFY.ACTIVE_PAGE,
                accountId: this.props.userInfo.appUser.id,
            }
        }, async () => {
            await Promise.all([
                this.props.getCountUnreadMessage(),
                this.searchNotify()
            ]);
        });
    };

    handleLoadMore = async () => {
        if (this.state.loadingMore) return;
        if (this.props.totalNotify <= DEFAULT_VALUE_NOTIFY.PAGE_SIZE) return;

        this.handleLoading(true);
        const { bodyReq = {} } = this.state;
        const { activePage, pageSize } = bodyReq;

        if (activePage * pageSize >= this.props.totalNotify) {
            this.handleLoading(false);
            return;
        }

        const newActivePage = bodyReq.activePage + 1;
        const newBodyReq = { ...bodyReq, activePage: newActivePage };

        this.setState({
            bodyReq: newBodyReq,
        }, async () => {
            await this.searchNotify(true);
        });
    };

    handleLoading = (loading) => {
        this.setState({
            loadingMore: loading,
        });
    };

    handleSearch = () => {
        const { startDate = '', endDate = '' } = this.state;
        this.setState({
            startDateStr: startDate,
            endDateStr: endDate,
            bodyReq: {
                pageSize: DEFAULT_VALUE_NOTIFY.PAGE_SIZE,
                activePage: DEFAULT_VALUE_NOTIFY.ACTIVE_PAGE,
                accountId: this.props.userInfo.appUser.id,
            }
        }, async () => {
            await this.searchNotify();
        });
    }

    handleCheckAll = () => {
        Alert.alert(
            "Xác nhận",
            "Đồng chí có muốn đánh dấu đã đọc cho tất cả thông báo không?",
            [
                {
                    text: "Huỷ",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Đọc tất cả", onPress: () =>
                        this.confirmReadAllNotifications()
                }

            ]
        );
    }

    confirmReadAllNotifications = () => {
        setTimeout(async () => {
            const res = await this.props.updateReadAllByUserId({})
            const notify = res === 'true' ? Message.MSG0033 : Message.MSG0003;
            this.setState({
                notify: notify,
                isVisibleNotify: true
            })
            this.handleReloadScreen()
        }, 450);
    }

    directFuncNoti = async (objectType, actionCode, body) => {
        if (NOTIFY_OBJECT_TYPE.CONFERENCE === objectType || NOTIFY_ACTION_CODE.CONFERENCE === actionCode) {
            await Promise.all([
                this.props.chooseMeeting(body.notifyPostId, 0),
                !body.status && this.props.updateStatusNotifyObject(body.id),
            ]);
            this.props.getCountUnreadMessage();
            this.props.navigation.navigate('MeetingScheduleScreen', { from: 'Notification' });
        } else if (NOTIFY_OBJECT_TYPE.FILE === objectType || NOTIFY_ACTION_CODE.FILE === actionCode) {
            await Promise.all([
                !body.status && this.props.updateStatusNotifyObject(body.id),
            ]);
            this.props.getCountUnreadMessage();
            this.props.navigation.navigate('FeedbackScreen', { fileId: body.notifyPostId });
        } else if (NOTIFY_OBJECT_TYPE.NOTIFY === objectType || NOTIFY_ACTION_CODE.NOTIFY === actionCode) {
            this.setState({
                isVisibleDetailNotify: true,
                loadingDetail: true,
            }, async () => {
                await this.props.getNotifyPostById(body);
                const { listNotify = [] } = this.state;
                this.setState({
                    loadingDetail: false,
                    listNotify: listNotify.map(element => body.id === element.id ? { ...element, status: 1 } : element),
                }, () => this.props.getCountUnreadMessage());
            });
        }
        await this.props.getCountUnreadMessage();
    }

    renderItem = ({ item = {} }) => {
        const {
            content = '',
            createdDate = '',
            objectType = '',
            actionCode = '',
            status = 0,
            notifyPostId,
            id,
        } = item;

        const backgroundItem = { backgroundColor: status ? '#fff' : '#d6e2f3' };
        const date = moment(new Date(createdDate)).format(TIME_FORMAT.DISPLAY_DETAIL);

        return (
            <TouchableOpacity onPress={() => this.directFuncNoti(objectType, actionCode, { notifyPostId, id, status })}>
                <View style={[styles.containerItem, backgroundItem]}>
                    <View>
                        <Text style={{ fontSize: 15 }} numberOfLines={3}>{content}</Text>
                    </View>
                    <View style={[styles.flexRow, { marginTop: 3 }]}>
                        <Text style={{ color: 'grey' }}>{date}</Text>
                        <Text>{' | '}</Text>
                        <Text style={{ color: 'red' }}>{NOTIFY_TYPES_LABEL[objectType] || NOTIFY_TYPES_LABEL[actionCode]}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    handleRotate = event => {
        const { nativeEvent: { layout: { width } = {} } = {} } = event;
        this.setState({ width });
    }

    handleDatePicked = (type) => (date) => {
        const inputDate = moment(date).format(TIME_FORMAT.DISPLAY);
        if (type === 'start') {
            this.setState({
                startDate: inputDate,
                notifyTimeStart: false,
            });
            return;
        };

        if (type === 'end') {
            this.setState({
                endDate: inputDate,
                notifyTimeEnd: false,
            });
            return;
        };
    };

    renderFooter = () => {
        if (!this.state.loadingMore) return null;
        return (
            <ActivityIndicator
                style={{ marginVertical: 10 }}
                color={'#316ec4'}
                size={'large'}
            />
        );
    };

    toggleDetailNotifyModal = (status) => () => this.setState({ isVisibleDetailNotify: status });

    render() {
        const { width, listNotify = [], startDate = '', endDate = '', isVisibleDetailNotify = false, loadingDetail = false, isVisibleNotify, notify } = this.state;
        const { detailSelectedNotify = {} } = this.props;
        const { title = '', content = '' } = detailSelectedNotify;

        return (
            <View style={styles.container}>
                <CustomHeader
                    title={'HỆ THỐNG THÔNG TIN PHỤC VỤ HỌP VÀ XỬ LÝ CÔNG VIỆC'}
                    // title={'HỆ THỐNG THÔNG TIN PHỤC VỤ HỌP VÀ XỬ LÝ CÔNG VIỆC CỦA UBND'}
                    navigation={this.props.navigation}
                    width={width}
                />
                <View style={{ flex: 1 }}>
                    <View style={[styles.inputDateContainer, styles.boderBottom]}>
                        <View style={styles.inputDate}>
                            <View style={{ width: width * 0.2, minWidth: 80 }}>
                                <Text>{'Từ ngày'}</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ notifyTimeStart: true })}>
                                <View style={[styles.flexRow, styles.timeSearch, { width: width * 0.5 }]}>
                                    <Text style={{ paddingLeft: 10 }}>
                                        {startDate || TIME_FORMAT.DISPLAY}
                                    </Text>

                                    <IconM name={'menu-down'} size={25} color={'#8b8b8b'} />
                                </View>
                            </TouchableOpacity>
                            <View style={{ flex: 1, alignItems: 'flex-end', width: width * 0.2 }}>
                                <TouchableOpacity onPress={this.handleCheckAll}>
                                    <View style={[styles.buttonCheckAll, { justifyContent: 'center', alignItems: 'center' }]}>
                                        <IconM name={'check-all'} size={18} color={'#fff'} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputDate}>
                            <View style={{ width: width * 0.2, minWidth: 80 }}>
                                <Text>{'Đến ngày'}</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ notifyTimeEnd: true })}>
                                <View style={[styles.flexRow, styles.timeSearch, { width: width * 0.5 }]}>
                                    <Text style={{ paddingLeft: 10 }}>
                                        {endDate}
                                    </Text>

                                    <IconM name={'menu-down'} size={25} color={'#8b8b8b'} />
                                </View>
                            </TouchableOpacity>
                            <View style={{ flex: 1, alignItems: 'flex-end', width: width * 0.2 }}>
                                <TouchableOpacity onPress={this.handleSearch}>
                                    <View style={[styles.buttonSearch,]}>
                                        <Text style={{ textAlign: 'center', textAlignVertical: 'center', color: '#fff' }}>{'Tìm kiếm'}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 10 }}>
                        <FlatList
                            ref={(ref) => { this.listNotifyRef = ref; }}
                            data={listNotify}
                            extraData={this.state.extraData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.renderItem}
                            refreshing
                            ListFooterComponent={this.renderFooter}
                            onEndReachedThreshold={0.4}
                            onEndReached={this.handleLoadMore}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this.handleReloadScreen}
                                    tintColor={'#316ec4'}
                                />
                            }
                        />
                    </View>

                    <DateTimePicker
                        date={!startDate ? new Date() : moment(startDate, TIME_FORMAT.DISPLAY).toDate()}
                        mode={'date'}
                        locale={'vi_VN'}
                        isVisible={this.state.notifyTimeStart}
                        onConfirm={this.handleDatePicked('start')}
                        onCancel={() => this.setState({ notifyTimeStart: false })}
                    />

                    <DateTimePicker
                        date={!endDate ? new Date() : moment(endDate, TIME_FORMAT.DISPLAY).toDate()}
                        mode={'date'}
                        locale={'vi_VN'}
                        isVisible={this.state.notifyTimeEnd}
                        onConfirm={this.handleDatePicked('end')}
                        onCancel={() => this.setState({ notifyTimeEnd: false })}
                    />
                </View>

                <Modal
                    animationInTiming={400}
                    animationOutTiming={500}
                    backdropTransitionInTiming={500}
                    backdropTransitionOutTiming={500}
                    isVisible={isVisibleDetailNotify}
                    backdropColor={'rgb(156,156,156)'}
                    hideModalContentWhileAnimating
                >
                    <View style={{ backgroundColor: '#ebeff5' }}>
                        <View style={{ backgroundColor: '#316ec4', paddingVertical: 8 }}>
                            <Text style={styles.headerJoinText}>
                                {NOTIFY_LABELS.HEADER_DETAIL}
                            </Text>
                        </View>

                        {loadingDetail ? (
                            <ActivityIndicator
                                style={{ marginVertical: 10 }}
                                color={'#316ec4'}
                                size={'large'}
                            />
                        ) : (
                            <View style={{ paddingHorizontal: 12 }}>
                                <Text style={{ marginTop: 20 }}>
                                    <Text style={{ fontWeight: 'bold' }}>{'Tiêu đề: '}</Text>
                                    {title}
                                </Text>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ textAlign: 'left', fontWeight: 'bold' }}>{'Nội dung: '}</Text>
                                    <ScrollView style={{ maxHeight: 100, marginTop: 3 }}>
                                        <Text style={{ textAlign: 'justify' }}>{content}</Text>
                                    </ScrollView>
                                </View>
                                <View style={[styles.flexRow, styles.buttonJoinContainer]}>
                                    <TouchableOpacity
                                        style={{ backgroundColor: '#026ABD', borderRadius: 4, width: width * 0.38 }}
                                        onPress={this.toggleDetailNotifyModal(false)}
                                    >
                                        <Text style={{ color: '#fff', paddingVertical: 8, textAlign: 'center' }}>{'OK'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                </Modal >
                <Notify
                    isVisible={isVisibleNotify}
                    content={notify}
                    width={this.state.width}
                    closeNotify={() => this.setState({ isVisibleNotify: false })}
                />
            </View>
        );
    }
};

const mapStateToProps = state => {
    return {
        error: state.ErrorReducer.error,
        listUnreadMessage: state.NotificationReducer.listUnreadMessage,
        detailSelectedNotify: state.NotificationReducer.detailSelectedNotify,
        totalNotify: state.NotificationReducer.totalNotify,
        wsCountNotify: state.WSReducer.wsCountNotify,
        userInfo: state.AuthenReducer.userInfo,
    };
};

export default connect(
    mapStateToProps, {
    getAllNotify,
    updateNotifyWS,
    getNotifyPostById,
    chooseMeeting,
    updateStatusNotifyObject,
    getCountUnreadMessage,
    updateReadAllByUserId,
}
)(Notification);
