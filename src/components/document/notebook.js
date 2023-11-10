import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    TextInput,
    BackHandler
} from 'react-native';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { RadioButtonInput } from 'react-native-simple-radio-button';
import Modal from 'react-native-modal';
import ShowFiles from './show-files';
import styles from './style';
import CustomHeader from '../../assets/components/header';
import Loading from '../../assets/components/loading';
import Confirm from '../../assets/components/confirm';
import Notify from '../../assets/components/notify';
import { getStorageFiles, moveFilesToFolder, deleteFiles, copyFileToFolder, saveFavoriteFiles, getListNotebookMenu } from '../../redux/actions/document.action';
import { ROOT_FOLDER_NAME } from './const';

class Notebook extends Component {
    constructor(props) {
        super(props);

        const { width, height } = Dimensions.get('window');
        this.state = {
            width,
            height
        };
    };

    componentDidMount = async () => {
        await this.handleGetListNotebookMenu('');
       
    }

    componentWillUnmount() {
        // this.backHandler.remove();
    }

    handleGetListNotebookMenu = async (keyword) => {
        await this.props.getListNotebookMenu({
            keyword: keyword,
            userId: this.props.userInfo.appUser.id
        });
    };


    render() {
        const {
            width,
            height
        } = this.state;

        return (
            <View style={[styles.container, { backgroundColor: '#fafafa' }]}>
                <CustomHeader
                    title={'Sổ tay cá nhân'}
                    navigation={this.props.navigation}
                />

                <View style={styles.boderBottom}>
                    <View style={[styles.buttonsContainer, styles.flexRow, { alignItems: 'center' }]}>
                        <TouchableOpacity
                            onPress={() => {
                                if (this.state.editing) {
                                    this.setState({ editing: false });
                                    return;
                                }
                                this.setState({ onPressed: 1 }, () => {
                                    this._listData.scrollTo({ animated: false, y: 0 });
                                    this.pushFolderTree(listPublicFiles.folderTree, true);
                                });
                            }}
                        >
                            <View style={[styles.topButtons, styles.buttonLeft, { width: width * 0.3, backgroundColor: onPressed === 1 ? '#316ec4' : '#fff' }]}>
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: onPressed === 1 ? '#fff' : 'black' }}>{'TV dùng chung'}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                if (this.state.editing) {
                                    this.setState({ editing: false });
                                    return;
                                }
                                this.setState({ onPressed: 2 }, () => {
                                    this._listData.scrollTo({ animated: false, y: 0 });
                                    this.pushFolderTree(listPersonalFiles.folderTree, true);
                                });
                            }}
                        >
                            <View style={[styles.topButtons, { width: width * 0.3, backgroundColor: onPressed === 2 ? '#316ec4' : '#fff' }]}>
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: onPressed === 2 ? '#fff' : 'black' }}>{'TV cá nhân'}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                if (this.state.editing) {
                                    this.setState({ editing: false });
                                    return;
                                }
                                this.setState({ onPressed: 3 }, () => {
                                    this._listData.scrollTo({ animated: false, y: 0 });
                                    this.pushFolderTree(listSharedFiles.folderTree, true);
                                });
                            }}
                        >
                            <View style={[styles.topButtons, styles.buttonRight, { width: width * 0.3, backgroundColor: onPressed === 3 ? '#316ec4' : '#fff' }]}>
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: onPressed === 3 ? '#fff' : 'black' }}>{'TV được chia sẻ'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.boderBottom, { padding: 10, backgroundColor: '#e9e9e9' }]}>
                    <View style={styles.searchContainer}>
                        <TouchableOpacity style={{ marginRight: 10 }} onPress={() => this.syncManageFile(true, 'search')}>
                            <IconM name={'magnify'} size={21} color={'grey'} />
                        </TouchableOpacity>
                        <TextInput
                            value={valueSearchBox}
                            style={styles.searchField}
                            placeholder={'Tìm kiếm văn bản'}
                            onChangeText={searchKeyword => {
                                this.setState({ searchKeyword });
                            }}
                            onBlur={() => this.syncManageFile(true, 'search')}
                        />
                    </View>
                </View>

                <View style={[styles.subContainer, { marginBottom: editing ? 0 : 10 }]}>
                    <TouchableWithoutFeedback>
                        <ScrollView
                            ref={(ref) => (this._listData = ref)}
                            showsVerticalScrollIndicator={false}
                        >
                            {dataFolders && this.renderItem(dataFolders)}
                            {editing && (<View style={{ height: 10 }} />)}
                        </ScrollView>
                    </TouchableWithoutFeedback>
                    {isVisibleShowFiles && (
                        <ShowFiles
                            isVisible
                            title={'Nội dung tài liệu'}
                            fileId={fileId}
                            toggleModal={() => this.setState({ isVisibleShowFiles: false })}
                        />
                    )}
                </View>

                {editing && (
                    <View style={[styles.flexRow, { justifyContent: 'center', height: 34 }]}>
                        <TouchableOpacity
                            style={{ backgroundColor: lengthArrFilesManage < 1 ? '#aaa' : '#316ec4', borderRightWidth: 1, borderRightColor: '#fafafa', flex: 1, alignSelf: 'stretch', justifyContent: 'center' }}
                            disabled={lengthArrFilesManage < 1}
                            onPress={this.showMoveModal}
                        >
                            <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>{'Di chuyển'}</Text>
                        </TouchableOpacity>
                        {onPressed === 1 && (
                            <TouchableOpacity
                                style={{ backgroundColor: onPressed === 2 || lengthArrFilesManage < 1 ? '#aaa' : '#316ec4', borderRightWidth: 1, borderRightColor: '#fafafa', flex: 2, alignSelf: 'stretch', justifyContent: 'center' }}
                                disabled={onPressed === 2 || lengthArrFilesManage < 1}
                                onPress={this.showCopyModal}
                            >
                                <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>{'Thêm vào kho cá nhân'}</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={{ backgroundColor: lengthArrFilesManage !== 1 ? '#aaa' : '#316ec4', flex: 1, alignSelf: 'stretch', justifyContent: 'center' }}
                            disabled={lengthArrFilesManage !== 1}
                            onPress={() => this.setState({ isVisibleConfirmDelete: true })}
                        >
                            <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>{'Xoá'}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <Confirm
                    width={width}
                    isVisible={isVisibleConfirmDelete}
                    titleHeader={'Thông báo'}
                    content={'Đồng chí có đồng ý xoá file đã chọn?'}
                    onCancel={() => this.setState({ isVisibleConfirmDelete: false })}
                    onOk={this.submitDelete}
                />

                <Modal
                    animationInTiming={400}
                    animationOutTiming={500}
                    backdropTransitionInTiming={500}
                    backdropTransitionOutTiming={500}
                    isVisible={isVisible}
                    onBackdropPress={() => this.setState({ isVisible: false })}
                    backdropColor={'rgb(156,156,156)'}
                    hideModalContentWhileAnimating
                >
                    <View style={{ backgroundColor: '#ebeff5', height: height * 0.6, paddingBottom: 65 }}>
                        <CustomHeader
                            title={editingAction}
                            haveBack={modalDocumentsTree.length > 1}
                            onPressButton={this.backDocumentsTree}
                            customHeight={30}
                        />

                        <View style={{ flex: 1 }}>
                            <TouchableWithoutFeedback>
                                <ScrollView
                                    style={{ padding: 10, paddingTop: 0 }}
                                    showsVerticalScrollIndicator={false}
                                >
                                    <View style={{ flex: 1 }}>
                                        {modalDataFolders && this.renderModalItem(modalDataFolders)}
                                    </View>
                                </ScrollView>
                            </TouchableWithoutFeedback>
                        </View>

                        {editing && isVisibleShowFiles && (
                            <ShowFiles
                                isVisible
                                title={'Nội dung tài liệu'}
                                fileId={fileId}
                                toggleModal={() => this.setState({ isVisibleShowFiles: false })}
                            />
                        )}

                        <View style={[styles.flexRow, styles.buttonJoinContainer]}>
                            <TouchableOpacity
                                style={{ backgroundColor: '#316ec4', borderRadius: 4, width: width * 0.38 }}
                                onPress={() => this.setState({ isVisible: false })}
                            >
                                <Text style={{ color: '#fff', paddingVertical: 8, textAlign: 'center' }}>{'Huỷ bỏ'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ backgroundColor: '#316ec4', borderRadius: 4, width: width * 0.38 }}
                                onPress={this.handleSubmitModalMove}
                            >
                                <Text style={{ color: '#fff', paddingVertical: 8, textAlign: 'center' }}>{'Đồng ý'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Notify
                    isVisible={isVisibleNotify}
                    content={contentNotify}
                    width={width}
                    closeNotify={() => this.setState({ isVisibleNotify: false })}
                />

                <Loading loading={firstLoading} />
            </View>
        );
    };
};

const mapStateToProps = state => {
    return {
        error: state.ErrorReducer.error,
        listFiles: state.DocumentReducer.listFiles,
        listNotebookMenu: state.DocumentReducer.listNotebookMenu,
        userInfo: state.AuthenReducer.userInfo,
        resultMove: state.DocumentReducer.resultMove,
        resultCopy: state.DocumentReducer.resultCopy,
        resultDelete: state.DocumentReducer.resultDelete,
        resultFavorite: state.DocumentReducer.resultFavorite,
    };
};

export default connect(
    mapStateToProps,
    { getStorageFiles, moveFilesToFolder, deleteFiles, copyFileToFolder, saveFavoriteFiles, getListNotebookMenu }
)(Notebook);
