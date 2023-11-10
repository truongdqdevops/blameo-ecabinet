import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-material-dropdown';
import { OPINION_STATUS } from '../const';
import styles from '../style';
import { Message } from '../../../assets/utils/message';
import { TITLE_MEETING } from '../../../assets/utils/title';
import { Table, Row } from 'react-native-table-component';
import MHeader from '../../../assets/components/header';
import { getListNotebookByUserId } from '../../../redux/actions/meetings.action';
import { StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextInput, ToastAndroid, AlertIOS } from 'react-native';
import Confirm from '../../../assets/components/confirm';
import KeyboardListener from 'react-native-keyboard-listener';

class ModalNote extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contentAdd: '',
            contentEditAfter: this.props.contentEdit,
            isEdit: false,
            isAddNewNote: false,
            isSave: true,
            isValidContent: false,
            isVisibleNotify: false,
            isVisibleNotifySave: false,
            contentNotify: '',
            keyboardOpen: false
        };
    }
    componentDidMount = async () => {
        this.renderHeaderTable();
    };

    renderHeaderTable() {
        const itemData = [
            <Text style={styles.headerTableText}>STT</Text>,
            <Text style={[styles.headerTableText, { textAlign: 'left', paddingLeft: 10 }]}>Nội dung ghi chú</Text>,
            <Text style={[styles.headerTableText, { textAlign: 'left', paddingLeft: 10 }]}></Text>
        ];
        this.setState({
            tableHead: itemData
        });
    }
    convertListData = (listContent = []) => {
        const listContents = [{ label: 'Vui lòng chọn', value: '' }];
        listContent.forEach(element => {
            const { title = '', fileId } = element;
            const newElement = { label: title, value: fileId };
            listContents.push(newElement);
        });
        return listContents;
    };

    insertNotebook() {
        this.setState({ isVisibleNotifySave: false });

        const userId = this.props.userInfo.appUser.id;
        const { conferenceId } = this.props.selectedMeeting;
        let contentAdd = this.state.contentAdd;
        setTimeout(async () => {
            const res = await this.props.insertOrUpdateNotebook({ userId: userId, conferenceId: conferenceId, content: contentAdd });
            // Luu thanh cong
            if (res === 'true') {
                this.setState({ contentAdd: '', isSave: true, isAddNewNote: false });
                this.props.toggleReloadListNotebook(conferenceId);
                if (Platform.OS === 'android') {
                    ToastAndroid.showWithGravity(
                        "Thêm ghi chú thành công",
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER
                    );
                }

                setTimeout(() => {
                    this.props.toggleModalActiveScreenNote('LIST')
                }, 100);
            } else {
                if (Platform.OS === 'android')
                    ToastAndroid.showWithGravity(
                        "Có lỗi xảy ra, vui lòng thử lại sau",
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER
                    );
            }
        }, 250);
    }
    updateNotebook = async () => {
        let contentEditAfter = this.state.contentEditAfter;
        let notebookId = this.props.notebookId;
        const { conferenceId } = this.props.selectedMeeting;
        const res = await this.props.insertOrUpdateNotebook({ content: contentEditAfter, notebookId: notebookId });
        // Luu thanh cong
        if (res === 'true') {
            this.setState({ contentEditAfter: '', isEdit: false });
            setTimeout(() => {
                this.props.toggleModalActiveScreenNote('LIST')
            }, 50);
            this.props.toggleReloadListNotebook(conferenceId);
            if (Platform.OS === 'android')
                ToastAndroid.showWithGravity(
                    "Đã lưu",
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                );
        } else {
            if (Platform.OS === 'android')
                ToastAndroid.showWithGravity(
                    "Có lỗi xảy ra, vui lòng thử lại sau",
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                );
        }
    }
    confirmUpdateNotebook = async () => {
        this.setState({ isVisibleNotify: false });

        let contentEditAfter = this.state.contentEditAfter;
        let notebookId = this.props.notebookId;
        const { conferenceId } = this.props.selectedMeeting;
        const res = await this.props.insertOrUpdateNotebook({ content: contentEditAfter, notebookId: notebookId });
        // Luu thanh cong
        if (res === 'true') {
            this.setState({ contentEditAfter: '', isEdit: false });
            setTimeout(() => {
                this.props.toggleModalActiveScreenNote('LIST')
            }, 100);
            this.props.toggleReloadListNotebook(conferenceId);

        } else {
            if (Platform.OS === 'android')
                ToastAndroid.showWithGravity(
                    "Có lỗi xảy ra, vui lòng thử lại sau",
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                );
        }
    }
    handleBackFromAddToList = () => {
        if (this.state.isSave) {
            this.setState({ contentAdd: '' })
            setTimeout(() => {
                this.props.toggleModalActiveScreenNote('LIST')
            }, 100);
        } else {
            this.setState({
                isVisibleNotifySave: true,
                contentNotify: 'Đồng chí có muốn lưu lại ghi chú này?'
            });
        }

    }

    backToListFromAdd = () => {
        this.setState({ contentAdd: '', isVisibleNotifySave: false, isAddNewNote: false });
        setTimeout(() => {
            this.props.toggleModalActiveScreenNote('LIST')
        }, 50);
    }

    handleBackToList = () => {
        if (this.state.isEdit) {
            this.setState({ isVisibleNotify: true, contentNotify: 'Đồng chí có muốn lưu lại thay đổi không?', isEdit: false });
        } else {
            this.backToList();
        }

    }

    notSave = () => {
        this.setState(({ isVisibleNotify: false }));
        this.backToList();
    }

    backToList = () => {
        this.setState({ contentEdit: '' });
        setTimeout(() => {
            this.props.toggleModalActiveScreenNote('LIST')
        }, 50);
    }

    render() {
        const { width, isVisible = false, toggleModal, height, headName, activeNoteScreen } = this.props;
        const {
            tableHead = [],
            contentEditAfter,
            isEdit,
            isAddNewNote,
            isSave,
            isValidContent,
            isVisibleNotify,
            isVisibleNotifySave,
            contentNotify,
            keyboardOpen
        } = this.state;

        return (
            <Modal
                isVisible={isVisible}
                backdropColor={'rgb(156,156,156)'}
                animationInTiming={400}
                animationOutTiming={500}
                backdropTransitionInTiming={500}
                backdropTransitionOutTiming={500}
                hideModalContentWhileAnimating
            >
                {/*Man hinh hien thi danh sach ghi chu */}
                {activeNoteScreen === 'LIST' && (
                    <View style={{ backgroundColor: '#EBEFF5', height: height * 0.50 }}>
                        <MHeader
                            haveClose
                            haveEmail={false}
                            onClose={toggleModal}
                            title={'Sổ tay cá nhân'}
                            navigation={this.props.navigation}
                            width={width}
                        />
                        <Table>
                            <Row
                                flexArr={[1, 7, 1]}
                                data={tableHead}
                                style={{
                                    backgroundColor: '#EFEFF4',
                                    borderBottomColor: '#cccccc',
                                    borderBottomWidth: 1,
                                    height: 50,
                                }}
                                textStyle={{
                                    color: 'black',
                                    fontWeight: 'bold',
                                    paddingVertical: 3,
                                    textAlign: 'center',
                                    paddingLeft: 10
                                }}
                            />
                        </Table>
                        <ScrollView showsVerticalScrollIndicator={true}>
                            <TouchableWithoutFeedback>
                                <Table style={{ padding: 10 }} >
                                    {this.props.tableData}
                                </Table>
                            </TouchableWithoutFeedback>
                        </ScrollView>
                        <View style={styles.borderButtonNote}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({contentAdd: ''});
                                    this.props.toggleModalActiveScreenNote('ADD');
                                }}
                                style={styles.buttonNote}
                                numberOfLines={1}>
                                <IconM name={'pencil-plus-outline'} size={24} color={'#fff'} />
                                {/* <Text style={{color:"#fff"}}>
                                Thêm ghi chú
                                </Text> */}
                            </TouchableOpacity>
                        </View>
                    </View>)}
                {/*Màn hình thêm mới ghi chú*/}
                {activeNoteScreen === 'ADD' && (
                    <View style={{ backgroundColor: '#EBEFF5', height: height * 0.50, position: "relative", bottom: keyboardOpen ? 100 : 0 }}>
                        <MHeader
                            haveClose
                            haveEmail={false}
                            onClose={toggleModal}
                            title={'Thêm mới ghi chú'}
                            navigation={this.props.navigation}
                            width={width}
                        />
                        <ScrollView>
                            <View style={{ padding: 10 }}>
                                <TextInput
                                    style={{
                                        borderColor: 'gray',
                                        borderWidth: 1,
                                        placeholderTextColor: 'gray',
                                        height: height * 0.50 - 110,
                                        color: '#000000',
                                        borderRadius: 4
                                    }}
                                    autoCorrect={false}
                                    maxLength={10000}
                                    multiline
                                    textAlignVertical='top'
                                    placeholder="Nhập ghi chú mới tại đây"
                                    value={this.state.contentAdd}
                                    onChangeText={(contentAdd) => this.setState({ contentAdd, isSave: false, isAddNewNote: true })}
                                />
                            </View>
                            <View style={[styles.borderButtonEditNote]}>
                                <TouchableOpacity
                                    style={{ backgroundColor: '#316ec4', borderRadius: 4, width: 100 }}
                                    onPress={() => this.handleBackFromAddToList()}
                                >
                                    <Text style={{ color: '#fff', paddingVertical: 8, textAlign: 'center' }}>{'Quay lại'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    disabled={!isAddNewNote}
                                    style={{ backgroundColor: isAddNewNote === true ? '#316ec4' : '#cccc', borderRadius: 4, width: 100 }}
                                    onPress={() => this.insertNotebook()}
                                >
                                    <Text style={{ color: '#fff', paddingVertical: 8, textAlign: 'center' }}>{'Lưu'}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>)}
                {/*Màn hình sửa ghi chú */}
                {activeNoteScreen === 'EDIT' && (
                    <View style={{ backgroundColor: '#EBEFF5', height: height * 0.50, position: "relative", bottom: keyboardOpen ? 100 : 0 }}>
                        <MHeader
                            haveClose
                            haveEmail={false}
                            onClose={toggleModal}
                            title={'Nội dung đã ghi chép'}
                            navigation={this.props.navigation}
                            width={width}
                        />
                        <View style={{ padding: 10 }}>
                            <TextInput
                                style={{
                                    borderColor: 'gray',
                                    borderWidth: 1,
                                    placeholderTextColor: 'gray',
                                    height: height * 0.50 - 110,
                                    color: '#000000',
                                    borderRadius: 4
                                }}
                                autoCorrect={false}
                                maxLength={10000}
                                multiline
                                textAlignVertical='top'
                                defaultValue={this.props.contentEdit}
                                onChangeText={(contentEditAfter) => this.setState({ contentEditAfter, isEdit: true })}
                            />
                        </View>
                        <View style={[styles.borderButtonEditNote]}>
                            <TouchableOpacity
                                style={{ backgroundColor: '#316ec4', borderRadius: 4, width: 100 }}
                                onPress={() => this.handleBackToList()
                                }
                            >
                                <Text style={{ color: '#fff', paddingVertical: 8, textAlign: 'center' }}>{'Quay lại'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={!isEdit}
                                style={{ backgroundColor: isEdit === true ? '#316ec4' : '#cccc', borderRadius: 4, width: 100 }}
                                onPress={() => this.updateNotebook()}
                            >
                                <Text style={{ color: '#fff', paddingVertical: 8, textAlign: 'center' }}>{'Lưu'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>)}
                <Confirm
                    width={width}
                    isVisible={isVisibleNotify}
                    titleHeader={'Thông báo'}
                    content={contentNotify}
                    onCancel={() => this.notSave()}
                    onOk={() => this.confirmUpdateNotebook()}
                />
                <Confirm
                    width={width}
                    isVisible={isVisibleNotifySave}
                    titleHeader={'Thông báo'}
                    content={contentNotify}
                    onCancel={() => this.backToListFromAdd()}
                    onOk={() => this.insertNotebook()}
                />
                <KeyboardListener
                    onDidShow={() => { this.setState({ keyboardOpen: true }); console.log("keyboardOpen") }}
                    onDidHide={() => { this.setState({ keyboardOpen: false }); console.log("keyboardClose") }}
                />
            </Modal>
        );
    };
};

const mapStateToProps = state => {
    return {
        error: state.ErrorReducer.error,
        selectedMeeting: state.MeetingReducer.selectedMeeting,
        userInfo: state.AuthenReducer.userInfo,
        listNotebookByUserId: state.MeetingReducer.listNotebookByUserId,
    };
};

export default connect(
    mapStateToProps, { getListNotebookByUserId }
)(ModalNote);