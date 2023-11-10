import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ScrollView,
    TextInput,
    FlatList,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconO from 'react-native-vector-icons/Octicons';
import Highlighter from 'react-native-highlight-words';
import { chooseMeeting, getMeetingById } from '../../redux/actions/meetings.action';
import { getKeyword, getDocumentDetail } from '../../redux/actions/search.action';
import styles from '../home/style';
import CustomHeader from '../../assets/components/header';

class Search extends Component {
    constructor(props) {
        super(props);
        const { width } = Dimensions.get('window');

        this.state = {
            numOfDoc: 0,
            keyword: '',
            extraData: {
                loading: false,
                isRefreshing: false,
                width,
            },
        };
    }

    // componentDidMount = async () => {
    //     await this.props.getKeyword({
    //         keyword: this.state.keyword,
    //         page: 1,
    //         size: 1,
    //     });
    //     const { data } = this.props;
    //     this.getNumberOfDoc(data.list);

    // }

    getNumberOfDoc = inputData => {
        let total = 0;

        total += inputData.length;
        this.setState({
            numOfDoc: total
        });
    };

    searchDocument = async () => {
        this.handleLoading(true);
        await this.props.getKeyword({
            keyword: this.state.keyword,
            page: 1,
            size: 1,
        });
        this.handleLoading(false);
        const { data } = this.props;
        this.getNumberOfDoc(data.list);
    }

    navigateContent = async (chosenMeeting) => {
        await this.props.chooseMeeting(chosenMeeting);
        this.props.navigation.navigate('MeetingScheduleScreen');
    }

    renderItem = ({ item, index }) => {
        const { name, title = '', rootId } = item;
        const { keyword } = this.state;
        const haveTitle = typeof item.title !== 'undefined';
        return (
            <View
                style={[
                    styles.containerItem,
                    { marginVertical: 15 }
                ]}
            >
                {/* eslint-disable-next-line react/jsx-no-bind */}
                <TouchableOpacity onPress={this.navigateContent.bind(this, rootId)}>
                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                        <Text style={{ fontSize: 14, color: '#659EE3' }}>
                            {`${index + 1}. `}
                        </Text>
                        <Text style={{ fontSize: 14, color: '#659EE3' }}>
                            <Highlighter
                                highlightStyle={{ backgroundColor: 'yellow' }}
                                searchWords={[keyword]}
                                textToHighlight={name}
                            />
                        </Text>
                    </View>
                    {haveTitle && <View style={{ borderColor: 'gray', borderWidth: 1, padding: 3, paddingBottom: 15, backgroundColor: '#F5F4F4', marginLeft: 20 }}>
                        <Text>
                            <Highlighter
                                highlightStyle={{ backgroundColor: 'yellow' }}
                                searchWords={[keyword]}
                                textToHighlight={title}
                            />
                        </Text>
                    </View>}
                </TouchableOpacity>
            </View>
        );
    }

    handleLoading = (loading) => {
        this.setState({
            extraData: { ...this.state.extraData, loading }
        });
    }

    renderHeader = () => {
        if (!this.state.extraData.loading) return null;
        return (
            <ActivityIndicator
                style={{ marginVertical: 10 }}
                color={'#316ec4'}
                size={'large'}
            />
        );
    };

    closeControlPanel = () => {
        this._drawer.close();
    };

    openControlPanel = () => {
        this._drawer.open();
    };

    render() {
        const { list: listDoc } = this.props.data;
        const { width } = this.state;

        return (
            <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
                <CustomHeader
                    title={'Hệ thống thông tin phục vụ họp và xử lý công việc'}
                    // title={'Hệ thống thông tin phục vụ họp và xử lý công việc của Chính phủ'}
                    navigation={this.props.navigation}
                    width={width}
                />
                <ScrollView>
                    <TouchableWithoutFeedback>
                        <View style={{ backgroundColor: '#FFFFFF' }}>
                            {/* Tra cứu tài liệu */}
                            <View style={{ marginTop: 10, marginHorizontal: 10 }}>
                                <Text style={{ textAlign: 'center', fontSize: 20, color: '#174EA4' }}>
                                    {'Tra cứu tài liệu'}
                                </Text>
                                <Text style={{ textAlign: 'center', fontSize: 12 }}>
                                    {'(các Văn bản Luật, Nghị định, Thông tư, phiếu lấy ý kiến, Tài liệu họp...)'}
                                    {/* {'(các Văn bản Luật, Nghị định, Thông tư, phiếu lấy ý kiến TVCP, Tài liệu họp...)'} */}
                                </Text>
                            </View>

                            <View style={{ padding: 10 }}>
                                <View style={{
                                    backgroundColor: 'white',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingHorizontal: 10,
                                    paddingVertical: 6,
                                    borderColor: '#d8d8d8',
                                    borderWidth: 1,
                                    borderRadius: 10,
                                }}>
                                    <TextInput
                                        style={{
                                            height: 40,
                                            width: '90%'
                                        }}
                                        onChangeText={string => {
                                            this.setState({ keyword: string });
                                        }}
                                    />
                                    <View style={{ marginLeft: 10 }}>
                                        <TouchableOpacity onPress={this.searchDocument}>
                                            <IconM name={'magnify'} size={40} color={'grey'} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={{ marginHorizontal: 1 }}>
                                <Text style={{ textAlign: 'center', fontSize: 12, color: '#77ABD8' }}>
                                    {'Tìm kiếm nâng cao'}
                                </Text>
                            </View>
                            <View style={{ marginHorizontal: 10, flexDirection: 'row' }}>
                                <Text style={{ textAlign: 'left', fontSize: 14, fontWeight: '700' }}>
                                    {'Kết quả tìm kiếm: '}
                                </Text>
                                <Text style={{ textAlign: 'left', fontSize: 14, fontWeight: '700', color: '#FC4A2F' }}>{this.state.numOfDoc}</Text>
                            </View>

                            <View style={{ marginBottom: 10, marginHorizontal: 10 }}>
                                <FlatList
                                    data={listDoc}
                                    extraData={this.state.extraData}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={this.renderItem}
                                    showsVerticalScrollIndicator={false}
                                    ListHeaderComponent={this.renderHeader}
                                />
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    marginBottom: 10
                                }}
                            >
                                <View style={{ marginRight: 20 }}>
                                    <TouchableOpacity
                                        style={{
                                            borderRadius: 50,
                                            width: 50,
                                            height: 50,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: '#AAAAAA'
                                        }}
                                    // onPress={() =>
                                    //     this.setState({
                                    //         isModalVisible: true
                                    //     })
                                    // }
                                    >
                                        <IconO name={'x'} size={30} color={'white'} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        error: state.ErrorReducer.error,
        listDocument: state.SearchReducer.list,
        data: state.SearchReducer.data,
    };
};

export default connect(
    mapStateToProps,
    { chooseMeeting, getKeyword, getDocumentDetail, getMeetingById }
)(Search);
