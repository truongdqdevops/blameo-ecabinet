import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    TextInput,
    FlatList,
    Picker
} from 'react-native';
import { chooseMeeting } from '../../redux/actions/meetings.action';
import { VAN_BAN_LUAT } from '../../assets/fake-data/data';
import MHeader from '../../assets/components/header';
import Loading from '../../assets/components/loading';
import styles from '../home/style';

class LawDatabase extends Component {
    constructor(props) {
        super(props);

        const { width } = Dimensions.get('window');
        this.state = {
            width,
            // height,
            docType: null,
            numOfDoc: 0
        };
    }

    componentDidMount() {
        this.setState({ firstLoading: true });
        // const { width, height } = this.state;
        // const size = width < height ? width * 0.43 : width * 0.3;

        this.getNumberOfDoc(VAN_BAN_LUAT.DOC);
        this.setState({ firstLoading: false });
    }

    getNumberOfDoc = inputData => {
        let total = 0;

        total += inputData.length;
        this.setState({
            numOfDoc: total
        });
    }

    renderItem = ({ item, index }) => {
        const { name, startDate } = item;
        // const { height } = this.state;

        return (
            <View
                style={[
                    styles.containerItem,
                    { backgroundColor: 'white', borderBottomColor: 'grey', borderBottomWidth: 1 }
                ]}
            >
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#5C74D5' }}>
                        <Text>{`${index + 1}. ${name}`}</Text>
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>Ban hành: </Text>
                        <Text>{startDate}</Text>
                    </View>
                </View>
            </View>
        );
    }


    // handleRotate = event => {
    //     const { nativeEvent: { layout: { width, height } = {} } = {} } = event;
    //     this.setState({
    //         width,
    //         height
    //     });
    //     const size = width < height ? width * 0.43 : width * 0.3;
    // }

    closeControlPanel = () => {
        this._drawer.close();
    }

    openControlPanel = () => {
        this._drawer.open();
    }

    render() {
        const { DOC: listDoc } = VAN_BAN_LUAT;
        const { width, numOfDoc, firstLoading = true } = this.state;
        return (
            <View style={styles.container}>

                <MHeader
                    title="CƠ SỞ DỮ LIỆU LUẬT"
                    // haveBack
                    navigation={this.props.navigation}
                    width={width}
                />

                <ScrollView>
                    <TouchableWithoutFeedback>
                        <View>
                            {/* PHIẾU LẤY Ý KIẾN */}
                            <View style={{ marginHorizontal: 10, marginTop: 10 }}>
                                <Text style={{ textAlign: 'left', fontSize: 16, fontWeight: '700' }}>
                                    Tìm kiếm nhanh văn bản
                                </Text>
                            </View>

                            {/* THỐNG KÊ CHUNG */}
                            <View style={styles.partContainer}>
                                <View
                                    style={{
                                        alignSelf: 'stretch',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignContent: 'flex-start',
                                        flexWrap: 'wrap'
                                    }}
                                >
                                    <View
                                        style={{
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Text style={{ textAlign: 'center', fontSize: 15 }}>Ban hành</Text>
                                    </View>
                                    <TextInput
                                        style={{
                                            width: width * 0.35,
                                            height: width * 0.1,
                                            fontSize: 15,
                                            textAlign: 'left',
                                            backgroundColor: 'white',
                                            borderColor: 'black',
                                            borderWidth: 1
                                        }}
                                    // onChangeText={startDate => {
                                    //     this.setState({ startDate });
                                    // }}
                                    />
                                    <TextInput
                                        style={{
                                            width: width * 0.35,
                                            height: width * 0.1,
                                            fontSize: 15,
                                            textAlign: 'left',
                                            backgroundColor: 'white',
                                            borderColor: 'black',
                                            borderWidth: 1
                                        }}
                                    // onChangeText={endDate => {
                                    //     this.setState({ endDate });
                                    // }}
                                    />
                                </View>

                                <View
                                    style={{
                                        alignSelf: 'stretch',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignContent: 'flex-start',
                                        flexWrap: 'wrap',
                                        marginTop: 10
                                    }}
                                >
                                    <View
                                        style={{
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Text style={{ textAlign: 'center', fontSize: 15 }}>Số hiệu văn bản</Text>
                                    </View>
                                    <TextInput
                                        style={{
                                            width: width * 0.6,
                                            height: width * 0.1,
                                            fontSize: 15,
                                            textAlign: 'left',
                                            backgroundColor: 'white',
                                            borderColor: 'black',
                                            borderWidth: 1
                                        }}
                                    // onChangeText={docCode => {
                                    //     this.setState({ docCode });
                                    // }}
                                    />
                                </View>

                                <View
                                    style={{
                                        alignSelf: 'stretch',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignContent: 'flex-start',
                                        flexWrap: 'wrap',
                                        marginTop: 10
                                    }}
                                >
                                    <View
                                        style={{
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Text style={{ textAlign: 'center', fontSize: 15 }}>Tên văn bản</Text>
                                    </View>
                                    <TextInput
                                        style={{
                                            width: width * 0.6,
                                            height: width * 0.1,
                                            fontSize: 15,
                                            textAlign: 'left',
                                            backgroundColor: 'white',
                                            borderColor: 'black',
                                            borderWidth: 1
                                        }}
                                    // onChangeText={docName => {
                                    //     this.setState({ docName });
                                    // }}
                                    />
                                </View>

                                <View
                                    style={{
                                        alignSelf: 'stretch',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignContent: 'flex-start',
                                        flexWrap: 'wrap',
                                        marginTop: 10
                                    }}
                                >
                                    <View
                                        style={{
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Text style={{ textAlign: 'center', fontSize: 15 }}>Loại văn bản</Text>
                                    </View>
                                    <View
                                        style={{
                                            width: width * 0.6,
                                            height: width * 0.1,
                                            borderWidth: 1,
                                            borderColor: 'black',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Picker
                                            selectedValue={this.state.docType}
                                            onValueChange={value => {
                                                this.setState({
                                                    docType: value
                                                });
                                            }}
                                            itemStyle={{ color: 'black', textAlign: 'left' }}
                                        >
                                            <Picker.Item label="- Tất cả -" value={null} color="grey" />
                                            <Picker.Item label="Đề cương báo cáo" value={1} />
                                            <Picker.Item label="Công văn" value={2} />
                                        </Picker>
                                    </View>
                                </View>

                                <View style={{ marginTop: 30 }}>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: '#3756CD',
                                            borderRadius: 5,
                                            width: width * 0.3,
                                            height: width * 0.075,
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                                            TÌM KIẾM
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{ marginHorizontal: 10, marginTop: 10, flexDirection: 'row' }}>
                                <Text style={{ textAlign: 'left', fontSize: 16, fontWeight: '700' }}>
                                    {'Tìm thấy' + ' '}
                                </Text>
                                <Text style={{ textAlign: 'left', fontSize: 16, fontWeight: '700', color: 'red' }}>{numOfDoc}</Text>
                                <Text style={{ textAlign: 'left', fontSize: 16, fontWeight: '700' }}>
                                    {' ' + 'kết quả'}
                                </Text>
                            </View>

                            {/* LỊCH HỌP GẦN NHẤT */}
                            <View style={[styles.partContainer, { marginBottom: 10 }]}>
                                <FlatList
                                    data={listDoc}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={this.renderItem}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>

                            <Loading loading={firstLoading} />
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        error: state.ErrorReducer.error
    };
};

export default connect(
    mapStateToProps,
    { chooseMeeting }
)(LawDatabase);
