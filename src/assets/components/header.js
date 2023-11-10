import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './style';
import { logOut } from '../../redux/actions/authen.action';
import Confirm from './confirm';
import { WSClose } from '../../components/websocket/websocket';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import Mailer from 'react-native-mail';
import { captureScreen } from "react-native-view-shot";
// import MailFeedback from '../components/mail-feedback/mail-feedback';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
class Header extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isVisibleConfirmLogOut: false,
        };
    }

    showModalLogout = () => {
        this.setState({
            isVisibleConfirmLogOut: true,
        });
    };
    handleSendEmail = () => {
        captureScreen({
            format: "jpg",
            quality: 0.8
        })
            .then(
                uri => {
                    let path = "";
                    if (Platform.OS !== 'ios') {
                        try {
                            const granted = PermissionsAndroid.request(
                                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                            );
                            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                                hasPermission = granted !== PermissionsAndroid.RESULTS.GRANTED;
                            }
                            if (!granted) {
                                handleError(i18n.t('Bạn cần cấp quyền để chụp màn hình phản ánh'));
                                return;
                            }
                        } catch (error) {
                            console.warn(error);
                        }

                        path = `${RNFS.ExternalStorageDirectoryPath}/anh_dinh_kem${Number(new Date())}.jpg`;

                        try {
                            RNFS.copyFile(uri, path);
                        } catch (error) {
                            console.warn(error);
                            return;
                        }
                    }
                    Mailer.mail({
                        subject: `[ECABINET-GÓP Ý] Ecabinet`,
                        recipients: ['hotro_cntt@viettel.com.vn'],
                        ccRecipients: ['ducnp@viettel.com.vn'],
                        isHTML: true, // iOS only, exclude if false
                        customChooserTitle: 'Gửi email phản ánh',
                        attachments: [{
                            path: path,  // The uri of the file from which to read the data.
                            type: 'jpg', // Mime Type: jpg, png, doc, ppt, html, pdf, csv
                            // mimeType: '', // - use only if you want to use custom type
                            name: 'anh_kem.jpg', // Optional: Custom filename for attachment
                        }]
                    }, (error, event) => {
                        Alert.alert(
                            error,
                            event,
                            [
                                { text: 'Ok', onPress: () => console.log('OK: Email Error Response') },
                                { text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response') }
                            ],
                            { cancelable: true }
                        )
                    });
                },
                error => Alert.alert("Không thể chụp ảnh màn hình")
            );
    }
    handleLogout = async () => {
        this.setState({
            isVisibleConfirmLogOut: false,
        }, async () => {
            await this.props.logOut();
            WSClose();
            this.props.navigation.navigate('StartScreen');
        });
    };

    // pressBack = () => {
    //     this.props.navigation.goBack();
    // };

    render() {
        const {
            haveBack = false,
            haveMenu = false,
            haveEdit = false,
            haveLogOut = false,
            haveCancel = false,
            haveClose = false,
            haveEmail = true,
            onPressButton,
            onEdit,
            onCancel,
            onClose,
            title = '',
            customHeight = 0,
            width,
        } = this.props;

        const { isVisibleConfirmLogOut = false } = this.state;

        let topIcon = '';
        if (haveMenu) topIcon = 'menu';
        if (haveBack) topIcon = 'chevron-left';

        const haveLeftButton = haveMenu || haveBack;
        const haveRightButton = haveEdit || haveLogOut || haveCancel || haveClose;

        return (
            <View style={[styles.containerHeader, { justifyContent: haveLeftButton ? 'space-between' : 'center' }, customHeight !== 0 ? { height: customHeight } : { minHeight: 45 }]}>
                {haveLeftButton && (
                    <TouchableOpacity onPress={onPressButton}>
                        <View style={styles.containerMenuIcon}>
                            {haveMenu ? (
                                <IconM name={topIcon} size={25} color="#fff" />
                            ) : (
                                <IconM name={topIcon} size={35} color="#fff" />
                            )}
                        </View>
                    </TouchableOpacity>
                )}

                {!haveLeftButton && (
                    <View style={styles.containerMenuIcon}>
                        <IconM name={'logout'} size={25} color={'#316ec4'} />
                    </View>
                )}

                <View style={{ flex: 1, position: 'relative', left: haveClose ? 0 : 20 }}>
                    <Text
                        style={[styles.textTitle, { textTransform: 'uppercase', position: 'relative', right: Platform.OS === 'android' ? 0 : haveEmail? 20 :0 }]}
                        numberOfLines={2}
                    >
                        {title}
                    </Text>
                </View>

                {!haveRightButton && (
                    <View style={styles.containerMenuIcon}>
                        <IconM name={'logout'} size={25} color={'#316ec4'} />
                    </View>
                )}

                {haveEdit && (
                    <TouchableOpacity onPress={haveCancel ? onCancel : onEdit}>
                        <View style={styles.containerMenuIcon}>
                            <IconM name={haveCancel ? 'cancel' : 'folder-edit-outline'} size={25} color={'#fff'} />
                        </View>
                    </TouchableOpacity>
                )}
                {haveEmail && Platform.OS !== 'ios' && (
                    <TouchableOpacity onPress={this.handleSendEmail}>
                        <View style={styles.containerMenuIcon}>
                            <IconFA name="envelope" size={20} color="#fff" />
                        </View>
                    </TouchableOpacity>)
                }
                {haveClose && (
                    <TouchableOpacity onPress={onClose}>
                        <View style={styles.containerMenuIcon}>
                            <IconM name={'close'} size={25} color={'#fff'} />
                        </View>
                    </TouchableOpacity>
                )}

                {haveLogOut && (
                    <TouchableOpacity onPress={this.showModalLogout}>
                        <View style={[styles.containerMenuIcon, { justifyContent: 'flex-end' }]}>
                            <IconM name={'logout'} size={25} color={'#fff'} />
                        </View>
                    </TouchableOpacity>
                )}

                {haveLogOut && (
                    <Confirm
                        width={width}
                        isVisible={isVisibleConfirmLogOut}
                        titleHeader={'Xác nhận'}
                        content={'Đồng chí xác nhận đăng xuất?'}
                        onCancel={() => this.setState({ isVisibleConfirmLogOut: false })}
                        onOk={this.handleLogout}
                    />
                )}

            </View>
        );
    };
};

const mapStateToProps = state => {
    return {
        error: state.ErrorReducer.error,
    };
};

export default connect(mapStateToProps, { logOut })(Header);
