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

class DocumentHome extends Component {
    constructor(props) {
        super(props);

        const { width, height } = Dimensions.get('window');
        this.state = {
            width,
            height,
            onPressed: 1,
            isVisible: false,
            arrFilesManage: [],
            firstLoading: true,
            isVisibleNotify: false,
            searchKeyword: '',
        };
    };

    componentDidMount = async () => {
        await this.handleGetStorageFiles('');
        await this.handleGetListNotebookMenu('');
        let listPersonalFiles = [];
        let listPublicFiles = [];
        let listSharedFiles = [];
        const { listFiles = [] } = this.props;

        if (!listFiles || listFiles.length === 0) {
            this.setState({
                firstLoading: false,
            });
            return;
        }

        listFiles.forEach(element => {
            const { typeName = '' } = element;
            if (typeName === ROOT_FOLDER_NAME.CA_NHAN) {
                listPersonalFiles = { ...element };
            }
            if (typeName === ROOT_FOLDER_NAME.DUNG_CHUNG) {
                listPublicFiles = { ...element };
            }
            if (typeName === ROOT_FOLDER_NAME.DUOC_CHIA_SE) {
                listSharedFiles = { ...element };
            }
        });

        this.pushFolderTree(listPublicFiles.folderTree);

        this.setState({
            listPersonalFiles,
            listPublicFiles,
            listSharedFiles,
            firstLoading: false,
        });
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        // this.backHandler.remove();
    }

    handleBackPress = () => {
        if (this.state.editing) {
            this.setState({ editing: false });
            return true;
        }
        if (this.state.documentsTree.length > 1) {
            this.backDocumentsTree();
            return true;
        }
        return false;
    };

    handleGetStorageFiles = async (keyword) => {
        await this.props.getStorageFiles({ keyword });
    };
    handleGetListNotebookMenu = async (keyword) => {
        await this.props.getListNotebookMenu({
            keyword: keyword,
            userId: this.props.userInfo.appUser.id
        });
    };

    pushFolderTree = (folderTree, changeLibrary) => {
        const { documentsTree = [], isVisible = false, modalDocumentsTree = [] } = this.state;
        let newTree = [];
        if (!changeLibrary) {
            newTree = isVisible ? [...modalDocumentsTree] : [...documentsTree];
        }
        newTree.push(folderTree);

        this.setState({
            documentsTree: isVisible ? documentsTree : newTree,
            modalDocumentsTree: isVisible ? newTree : modalDocumentsTree
        });
    };

    renderItem = (folderTree) => {
        const { editing = false, arrFilesManage = [] } = this.state;
        const { children = [], lstFile = [] } = folderTree;

        const listFoldersChild = [];
        const listFilesChildFavorite = [];
        const listFilesChildNotFavorite = [];

        children.forEach(element => {
            const { id, name } = element;
            const type = 1;
            const itemData =
                <TouchableOpacity
                    style={[styles.itemContainer, { marginTop: 10 }]} key={`folder${id}`}
                    onPress={() => {
                        if (this.state.editing) {
                            this.setState({ editing: false });
                            return;
                        }
                        this.pushFolderTree(element);
                    }}>
                    <View style={[styles.flexRow, { paddingHorizontal: 10, paddingVertical: 8 }]}>
                        <View>
                            <IconM name={colorSlide[type].icon} size={25} color={colorSlide[type].color} />
                        </View>
                        <View style={{ marginLeft: 10, width: '90%' }}>
                            <Text style={{ fontWeight: type === 1 ? 'bold' : 'normal' }}>
                                {name}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>;
            listFoldersChild.push(itemData);
        });

        lstFile.forEach((element, index) => {
            const { id, name, favoriteNum } = element;
            const type = 2;
            const contained = arrFilesManage.indexOf(id) > -1;
            const itemData =
                <View style={[styles.itemFile, index === 0 ? { marginTop: 5 } : { marginTop: 10 }]} key={`file${id}`}>
                    <View style={[styles.flexRow, { paddingHorizontal: 10, paddingVertical: 8 }]}>
                        {editing && (
                            <TouchableOpacity
                                style={{ paddingVertical: 6, paddingHorizontal: 4, marginRight: 6 }}
                                onPress={() => this.setState({ arrFilesManage: contained ? arrFilesManage.filter(x => id !== x) : [...arrFilesManage, id] })}
                            >
                                <RadioButtonInput
                                    animation={false}
                                    obj={element}
                                    index={index}
                                    isSelected={contained}
                                    onPress={() => this.setState({ arrFilesManage: contained ? arrFilesManage.filter(x => id !== x) : [...arrFilesManage, id] })}
                                    borderWidth={1}
                                    buttonSize={10}
                                    buttonOuterSize={15}
                                    buttonInnerColor={'#316ec4'}
                                    buttonOuterColor={'#316ec4'}
                                    buttonStyle={{}}
                                // buttonWrapStyle={{ marginRight: 10 }}
                                />
                            </TouchableOpacity>
                        )}
                        <View>
                            <IconM name={colorSlide[type].icon} size={25} color={colorSlide[type].color} />
                        </View>
                        <View style={{ marginHorizontal: 10, flex: 1 }}>
                            <Text style={{ fontWeight: type === 1 ? 'bold' : 'normal' }} numberOfLines={2}>
                                {name}
                            </Text>
                            <TouchableOpacity style={styles.buttonViewDocument} onPress={() => this.setState({ isVisibleShowFiles: true, fileId: id, fileName: name })}>
                                <View style={[styles.flexRow, { justifyContent: 'space-evenly' }]}>
                                    <IconM name={'download'} size={15} color={colorSlide[type].color} />
                                    <Text style={{ color: '#7cabd8', fontSize: 13 }}>
                                        {'Xem tài liệu '}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {!editing && (
                            <TouchableOpacity
                                onPress={this.saveFavorite(favoriteNum, id)}
                            >
                                <IconM name={favoriteNum ? 'star' : 'star-outline'} size={30} color={'#ffcc33'} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>;
            if (favoriteNum) {
                listFilesChildFavorite.push(itemData);
            } else {
                listFilesChildNotFavorite.push(itemData);
            }
        });
        const listFilesChild = [...listFilesChildFavorite, ...listFilesChildNotFavorite];
        return [...listFoldersChild, ...listFilesChild];
    };

    renderModalItem = (folderTree) => {
        const { children = [], lstFile = [] } = folderTree;

        const listFoldersChild = [];
        const listFilesChild = [];

        children.forEach(element => {
            const { id, name } = element;
            const type = 1;
            const itemData =
                <TouchableOpacity style={[styles.itemContainer, { marginTop: 10 }]} key={`folder${id}`} onPress={() => this.pushFolderTree(element)}>
                    <View style={[styles.flexRow, { paddingHorizontal: 10, paddingVertical: 8 }]}>
                        <View>
                            <IconM name={colorSlide[type].icon} size={25} color={colorSlide[type].color} />
                        </View>
                        <View style={{ marginLeft: 10, width: '90%' }}>
                            <Text style={{ fontWeight: type === 1 ? 'bold' : 'normal' }}>
                                {name}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>;
            listFoldersChild.push(itemData);
        });

        lstFile.forEach((element, index) => {
            const { id, name } = element;
            const type = 2;
            const itemData =
                <View style={[styles.itemFile, index === 0 ? { marginTop: 5 } : { marginTop: 10 }]} key={`file${id}`}>
                    <View style={[styles.flexRow, { paddingHorizontal: 10, paddingVertical: 8 }]}>
                        <View>
                            <IconM name={colorSlide[type].icon} size={25} color={colorSlide[type].color} />
                        </View>
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ fontWeight: type === 1 ? 'bold' : 'normal' }}>
                                {name}
                            </Text>
                            <TouchableOpacity style={styles.buttonViewDocument} onPress={() => this.setState({ isVisibleShowFiles: true, fileId: id, fileName: name })}>
                                <View style={[styles.flexRow, { justifyContent: 'space-evenly' }]}>
                                    <IconM name={'download'} size={15} color={colorSlide[type].color} />
                                    <Text style={{ color: '#7cabd8', fontSize: 13 }}>
                                        {'Xem tài liệu '}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>;
            listFilesChild.push(itemData);
        });
        return [...listFoldersChild, ...listFilesChild];
    };

    getFirst = (stack = []) => {
        return stack[stack.length - 1];
    };

    removeFirst = (stack = []) => {
        return stack.splice(0, stack.length - 1);
    };

    removeLast = (stack = []) => {
        return stack.splice(1, stack.length - 1);
    };

    backDocumentsTree = () => {
        if (this.state.editing && !this.state.isVisible) {
            this.setState({ editing: false });
            return;
        }
        const { documentsTree = [], isVisible = false, modalDocumentsTree = [] } = this.state;
        const newDocumentsTree = this.removeFirst(isVisible ? modalDocumentsTree : documentsTree);
        this.setState({
            documentsTree: isVisible ? documentsTree : newDocumentsTree,
            modalDocumentsTree: isVisible ? newDocumentsTree : modalDocumentsTree,
            // editing: !isVisible && newDocumentsTree.length === 0 ? false : editing,
        });
    };

    showMoveModal = () => {
        const { documentsTree = [] } = this.state;
        const modalDocumentsTree = [...documentsTree];
        this.setState({ isVisible: true, modalDocumentsTree, typeSubmit: 'move' });
    };

    showCopyModal = () => {
        const { listPersonalFiles } = this.state;
        const modalDocumentsTree = [{ ...listPersonalFiles.folderTree }];
        this.setState({ isVisible: true, modalDocumentsTree, typeSubmit: 'copy' });
    };

    handleRotate = event => {
        const { nativeEvent: { layout: { width, height } = {} } = {} } = event;
        this.setState({
            width,
            height
        });
    };

    submitMove = async () => {
        const { arrFilesManage, modalDocumentsTree } = this.state;
        const modalDataFolders = this.getFirst(modalDocumentsTree);

        const body = {
            files: arrFilesManage,
            folder: modalDataFolders.id,
        };
        await this.props.moveFilesToFolder(body);
        await this.syncManageFile(this.props.resultMove, 'move');
    };

    submitCopy = async () => {
        const { arrFilesManage, modalDocumentsTree } = this.state;
        const modalDataFolders = this.getFirst(modalDocumentsTree);

        const body = {
            files: arrFilesManage,
            folder: modalDataFolders.id,
        };

        await this.props.copyFileToFolder(body);
        await this.syncManageFile(this.props.resultCopy, 'copy');
    };

    submitDelete = async () => {
        this.setState({ isVisibleConfirmDelete: false });
        setTimeout(async () => {
            const { arrFilesManage = [] } = this.state;
            const id = arrFilesManage[0];
            await this.props.deleteFiles({ id });
            await this.syncManageFile(this.props.resultDelete, 'delete');
        }, 500);
    };

    saveFavorite = (favorite, id) => async () => {
        const listId = [id];
        await this.props.saveFavoriteFiles({ saveIds: !favorite ? listId : [], removeIds: favorite ? listId : [] });
        await this.syncManageFile(this.props.resultFavorite, 'favorite');
    };

    syncManageFile = async (result, type) => {
        if (result) {
            const { searchKeyword = '' } = this.state;
            await this.handleGetStorageFiles(searchKeyword);

            const { documentsTree = [] } = this.state;
            const { listFiles = [] } = this.props;

            let listPersonalFiles = [];
            let listPublicFiles = [];
            let listSharedFiles = [];
            const newDocumentsTree = [];

            listFiles.forEach(element => {
                const { typeName = '' } = element;
                if (typeName === ROOT_FOLDER_NAME.DUNG_CHUNG) {
                    listPublicFiles = { ...element };
                    if (this.state.onPressed === 1) newDocumentsTree.push(listPublicFiles.folderTree);
                }
                if (typeName === ROOT_FOLDER_NAME.CA_NHAN) {
                    listPersonalFiles = { ...element };
                    if (this.state.onPressed === 2) newDocumentsTree.push(listPersonalFiles.folderTree);
                }
                if (typeName === ROOT_FOLDER_NAME.DUOC_CHIA_SE) {
                    listSharedFiles = { ...element };
                    if (this.state.onPressed === 3) newDocumentsTree.push(listSharedFiles.folderTree);
                }
            });

            for (let i = 0; newDocumentsTree.length < documentsTree.length; i += 1) {
                const itemDocumentsTree = documentsTree[i + 1];
                const { children = [] } = newDocumentsTree[i];

                const ind = children.filter(element => itemDocumentsTree.id === element.id);

                if (ind.length !== 0) {
                    newDocumentsTree.push({ ...ind[0] });
                } else {
                    break;
                }
            };

            let contentNotify = '';
            if (type === 'copy') {
                contentNotify = 'Thêm tài liệu vào thư viện cá nhân thành công!';
            }
            if (type === 'move') {
                contentNotify = 'Di chuyển tài liệu thành công!';
            }
            if (type === 'delete') {
                contentNotify = 'Xóa tài liệu thành công!';
            }

            this.setState({
                documentsTree: newDocumentsTree.length === documentsTree.length ? newDocumentsTree : [],
                isVisible: false,
                editing: false,
                arrFilesManage: [],
                isVisibleConfirmDelete: false,
                listPersonalFiles,
                listPublicFiles,
                listSharedFiles,
                isVisibleNotify: type !== 'favorite' && type !== 'search',
                contentNotify,
            });
        } else {
            let contentNotify = '';
            if (type === 'copy') {
                contentNotify = 'Thêm tài liệu vào thư viện cá nhân thất bại!';
            }
            if (type === 'move') {
                contentNotify = 'Di chuyển tài liệu thất bại!';
            }
            if (type === 'delete') {
                contentNotify = 'Xóa tài liệu thất bại!';
            }

            this.setState({
                isVisible: false,
                editing: false,
                arrFilesManage: [],
                isVisibleConfirmDelete: false,
                isVisibleNotify: true,
                contentNotify,
            });
        }
    };

    handleSubmitModalMove = () => {
        this.setState({ isVisible: false });
        setTimeout(() => {
            if (this.state.typeSubmit === 'move') {
                this.submitMove();
            }
            if (this.state.typeSubmit === 'copy') {
                this.submitCopy();
            }
        }, 500);
    }

    render() {
        const {
            width,
            height,
            isVisibleShowFiles,
            fileName = "name.pdf",
            onPressed = 1,
            documentsTree = [],
            searchKeyword: valueSearchBox = '',
            isVisible = false,
            modalDocumentsTree = [],
            editingAction = 'Di chuyển đến',
            fileId,
            editing,
            arrFilesManage = [],
            isVisibleConfirmDelete = false,
            listPersonalFiles,
            listPublicFiles,
            listSharedFiles,
            firstLoading,
            isVisibleNotify = false,
            contentNotify = '',
        } = this.state;

        const lengthArrFilesManage = arrFilesManage.length;
        const dataFolders = this.getFirst(documentsTree);
        const modalDataFolders = this.getFirst(modalDocumentsTree);
        const isRootFolder = documentsTree.length > 1;

        return (
            <View style={[styles.container, { backgroundColor: '#fafafa' }]}>
                <CustomHeader
                    title={'THƯ VIỆN VĂN BẢN'}
                    navigation={this.props.navigation}
                    haveBack={isRootFolder}
                    onPressButton={this.backDocumentsTree}
                    haveEdit={onPressed !== 3}
                    onEdit={() => this.setState({ editing: true })}
                    haveCancel={editing}
                    onCancel={() => this.setState({ editing: false, arrFilesManage: [] })}
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
                            name={fileName}
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
                                name={fileName}
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
            </View >
        );
    };
};

const colorSlide = {
    1: {
        color: '#fc9463',
        icon: 'folder-open-outline',
    },
    2: {
        color: '#7cabd8',
        icon: 'file-document-outline',
    },
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
)(DocumentHome);
