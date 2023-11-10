import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    FlatList
} from 'react-native';
import IconFA from 'react-native-vector-icons/FontAwesome';
import Confirm from '../../assets/components/confirm';
import { WSClose } from '../websocket/websocket';
import { logOut } from '../../redux/actions/authen.action';
import styles from './style';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import Mailer from 'react-native-mail';
import { captureScreen } from "react-native-view-shot";
import RNFS from 'react-native-fs';
import ChangePassword from '../account/change-password';
import Keychain from 'react-native-keychain'
import AsyncStorage from '@react-native-async-storage/async-storage';

class ExpandMenuScreen extends Component {
    constructor(props) {
        super(props);

        const { width } = Dimensions.get('window');
        const { userInfo = {} } = this.props;
        const { appUser = {} } = userInfo;
        this.state = {
            width,
            listMenu: [
                // {
                //     label: 'Cơ sở dữ liệu luật',
                //     icon: 'inbox',
                //     // navRoute: 'LawStack',
                //     navRoute: '',
                // },
                // {
                //     label: 'Nghị quyết',
                //     icon: 'file-text-o',
                //     // navRoute: 'ResolutionStack',
                //     navRoute: '',
                // },
                {
                    label: 'Kho tài liệu',
                    icon: 'file-zip-o',
                    navRoute: 'DocumentStack',
                },
                // {
                //     label: 'Sổ tay cá nhân',
                //     icon: 'file-zip-o',
                //     navRoute: 'NotebookStack',
                // },
                {
                    label: 'Đổi mật khẩu',
                    icon: 'user-o',
                    navRoute: 'ChangePasswordStack',
                },
                // {
                //     label: 'Tra cứu toàn văn',
                //     icon: 'search',
                //     navRoute: 'SearchStack',
                // },
            ],
            appUser,
            isVisibleChangePassword: false
        };
    };

    componentDidMount = () => {

    }

    renderItem = ({ item = {} }) => {
        const {
            label = '',
            icon = '',
            navRoute = '',
        } = item;

        return (
            // label === 'Đổi mật khẩu' ? (
            //     <TouchableOpacity onPress={() => this.showModalChangePass} disabled={navRoute === ''}>
            //         <View style={{
            //             flexDirection: 'row',
            //             alignItems: 'center',
            //             height: 50,
            //             borderBottomColor: '#ccc',
            //             borderBottomWidth: 1,
            //         }}>
            //             <IconFA name={icon} size={20} color="#111" />
            //             <View style={{
            //                 flex: 1,
            //                 flexDirection: 'row',
            //                 alignItems: 'center',
            //                 justifyContent: 'space-between',
            //                 paddingLeft: 10,
            //             }}>
            //                 <Text style={{ fontSize: 15 }}>{label}</Text>
            //                 <IconFA name={'chevron-right'} size={13} color="#111" />
            //             </View>
            //         </View>
            //     </TouchableOpacity>
            // ) :
            //     (
            <TouchableOpacity onPress={() => this.props.navigation.navigate(navRoute)} disabled={navRoute === ''}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 50,
                    borderBottomColor: '#ccc',
                    borderBottomWidth: 1,
                }}>
                    <IconFA name={icon} size={20} color="#111" />
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingLeft: 10,
                    }}>
                        <Text style={{ fontSize: 15 }}>{label}</Text>
                        <IconFA name={'chevron-right'} size={13} color="#111" />
                    </View>
                </View>
            </TouchableOpacity>
            // )
        );
    }

    showModalLogout = () => {
        this.setState({
            isVisibleConfirmLogOut: true,
        });
    };
    showModalChangePass = () => {
        this.setState({
            isVisibleChangePassword: true,
        });
    };
    handleLogout = async () => {
        this.setState({
            isVisibleConfirmLogOut: false,
        },
            async () => {
                await Keychain.resetGenericPassword();
                const { appUser } = this.state;
                const { userNameJoint = '' } = appUser;
                await AsyncStorage.setItem('userNameAsync', userNameJoint);
                await this.props.logOut();
                WSClose();
                setTimeout(async () => {
                    this.props.navigation.navigate('StartScreen');
                }, 500);
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
    render() {
        const { listMenu = [], width, isVisibleConfirmLogOut, appUser, isVisibleChangePassword } = this.state;
        const { fullName = '', position = '' } = appUser;

        return (
            <View style={[styles.container, { backgroundColor: '#fafafa' }]}>
                <View style={{ height: 120, backgroundColor: '#316ec4', paddingTop: 45, paddingLeft: 50, flexDirection: "row", justifyContent: "space-between" }}>
                    <View>
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20, textTransform: 'uppercase' }}>{fullName}</Text>
                        <Text style={{ color: '#fff', fontSize: 15, paddingTop: 3 }}>{position}</Text>
                    </View>
                    {
                        Platform.OS !== 'ios' && (
                            <TouchableOpacity
                                style={{
                                    color: '#fff', fontSize: 15, marginRight: 10,
                                    width: 30
                                }}
                                onPress={this.handleSendEmail}>
                                <View>
                                    <IconFA name="envelope" size={25} color="#fff" />
                                </View>
                            </TouchableOpacity>)
                    }

                </View>

                <FlatList
                    data={listMenu}
                    extraData={this.state.extraData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem}
                    showsVerticalScrollIndicator={false}
                    style={{ padding: 20 }}
                />

                <TouchableOpacity onPress={this.showModalLogout} style={[styles.containerButton, { width: width * 0.6 }]}>
                    <Text style={styles.textButton}>{'Đăng xuất'}</Text>
                </TouchableOpacity>

                <Confirm
                    width={width}
                    isVisible={isVisibleConfirmLogOut}
                    titleHeader={'Xác nhận'}
                    content={'Đồng chí xác nhận đăng xuất?'}
                    onCancel={() => this.setState({ isVisibleConfirmLogOut: false })}
                    onOk={this.handleLogout}
                />
                {/* <ChangePassword
                    isVisible={isVisibleChangePassword}
                    width={width}
                    userInfo={this.props.userInfo}
                /> */}
            </View>
        );
    };
};

const mapStateToProps = state => {
    return {
        error: state.ErrorReducer.error,
        userInfo: state.AuthenReducer.userInfo,
    };
};

export default connect(mapStateToProps, { logOut })(ExpandMenuScreen);
