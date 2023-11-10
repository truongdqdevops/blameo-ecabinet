import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    FlatList,
    TextInput,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconB from 'react-native-vector-icons/FontAwesome';
import Drawer from 'react-native-drawer';
import styles from './style';
import MHeader from '../../assets/components/header';
import Loading from '../../assets/components/loading';
import ModalComment from './resolution.comment';
import ModalConfirm from './resolution.confirm';
import ModalAttachFile from './resolution.modal';
import Notify from '../../assets/components/notify';
import { Constants } from '../../assets/utils/constants';
import { getListResolution, getResolutionById, confirmResolution, commentResolution } from '../../redux/actions/resolution.action';
import { chooseMeeting, getMeetingById } from '../../redux/actions/meetings.action';

class Resolution extends Component {
    constructor(props) {
        super(props);
        const { width, height } = Dimensions.get('window');

        this.state = {
            width,
            height,
            lstItem: [],
            selectedItem: {},
            isConfirm: false,
            isComment: false,
            isDrawerOpen: false,
            isVisibleAttach: false,
            tableData: [],
            extraData: {
                loading: false,
                isRefreshing: false,
            },
            keyword: '',
            pageSize: 20,
            activePage: 0,
        };
    }

    componentDidMount = async () => {
        this.setState({ firstLoading: true });
        await this.loadData(null);
        this.setState({ firstLoading: false });
    }

    search = async () => {
        const { keyword, pageSize, extraData } = this.state;

        this.setState({
            extraData: { ...extraData, isRefreshing: true },
        });
        await this.props.getListResolution(keyword, pageSize, 0);
        this.setState({
            extraData: { ...extraData, isRefreshing: false },
            lstItem: this.props.listResolution,
            activePage: 0
        });
    }

    selectItem = (id) => async () => {
        await this.props.getResolutionById(id);
        this.setState({
            selectedItem: this.props.selectedResolution
        });
        this.openControlPanel();
    };

    loadData = async (conclusionId) => {
        await this.search();
        if (this.state.lstItem.length > 0) {
            const id = !conclusionId ? this.state.lstItem[0].id : conclusionId;
            await this.props.getResolutionById(id);
            this.setState({
                selectedItem: this.props.selectedResolution
            });
        }
    };

    confirm = (conclusionId, conclusionResultId) => async () => {
        let contentNoti = '';
        await this.props.confirmResolution(conclusionId, conclusionResultId, Constants.RESOLUTION_STATUS.ANSWED);
        await this.loadData(conclusionId);
        if (this.props.confirmSuccess) {
            contentNoti = 'Xác nhận ĐỒNG Ý với tất cả các nội dung trong Dự thảo Nghị quyết thành công!';
        } else {
            contentNoti = 'Xác nhận ĐỒNG Ý với tất cả các nội dung trong Dự thảo Nghị quyết thất bại!';
        }
        this.setState({ isConfirm: false, isVisibleNotify: true, contentNotify: contentNoti });
    }

    comment = (conclusionId, content) => async () => {
        await this.props.commentResolution(conclusionId, content, Constants.RESOLUTION_STATUS.COMMENT);
        await this.loadData(conclusionId);
        this.setState({ isComment: false });
    }

    handleRotate = event => {
        const { nativeEvent: { layout: { width } = {} } = {} } = event;
        this.setState({
            width
        });
    };

    openControlPanel = () => {
        if (!this.state.isDrawerOpen) {
            this._drawer.open();
            this.setState({
                isDrawerOpen: true,
            });
        } else {
            this._drawer.close();
            this.setState({
                isDrawerOpen: false,
            });
        }
    };

    resolutionLink1() {
        this.setState({ isVisibleAttach: true, title: 'CÔNG VĂN LẤY Ý KIÊN DỰ THẢO NGHỊ QUYẾT', tableData: this.props.selectedResolution.lstFileResolution });
    }

    resolutionLink2 = (chosenMeeting, chosenContent = 0) => async () => {
        if (chosenMeeting) {
            await this.props.chooseMeeting(chosenMeeting, chosenContent);
            this.props.navigation.navigate('MeetingScheduleScreen');
        }
    }

    resolutionLink3() {
        this.setState({ isVisibleAttach: true, title: 'HỒ SƠ KÈM THEO', tableData: this.props.selectedResolution.lstFileAttachDocument });
    }

    resolutionLink4() {
        this.setState({ isVisibleAttach: true, title: 'NỘI DUNG DỰ THẢO NGHỊ QUYẾT', tableData: this.props.selectedResolution.lstFileResolutionContent });
    }

    handleLoadMore = async () => {
        const { keyword, activePage, pageSize, lstItem } = this.state;

        if (this.state.extraData.loading) return;
        this.handleLoading(true);

        if (this.props.listResolution.length === 0) {
            this.handleLoading(false);
            return;
        }
        const newActivePage = activePage + 1;
        await this.props.getListResolution(keyword, pageSize, newActivePage);
        this.setState({
            activePage: newActivePage,
            lstItem: lstItem.concat(this.props.listResolution),
        });
        this.handleLoading(false);
    };

    handleLoading = (loading) => {
        this.setState({
            extraData: { ...this.state.extraData, loading }
        });
    }

    renderFooter = () => {
        if (!this.state.extraData.loading) return null;
        return (
            <ActivityIndicator
                style={{ color: '#000', marginVertical: 10 }}
            />
        );
    };

    onRefresh = async () => {
        const { keyword, pageSize, extraData } = this.state;
        this.setState({
            extraData: { ...extraData, isRefreshing: true },
        });
        await this.props.getListResolution(keyword, pageSize, 0);
        this.setState({
            lstItem: this.props.listResolution,
            extraData: { ...extraData, isRefreshing: false },
            activePage: 0,
        });
    }

    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={this.selectItem(item.id)}>
                <View style={[styles.boderBottom, styles.containerItem, { backgroundColor: 'white' }]}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                            <Text>{`${index + 1}. ${item.titles}`}</Text>
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
                        <View>
                            <Text>Hạn trả lời: {item.expiredDate}</Text>
                        </View>
                        <View>
                            {item.status === 0 ? (
                                <Text style={{ color: '#FF0000' }}>
                                    {item.strStatus}
                                </Text>
                            ) :
                                (
                                    <Text style={{ color: '#5789D3' }}>
                                        {item.strStatus}
                                    </Text>
                                )
                            }
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        const {
            width,
            height,
            selectedItem = {},
            lstItem = [],
            isVisibleAttach = false,
            tableData = [],
            title = '',
            isVisibleNotify,
            contentNotify,
            firstLoading = true,
        } = this.state;
        const { conferenceId, conclusionId, conclusionResultId, titles, departmentName, dateSended, expiredDate, strStatus } = selectedItem;

        return (
            <View style={styles.container}>
                <MHeader
                    haveMenu
                    onPressButton={this.openControlPanel}
                    title="Hệ thống thông tin phục vụ họp và xử lý công việc"
                    // title="Hệ thống thông tin phục vụ họp và xử lý công việc của Chính phủ"
                    navigation={this.props.navigation}
                    width={width}
                />
                <Drawer ref={ref => (this._drawer = ref)}
                    content={
                        <View style={styles.drawerContainer}>
                            <View style={[styles.boderBottom, { backgroundColor: 'white' }]}>
                                <Text style={styles.drawerTitle}>
                                    DANH SÁCH DỰ THẢO NGHỊ QUYẾT
                                </Text>
                            </View>
                            <View style={{ padding: 10, backgroundColor: '#e9e9e9' }}>
                                <View style={styles.searchContainer}>
                                    <View style={{ marginRight: 10 }}>
                                        <IconM name="magnify" size={21} color="grey" />
                                    </View>
                                    <TextInput
                                        style={styles.searchField}
                                        placeholder="Phiếu ghi ý kiến"
                                        onChangeText={txt => {
                                            this.setState({
                                                keyword: txt,
                                            });
                                        }}
                                        onSubmitEditing={this.search}
                                    />
                                </View>
                            </View>
                            <FlatList
                                data={lstItem}
                                extraData={this.state.extraData}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={this.renderItem}
                                showsVerticalScrollIndicator={false}
                                refreshing
                                ListFooterComponent={this.renderFooter}
                                onEndReachedThreshold={0.4}
                                onEndReached={this.handleLoadMore}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.extraData.isRefreshing}
                                        onRefresh={this.onRefresh}
                                    />
                                }
                            />
                        </View>
                    }
                    tapToClose
                    openDrawerOffset={0.2}
                    type="overlay"
                >
                    {/* HEADER */}
                    <View style={styles.headerBodyContent}>
                        <Text style={styles.drawerTitle}>NỘI DUNG DỰ THẢO NGHỊ QUYẾT</Text>
                    </View>

                    <ScrollView>
                        <TouchableWithoutFeedback>
                            <View style={styles.subContainer}>
                                {/* DETAIL */}
                                <View style={[styles.detailBodyContent, { width: width + 2, padding: 10 }]} >
                                    <View style={styles.rows} >
                                        <Text style={styles.titles} >
                                            Tiêu đề:
                                        </Text>
                                        <Text style={styles.normalTxt}>{titles}</Text>
                                    </View>

                                    <View style={styles.rows} >
                                        <Text style={styles.titles} >
                                            Đơn vị soạn thảo:
                                        </Text>
                                        <Text style={styles.normalTxt}>{departmentName}</Text>
                                    </View>

                                    <View style={styles.rows} >
                                        <Text style={styles.titles} >
                                            Ngày gửi:
                                        </Text>
                                        <Text style={styles.normalTxt}>{dateSended}</Text>
                                    </View>

                                    <View style={styles.rows} >
                                        <Text style={styles.titles} >
                                            Hạn trả lời:
                                        </Text>
                                        <Text style={styles.labelRed}>
                                            {expiredDate}
                                        </Text>
                                    </View>

                                    <View style={styles.rows} >
                                        <Text style={styles.titles} >
                                            Trạng thái:
                                        </Text>
                                        <Text style={styles.normalTxt}>
                                            {strStatus}
                                        </Text>
                                    </View>

                                    <View style={{ marginTop: 10 }}>
                                        <View style={styles.rows} >
                                            <Text style={styles.links} onPress={() => this.resolutionLink1()}>
                                                Công văn lấy ý kiến dự thảo nghị quyết
                                            </Text>
                                        </View>
                                        <View style={styles.rows} >
                                            <Text style={styles.links} onPress={this.resolutionLink2(conferenceId)}>
                                                Thông tin phiên họp
                                            </Text>
                                        </View>
                                        <View style={styles.rows} >
                                            <Text style={styles.links} onPress={() => this.resolutionLink3()}>
                                                Hồ sơ kèm theo
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={styles.links} onPress={() => this.resolutionLink4()}>
                                                Nội dung dự thảo Nghị quyết
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </ScrollView>

                    <Loading loading={firstLoading} />
                </Drawer>

                {conferenceId && (
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            position: 'absolute',
                            right: 20,
                            bottom: 20
                        }}
                    >
                        <View style={{ marginLeft: 15 }}>
                            <TouchableOpacity
                                style={[
                                    styles.circleButton,
                                    { backgroundColor: '#4281D0' }
                                ]}
                                onPress={() => this.setState({ isConfirm: true })}
                            >
                                <IconM name="check" size={25} color="white" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginLeft: 15 }}>
                            <TouchableOpacity
                                style={[styles.circleButton, { backgroundColor: '#349C42' }]}
                                onPress={() => this.setState({ isComment: true })}
                            >
                                <IconB name="edit" size={25} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                <ModalConfirm
                    width={width}
                    height={height}
                    isVisible={this.state.isConfirm}
                    confirmModal={this.confirm(conclusionId, conclusionResultId)}
                    closeModal={() => this.setState({ isConfirm: false })} />
                <ModalComment
                    width={width}
                    height={height}
                    isVisible={this.state.isComment}
                    confirmModal={(content) => this.comment(conclusionId, content)}
                    closeModal={() => this.setState({ isComment: false })} />
                <ModalAttachFile
                    isVisible={isVisibleAttach}
                    closeModal={() => this.setState({ isVisibleAttach: false })}
                    tableData={tableData}
                    title={title}
                />
                <Notify
                    isVisible={isVisibleNotify}
                    content={contentNotify}
                    width={width}
                    closeNotify={() => this.setState({ isVisibleNotify: false })}
                />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        error: state.ErrorReducer.error,
        listResolution: state.ResolutionReducer.listResolution,
        selectedResolution: state.ResolutionReducer.selectedResolution,
        confirmSuccess: state.ResolutionReducer.confirmSuccess,
    };
};

export default connect(
    mapStateToProps,
    { getResolutionById, getListResolution, confirmResolution, commentResolution, chooseMeeting, getMeetingById }
)(Resolution);

