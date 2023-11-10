import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Text,
    Dimensions,
    TouchableWithoutFeedback,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { Table, Row, Rows } from 'react-native-table-component';
import Modal from 'react-native-modal';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import {
    getCResultBySubjectId,
    getInventorySubject,
    getListMemById
} from '../../../redux/actions/meetings.action';
import CustomHeader from '../../../assets/components/header';
import {
    LIST_PROPS_VOTE_RESULT_YESNO,
    NOT_COMPLETE,
    VOTE_TYPE,
    ANSWER_TYPE,
    LIST_VOTE_RESULT,
    OBJECT_RESPONSE_VOTE_RESULT,
    PARTICIPANT_STATUS,
    SUBJECT_TYPES
} from '../const';
import styles from './style';
import { Alert } from 'react-native';

class VoteResult extends Component {
    constructor(props) {
        super(props);
        const { width, height } = Dimensions.get('window');
        this.state = {
            width,
            height,
            dataPieChart: [],
            totalValue: 0,
            labelArr: [],
            headerTable: ['STT', 'Họ tên - Chức vụ'],
            headerTableYKienKhac: ['STT', 'Người nêu ý kiến', 'Ý kiến'],
            dataTableYKienKhac: [],
        };
    }

    componentDidMount() {
        this.setState({ loadingGetVoteResult: true }, () => {
            setTimeout(async () => {
                const { subjectId, conferenceId } = this.props;
                await Promise.all([
                    this.props.getCResultBySubjectId({ subjectId }),
                    this.props.getInventorySubject({ subjectId }),
                    this.props.getListMemById({ conferenceId }),
                ]);
                const { listMems = [], issue = {}, permissionViewResult, resultCBySubjectId: data = {} } = this.props;
                // const { listMems = [], issue = {}, permissionViewResult, inventorySubject: data = {} } = this.props;

                const listMemsJoined = listMems.filter(element => PARTICIPANT_STATUS.JOIN === element.status) || [];
                const totalJoined = listMemsJoined.length;
                const { countAnswer = 0, subjectType = '', type = '' } = issue;

                const voteDone = countAnswer >= totalJoined;
                const isWithOut = type === SUBJECT_TYPES.WITHOUT;

                if (Object.prototype.hasOwnProperty.call(data, NOT_COMPLETE.PROPERTY) || (!permissionViewResult && !voteDone)) {
                    this.setState({
                        notComplete: NOT_COMPLETE.STATUS,
                    });
                } else {
                    if (permissionViewResult || voteDone) {
                        this.renderDataPieChart(data, subjectType, isWithOut);
                    }
                    if (permissionViewResult && !isWithOut) {
                        this.renderDataTable(data);
                    }
                }
                this.setState({ loadingGetVoteResult: false });
            }, 500);
        });
    }

    renderDataPieChart = (data, type, isWithOut) => {
        const dataP = [];
        let total = 0;
        const labelArr = [];

        if (type === VOTE_TYPE.YESNO) {
            const arrProps = Object.keys(LIST_PROPS_VOTE_RESULT_YESNO);
            arrProps.forEach((element, index) => {
                const dataElement = data[element];
                let amount = 0;
                if (isWithOut) {
                    amount = dataElement.length > 0 ? dataElement[0].answer : 0;
                } else {
                    amount = dataElement.length > 0 ? dataElement.length : 0;
                }

                total += amount;
                dataP.push({
                    key: index,
                    amount,
                    svg: {
                        fill: colorSlide[index],
                    }
                });
                labelArr.push(
                    <View key={(index + 1).toString()} style={styles.itemDetailVote}>
                        <View style={[styles.colorItem, { backgroundColor: colorSlide[index] }]} />
                        <Text>{`${LIST_PROPS_VOTE_RESULT_YESNO[element]}: ${amount}`}</Text>
                    </View>
                );
            });
        } else if (type === VOTE_TYPE.OPTION) {
            const arrProps = Object.keys(data);

            arrProps.forEach((element, index) => {
                if (element) {
                    const dataElement = data[element];

                    let amount = 0;
                    if (isWithOut) {
                        amount = dataElement.length > 0 ? dataElement[0].answer : 0;
                    } else {
                        amount = dataElement.length > 0 ? dataElement.length : 0;
                    }

                    if (element && element !== ANSWER_TYPE.Y_KIEN_KHAC) {
                        total += amount;

                        dataP.push({
                            key: index,
                            amount,
                            svg: {
                                fill: colorSlide[index],
                            }
                        });
                        labelArr.push(
                            <View key={(index + 1).toString()} style={styles.itemDetailVote}>
                                <View style={[styles.colorItem, { backgroundColor: colorSlide[index] }]} />
                                {element.match(/^\d+$/) && (
                                    <Text>{`Phương án ${index + 1}: ${amount}`}</Text>
                                )}

                                {element === ANSWER_TYPE.CHUA_TRA_LOI && (
                                    <Text>{`Chưa trả lời: ${amount}`}</Text>
                                )}

                                {element === ANSWER_TYPE.PHUONG_AN_KHAC && (
                                    <Text>{`Phương án khác: ${amount}`}</Text>
                                )}
                            </View>
                        );
                    }
                }
            });
        }

        this.setState({
            dataPieChart: dataP,
            totalValue: total,
            labelArr
        });
    };

    renderDataTable = (data) => {
        const allData = [];
        const dataTableYKienKhac = [];
        Object.keys(data).forEach(key => {
            const dataChild = data[key] || [];
            if (key === OBJECT_RESPONSE_VOTE_RESULT.Y_KIEN_KHAC) {
                dataChild.forEach((element, index) => {
                    const stt = index + 1;
                    const { content = '', positionName = '' } = element;
                    const itemData = [
                        <Text style={{ textAlign: 'center', textAlignVertical: 'center' }}>{stt}</Text>,
                        <Text style={styles.contentTableText}>{positionName}</Text>,
                        <Text style={styles.contentTableText}>{content}</Text>
                    ];
                    dataTableYKienKhac.push(itemData);
                });
            } else if (key.match(/^\d+$/)) {
                allData.push(this.getDataOneTable(data, key));
            }
        });

        allData.push(this.getDataOneTable(data, OBJECT_RESPONSE_VOTE_RESULT.YES));
        allData.push(this.getDataOneTable(data, OBJECT_RESPONSE_VOTE_RESULT.NO));
        allData.push(this.getDataOneTable(data, OBJECT_RESPONSE_VOTE_RESULT.CHUA_TRA_LOI));
        allData.push(this.getDataOneTable(data, OBJECT_RESPONSE_VOTE_RESULT.PHUONG_AN_KHAC));
        this.setState({
            dataTableYKienKhac,
            otherCommentLength: dataTableYKienKhac.length,
            allData,
        });
    };

    getDataOneTable = (data, key) => {
        if (!data[key]) return null;
        const dataChild = key ? data[key] : data;
        const dataTable = [];
        const { headerTable } = this.state;
        dataChild.forEach((element, index) => {
            const stt = index + 1;
            const { positionName = '' } = element;
            const itemData = [
                <Text style={{ textAlign: 'center', textAlignVertical: 'center' }}>{stt}</Text>,
                <Text style={styles.contentTableText}>{positionName}</Text>
            ];
            dataTable.push(itemData);
        });
        const labelHeader = this.getLabelCollapseHeader(key);

        const collapseData = (
            <Collapse style={{ marginBottom: 10 }} key={key}>
                <CollapseHeader>
                    <View style={styles.headerCollapse}>
                        <Text style={styles.headerCollapseText}>
                            {`${labelHeader} (${dataChild.length})`}
                        </Text>
                    </View>
                </CollapseHeader>

                <CollapseBody style={{ marginVertical: 5 }}>
                    <Table borderStyle={{ borderWidth: 1, borderColor: '#707070' }}>
                        <Row
                            flexArr={[2, 7]}
                            data={headerTable}
                            style={styles.headerTable}
                            textStyle={styles.headerTableText}
                        />
                        <Rows
                            flexArr={[2, 7]}
                            data={dataTable}
                            style={styles.contentTable}
                        />
                    </Table>
                </CollapseBody>
            </Collapse>
        );
        return collapseData;
    }

    getLabelCollapseHeader = (value) => {
        if (value.match(/^\d+$/)) {
            return `${LIST_VOTE_RESULT.PHUONG_AN} ${value}`;
        }
        return LIST_VOTE_RESULT[value];
    }

    render() {
        const {
            width,
            height,
            dataPieChart,
            totalValue,
            labelArr,
            notComplete,
            headerTableYKienKhac = [],
            dataTableYKienKhac = [],
            otherCommentLength = 0,
            loadingGetVoteResult = true,
        } = this.state;
        const { isVisible = false, toggleModal, issue, permissionViewResult } = this.props;
        const { title = '', type = '' } = issue;

        return (
            <Modal
                animationInTiming={400}
                animationOutTiming={500}
                backdropTransitionInTiming={500}
                backdropTransitionOutTiming={500}
                isVisible={isVisible}
                onBackdropPress={toggleModal}
                backdropColor={'rgb(156,156,156)'}
                hideModalContentWhileAnimating
                style={{ width, marginTop: 0, marginLeft: 0 }}
            >
                <View style={[{ backgroundColor: '#ebeff5' }, loadingGetVoteResult ? { height: height * 0.3 } : {height: height * 0.9}]}>
                    <CustomHeader
                        title={'Kết quả biểu quyết'}
                        haveClose
                        haveEmail={false}
                        style={[{marginTop:30}]}
                        onClose={toggleModal}
                    />
                    {loadingGetVoteResult ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size={'large'} color={'#316ec4'} />
                        </View>
                    ) : (
                        <View>
                            {notComplete ? (
                                <View>
                                    <Text style={{ textAlign: 'center', fontSize: 15, paddingTop: 20, paddingHorizontal: 12 }}>{notComplete}</Text>
                                    <View style={[styles.buttonOKContainer, styles.flexRow]}>
                                        <TouchableOpacity
                                            style={{ backgroundColor: '#316ec4', borderRadius: 4, width: width * 0.38 }}
                                            onPress={toggleModal}
                                        >
                                            <Text style={{ color: '#fff', paddingVertical: 8, textAlign: 'center' }}>{'OK'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <View style={{paddingBottom: 10, height: width > '85%' ? height : '95%' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 13, padding: 8 }}>
                                        {'Vấn đề biểu quyết: '}
                                        <Text style={{ fontWeight: 'normal' }}>{title}</Text>
                                    </Text>
                                    <TouchableWithoutFeedback>
                                        <ScrollView showsVerticalScrollIndicator={false}>
                                            <View style={{
                                                flexDirection: width > height ? 'row' : 'column',
                                                justifyContent: width > height ? 'space-evenly' : 'center',
                                                alignItems: 'center',
                                                alignSelf: 'stretch',
                                                marginBottom: 15
                                            }}>
                                                <PieChart
                                                    style={styles.pieChart}
                                                    valueAccessor={({ item }) => item.amount}
                                                    data={dataPieChart}
                                                    spacing={0}
                                                    outerRadius={'95%'}
                                                    innerRadius={'55%'}
                                                    padAngle={0}
                                                />

                                                <View style={{ marginTop: 20 }}>
                                                    <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                                                        <Text style={{ fontSize: 16 }}>{'Tổng số: '}</Text>
                                                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{totalValue}</Text>
                                                        <Text style={{ fontSize: 16 }}>{` ${'(phiếu)'}`}</Text>
                                                    </View>
                                                    <View>
                                                        {labelArr}
                                                    </View>
                                                </View>
                                            </View>
                                            {permissionViewResult && type !== SUBJECT_TYPES.WITHOUT && (
                                                <View style={{ paddingHorizontal: 10 }}>
                                                    {this.state.allData || null}
                                                    <Collapse>
                                                        <CollapseHeader>
                                                            <View style={styles.headerCollapse}>
                                                                <Text style={styles.headerCollapseText}>
                                                                    {`Ý kiến khác (${otherCommentLength})`}
                                                                </Text>
                                                            </View>
                                                        </CollapseHeader>

                                                        <CollapseBody style={{ marginVertical: 5 }}>
                                                            <Table borderStyle={{ borderWidth: 1, borderColor: '#707070' }}>
                                                                <Row
                                                                    flexArr={[2, 9, 9]}
                                                                    data={headerTableYKienKhac}
                                                                    style={styles.headerTable}
                                                                    textStyle={styles.headerTableText}
                                                                />
                                                                <Rows
                                                                    flexArr={[2, 9, 9]}
                                                                    data={dataTableYKienKhac}
                                                                    style={styles.contentTable}
                                                                />
                                                            </Table>
                                                        </CollapseBody>
                                                    </Collapse>
                                                </View>
                                            )}
                                        </ScrollView>
                                    </TouchableWithoutFeedback>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </Modal>
        );
    };
};

const colorSlide = ['#316ec4', '#e34141', '#fba500', '#21a465', '#30ad23', '#c62d64', '#fab368', '#7fbf7f', '#97cae0', '#559fa2', '#edca98', '#95ecbe', '#a6b896', '#a7e7d1', '#fff3c3', '#911eb4', '#f032e6', 'e6beff'];


const mapStateToProps = state => {
    return {
        error: state.ErrorReducer.error,
        resultCBySubjectId: state.MeetingReducer.resultCBySubjectId,
        listMems: state.MeetingReducer.listMems,
    };
};

export default connect(mapStateToProps, {
    getCResultBySubjectId,
    getInventorySubject,
    getListMemById,
})(VoteResult);
