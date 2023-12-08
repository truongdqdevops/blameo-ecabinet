import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    Platform,
    PermissionsAndroid,
    ActivityIndicator,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    Alert,
    TextInput
} from 'react-native';
import Slider from 'react-native-slider';
import Sound from 'react-native-sound';
import Modal from 'react-native-modal';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob';
import { Buffer } from 'buffer';
import styles from './style';
import { hostURL } from '../../services/service';
import { Message } from '../../assets/utils/message';
import RNFS from 'react-native-fs';
import Pdf from 'react-native-pdf';
import FileViewer from 'react-native-file-viewer';
import Confirm from '../../assets/components/confirm';
import ProgressBar from 'react-native-progress/Bar';
import KeyboardListener from 'react-native-keyboard-listener';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

Sound.setCategory('Playback',true);
const { dirs } = RNFetchBlob.fs;
const srcImg = require('../../assets/images/no-document.png');
const notFoundBase64 = Buffer.from('Không tìm thấy file', 'utf8').toString('base64');
class ShowFiles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            playState: 'paused',
            playSeconds: 0,
            duration: 0,
            sliderEditing: false,
            url: '',
            numberRotation: 0,
            heightRotation: Dimensions.get('window').height,
            progressDownload: 0,
            contentLength: 0,
            currentPage: 1,
            totalPage: 0,
            isLoadSuccess: false,
            keyboardOpen: false
        };
        this.onLayout = this.onLayout.bind(this);
    };
    onLayout(e) {
        this.setState({
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
        });
    }
    componentDidMount = async () => {
        this.timeout = setInterval(() => {
            if (this.sound && this.sound.isLoaded() && this.state.playState === 'playing' && !this.state.sliderEditing) {
                this.sound.getCurrentTime((seconds) => {
                    this.setState({ playSeconds: seconds });
                });
            }
        }, 100);
        const { fileId } = this.props;
        if (fileId) {
            await this.handleViewFile(fileId);
            const callback = (error) => {
                if (error) {
                    // console.log('error', error);
                    this.setState({ playState: 'paused', errMp3: true });
                    return;
                }
                this.setState({ duration: this.sound._duration });
            };
            this.sound = new Sound(this.state.mp3Path, '', error => callback(error));
        }
    };

    handleViewFile = async (id) => {
        if (this.state.editing) return;
        const url = this.getUrlDownload(id);
        const urlMp3 = this.getUrlDownloadMp3(id);

        console.log("URL IS: ", url);
        this.setState({
            url
        });
        let localFile = `${RNFS.DocumentDirectoryPath}/temporaryfile.`;
        const { name = "name.pdf" } = this.props;
        if (name.indexOf(".docx") > -1)
            localFile = `${localFile}docx`;
        else if (name.indexOf(".doc") > -1)
            localFile = `${localFile}docx`;
        else if (name.indexOf(".xlsx") > -1)
            localFile = `${localFile}xlsx`;
        else if (name.indexOf(".xls") > -1)
            localFile = `${localFile}xls`;
        else if (name.indexOf(".pptx") > -1)
            localFile = `${localFile}pptx`;
        else if (name.indexOf(".ppt") > -1)
            localFile = `${localFile}ppt`;
        else if (name.indexOf(".txt") > -1)
            localFile = `${localFile}txt`;
        if (name.indexOf(".pdf") > 0) {
            const sourcePdf = { uri: url, cache: true };
            this.setState({ sourcePdf: sourcePdf, errPdf: "NO ERROR" });

        } else {
            this.setState({
                errPdf: "Not pdf",
                sourcePdf: ""
            });

            const options = {
                fromUrl: url,
                toFile: localFile
            };
            // console.log(url);
            RNFS.downloadFile(options).promise
                .then(() => FileViewer.open(localFile))
                .then(() => {
                    // success
                })
                .catch(error => {
                    Alert.alert("Thông báo", "Thiết bị chưa được cài ứng dụng đọc file, vui lòng cài đặt và thử lại!")
                    console.log(error)
                });
        }

        const res = await RNFetchBlob.config({ fileCache: true, path: `${dirs.CacheDir}/sound.mp3` }).fetch('GET', urlMp3);
        this.setState({
            mp3Path: res.path()
        });
    }

    getUrlDownload = (id) => {
        const { sessionId = '' } = this.props;
        const remoteUri = `${hostURL()}/Attachment/get?id=${id}&session=${sessionId}`;
        return remoteUri;
    };

    getUrlDownloadMp3 = (id) => {
        const { sessionId = '' } = this.props;
        const remoteUri = `${hostURL()}/Attachment/getmp3?id=${id}&session=${sessionId}`;
        return remoteUri;
    };

    componentWillUnmount() {
        if (this.sound) {
            this.sound.release();
            this.sound = null;
        }
        if (this.timeout) {
            clearInterval(this.timeout);
        }
    }

    onSliderEditStart = () => {
        this.setState({
            sliderEditing: true,
        });
    };

    onSliderEditEnd = () => {
        this.setState({
            sliderEditing: false,
        });
    };

    onSliderEditing = value => {
        if (this.sound) {
            this.sound.setCurrentTime(value);
            this.setState({ playSeconds: value });
        }
    };

    play = async () => {
        if (this.sound) {
            this.sound.play(this.playComplete);
            this.setState({ playState: 'playing' });
        }
    };

    playComplete = () => {
        if (this.sound) {
            this.setState({ playState: 'paused', playSeconds: 0 });
            this.sound.setCurrentTime(0);
        }
    };

    pause = () => {
        if (this.sound) {
            this.sound.pause();
        }
        this.setState({ playState: 'paused' });
    };

    jumpSeconds = (secsDelta) => {
        if (this.sound) {
            this.sound.getCurrentTime((secs) => {
                let nextSecs = secs + secsDelta;
                if (nextSecs < 0) nextSecs = 0;
                else if (nextSecs > this.state.duration) nextSecs = this.state.duration;
                this.sound.setCurrentTime(nextSecs);
                this.setState({ playSeconds: nextSecs });
            });
        }
    };

    getAudioTimeString(seconds) {
        const h = parseInt((seconds / (60 * 60)), 10);
        const m = parseInt((seconds % (60 * 60) / 60), 10);
        const s = parseInt((seconds % 60), 10);

        return (`${(seconds >= 3600 ? (`${h < 10 ? `0${h}` : h}:`) : '') + (m < 10 ? `0${m}` : m)}:${s < 10 ? `0${s}` : s}`);
    };
    downloadFile = async (url, name) => {
        const { dirs } = RNFetchBlob.fs;
        const isPdf  = name.indexOf(".pdf") > 0;
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    const configs = {
                        fileCache: true,
                        addAndroidDownloads: {
                            useDownloadManager: true,
                            notification: true,
                            mediaScannable: true,
                            title: name,
                            path: `${dirs.DownloadDir}/${name}`,
                        },
                    }

                    if(isPdf){
                        configs.addAndroidDownloads.mime = 'application/pdf'
                    }

                    RNFetchBlob.config(configs)
                        .fetch('GET', url, {})
                        .then((res) => {
                            console.log('The file saved to ', res.path());
                        })
                        .catch((e) => {
                            console.log(e)
                        });
                } else {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                    );
                }
            } else {
                // iOS here, so you can go to your Save flow directly
                //
            }
        } catch (e) {
            console.log(e);
        }
    };
    toggleRotation = (isRight) => {
        const { numberRotation } = this.state;
        if (numberRotation === 270 && isRight) {
            this.setState({ numberRotation: 0 });
        } else if (numberRotation === 0 && !isRight) {
            this.setState({ numberRotation: 270 });
        } else
            this.setState({ numberRotation: isRight ? numberRotation + 90 : numberRotation - 90 });
    }

    onCheckLimit = () => {
        if (Number.isNaN(Number.parseInt(this.state.currentPage))) {
            this.setState({ currentPage: 1 })
            this.pdf.setPage((1));
        } else
            if (this.state.currentPage > this.state.totalPage) {
                this.setState({ currentPage: this.state.totalPage })
                this.pdf.setPage(Number.parseInt(this.state.currentPage));
            } else {
                this.pdf.setPage(Number.parseInt(this.state.currentPage));
            }
    }

    increasePage = () => {
        if (this.state.currentPage < this.state.totalPage) {
            this.pdf.setPage(Number.parseInt(this.state.currentPage + 1));
            this.setState({ currentPage: this.state.currentPage + 1 })
        }
    }
    decreasePage = () => {
        if (this.state.currentPage > 1) {
            this.pdf.setPage(Number.parseInt(this.state.currentPage - 1));
            this.setState({ currentPage: this.state.currentPage - 1 })
        }
    }
    calculatePaddingForViewPage = (width, height, errorMp3, isKeyBoardOpen) => {
        let paddingNum = 0;
        if (width < height) {
            paddingNum = 50;
            if (isKeyBoardOpen) {
                paddingNum = paddingNum + height * 0.3;
                if (Platform.OS == 'ios') paddingNum += 30;
            }


        } else {
            paddingNum = 120;
            if (isKeyBoardOpen) {
                paddingNum = paddingNum + width * 0.3;
                if (Platform.OS == 'ios') paddingNum += 30;
            }

        }
        if (!errorMp3)
            paddingNum = paddingNum + 80;

        return paddingNum;
    }
    render() {
        const { width, height, mp3Path, playState, errMp3 = false, errPdf = '', url, numberRotation = 0, isVisibleConfirm = false, sourcePdf = '',
            progressDownload, totalPage, currentPage, isLoadSuccess, keyboardOpen } = this.state;
        const { name } = this.props;
        // const source = {
        //     uri: `data:application/pdf;base64,${strBase64}`
        // };
        const {
            isVisible = false,
            title = '',
            toggleModal,
        } = this.props;

        const currentTimeString = this.getAudioTimeString(this.state.playSeconds);
        const durationString = this.getAudioTimeString(this.state.duration);

        return (
            <Modal
                onLayout={this.onLayout}
                animationInTiming={400}
                animationOutTiming={500}
                backdropTransitionInTiming={500}
                backdropTransitionOutTiming={500}
                isVisible={isVisible}
                backdropColor={'rgb(156,156,156)'}
                hideModalContentWhileAnimating
                style={{ width, height, marginLeft: 0 }}
            >
                <View style={{
                    backgroundColor: '#ebeff5',
                    flex: Platform.select({ ios: 0.95, android: 1 })
                }}>
                    <View style={[styles.flexRow, { backgroundColor: '#316ec4', paddingVertical: 8, justifyContent: 'space-between' }]}>
                        {/* <View style={[styles.buttonOpenDrawer, { width: width * 0.1 }]}>
                            <IconM name={'close'} size={25} color={'#316ec4'} />
                        </View> */}
                        {
                            Platform.OS !== 'ios' ? (
                                <TouchableOpacity onPress={() => this.setState({ isVisibleConfirm: true })}
                                >
                                    <View style={[styles.buttonOpenDrawerBorder, { width: 30 }]}>
                                        <IconM name={'download'} size={25} color={'#fff'} />
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <View style={[{ width: 30 }]}>
                                </View>
                            )}
                        <View style={[{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                        },
                        { paddingLeft: 40, justifyContent: 'center' }]}>
                            <TouchableOpacity onPress={() => this.toggleRotation(false)} >
                                <View style={[styles.buttonOpenDrawerBorder, { width: 30 }]}>
                                    <IconM name={'rotate-left'} size={25} color={'#fff'} />
                                </View>
                            </TouchableOpacity>

                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
                                {title}
                            </Text>

                            <TouchableOpacity onPress={() => this.toggleRotation(true)} >
                                <View style={[styles.buttonOpenDrawerBorder, { width: 30 }]}>
                                    <IconM name={'rotate-right'} size={25} color={'#fff'} />
                                </View>
                            </TouchableOpacity>
                            <View style={[styles.flexRow, { position: 'absolute', paddingStart: width * .5 }]}>
                            </View>

                        </View>

                        <TouchableOpacity onPress={toggleModal}>
                            <View style={[styles.buttonOpenDrawer, { width: 30 }]}>
                                <IconM name={'close'} size={25} color={'#fff'} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Confirm
                        width={width}
                        isVisible={isVisibleConfirm}
                        content={'Đồng chí có muốn tải tài liệu này?'}
                        onCancel={() => this.setState({ isVisibleConfirm: false })}
                        onOk={() => this.setState({ isVisibleConfirm: false }, () => this.downloadFile(url, name))}
                    />
                    <View
                        style={{ flex: 1 }}>
                        {!errMp3 && (
                            <View style={styles.containerPlaySound}>
                                <View style={styles.flexRow}>
                                    <View style={[styles.flexRow, styles.buttonPlay]}>
                                        {mp3Path ? (
                                            <TouchableOpacity
                                                onPress={() => playState === 'playing' ? this.pause() : this.play(mp3Path)}
                                                style={{ paddingTop: Platform.select({ ios: 2 }) }}
                                                disabled={errMp3}
                                            >
                                                <IconM
                                                    name={this.state.playState === 'playing' ? 'pause' : 'play'}
                                                    size={30}
                                                    color={'#0d8cfb'}
                                                />
                                            </TouchableOpacity>
                                        ) : (
                                            <ActivityIndicator size={'small'} color={'#0d8cfb'} />
                                        )}
                                    </View>

                                    <Slider
                                        onSlidingStart={this.onSliderEditStart}
                                        onSlidingComplete={this.onSliderEditEnd}
                                        onValueChange={this.onSliderEditing}
                                        value={this.state.playSeconds}
                                        maximumValue={this.state.duration}
                                        maximumTrackTintColor={'#c0c2c2'}
                                        minimumTrackTintColor={'#0d8cfb'}
                                        thumbTintColor={'#0d8cfb'}
                                        style={{
                                            flex: 1,
                                            marginLeft: 10,
                                            marginRight: 20,
                                        }}
                                        thumbTouchSize={{ width: 30, height: 30 }}
                                        trackStyle={{ height: 2 }}
                                        thumbStyle={{ width: 20, height: 20 }}
                                    />
                                </View>

                                <View style={{ bottom: 2, paddingLeft: 60, paddingRight: 10, flexDirection: 'row', position: 'absolute' }}>
                                    <Text>{`${currentTimeString} / ${durationString}`}</Text>
                                </View>
                            </View>
                        )}

                        {errPdf === 'NO ERROR' ? (
                            <View style={{ width: width, height: 0.9 * height }}>
                                {progressDownload > 0 && progressDownload < 1 && (
                                    <View style={{ width: width / 2, marginLeft: width / 4, marginTop: height * .8 / 2 }} >
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontSize: 13, fontWeight: 'bold', color: 'black' }}>Đang tải </Text>
                                            {progressDownload > 0 && (<Text style={{ fontSize: 13, fontWeight: 'bold', color: 'black' }}>{Math.round(progressDownload * 100)}%</Text>)}
                                        </View>
                                        <ProgressBar
                                            width={width / 2}
                                            height={8}
                                            progress={progressDownload} />
                                    </View>
                                )
                                }
                                {
                                    /*La file pdf thi doc */
                                    sourcePdf !== '' && (
                                        <View
                                            style={
                                                {
                                                    height: (numberRotation === 270 || numberRotation === 90) ? width : height * .9,
                                                    width: (numberRotation === 270 || numberRotation === 90) ? height * .9 : width,
                                                    transform: [{ rotate: `${numberRotation}deg` },
                                                    { translateX: numberRotation == 270 ? -(.9 * height - width) / 2 : numberRotation == 90 ? (.9 * height - width) / 2 : 0 },
                                                    { translateY: numberRotation == 270 ? -(.9 * height - width) / 2 : numberRotation == 90 ? (.9 * height - width) / 2 : 0 }
                                                    ]
                                                }}
                                        >
                                            <Pdf
                                                // source={source}
                                                onLoadProgress={(percent) => {
                                                    this.setState({ progressDownload: percent })
                                                    console.log("percent", percent)
                                                }}
                                                onLoadComplete={(numberOfPages, filePath) => {
                                                    this.setState({ progressDownload: 1, isLoadSuccess: true })
                                                }}
                                                activityIndicator={null}
                                                activityIndicatorProps={{ color: 'transparent', progressTintColor: 'transparent' }}
                                                source={sourcePdf}
                                                style={{ flex: 1 }}
                                                scale={width < height ? 1.0 : 2.0}
                                                minScale={0.7}
                                                maxScale={8.0}
                                                spacing={1}
                                                onPageChanged={(page, numberOfPages) => {
                                                    this.setState({ currentPage: page, totalPage: numberOfPages });
                                                    console.log(`current page: ${page}`);
                                                }}
                                                enableRTL={true}
                                                ref={(pdf) => { this.pdf = pdf; }}
                                                enableAntialiasing={true}
                                                enableAnnotationRendering={true}
                                                onError={(error) => {
                                                    console.log(error);
                                                    this.setState({ errPdf: Message.MSG0020 })
                                                }}
                                                onPageSingleTap={(page) => {
                                                    console.log(`tapped at ${page}`);
                                                }}
                                            />
                                        </View>

                                    )
                                }
                                {totalPage > 0 && (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: "center",
                                            position: "absolute",
                                            // (width < height) ? (errMp3 ? (keyboardOpen ? height * (0.9 - 0.2 - 0.35) : height * (0.9 - 0.2)) : (keyboardOpen ? height * (0.9 - 0.15 - 0.35) : height * (0.9 - 0.15))) :
                                            // (errMp3 ? (keyboardOpen ? height * (0.9 - 0.2 - 0.35) : height * (0.9 - 0.2)) : (keyboardOpen ? height * (0.9 - 0.2 - 0.35) : height * (0.9 - 0.2))),
                                            bottom: this.calculatePaddingForViewPage(width, height, errMp3, keyboardOpen),
                                            alignSelf: "center",
                                            justifyContent: 'center'
                                        }}>
                                        <KeyboardListener
                                            onDidShow={() => { this.setState({ keyboardOpen: true }); console.log("keyboardOpen") }}
                                            onDidHide={() => { this.setState({ keyboardOpen: false }); console.log("keyboardClose") }}
                                        />
                                        <TouchableOpacity
                                            style={{ position: 'relative', left: 18 }}
                                            disabled={currentPage > 1 ? false : true}
                                            onPress={() => this.decreasePage()} >
                                            <View style={[{ width: 60 }]}>
                                                {
                                                    currentPage > 1 && (
                                                        <IconM name={'chevron-left'} size={40} color={'rgb(156,156,156)'} />
                                                    )
                                                }
                                            </View>
                                        </TouchableOpacity>
                                        <View style={[styles.viewPageDrawerBorder]}>
                                            <TextInput
                                                style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 14, backgroundColor: "rgba(126, 191, 231, 0.6)", height: 40, width: 35 }}
                                                keyboardType="numeric"
                                                defaultValue={currentPage + ""}
                                                onChangeText={(currentPage) => this.setState({ currentPage })}
                                                onSubmitEditing={(currentPage) => this.onCheckLimit(currentPage)}
                                                maxLength={3}
                                                returnKeyType={'done'}
                                            />
                                            <Text style={{ color: 'rgb(156,156,156)', fontWeight: 'bold', textAlign: 'center', fontSize: 14, }}>
                                                {` / ${totalPage}`}
                                            </Text>
                                        </View>

                                        <TouchableOpacity
                                            disabled={currentPage < totalPage ? false : true}
                                            onPress={() => this.increasePage()} >
                                            <View style={[{ width: 60 }]}>
                                                {currentPage < totalPage && (
                                                    <IconM name={'chevron-right'} size={40} color={'rgb(156,156,156)'} />
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                                }
                            </View>
                        ) : (
                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                                {
                                    errPdf == 'Not pdf' ? (
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{ fontSize: 17, paddingTop: 20 }}>{`Đọc tài liệu trên ứng dụng khác`}</Text>
                                        </View>
                                    ) : (
                                        errPdf != '' && (
                                            <View style={{ alignItems: 'center' }}>
                                                <Image
                                                    source={srcImg}
                                                    style={{ width: 120, height: 150 }}
                                                />
                                                <Text style={{ fontSize: 17, paddingTop: 20, color: '#333333' }}>{`${errPdf} !!!`}</Text>
                                            </View>
                                        ))
                                }
                            </View>
                        )}
                    </View>
                </View>
            </Modal >
        );
    };
};

const mapStateToProps = state => {
    return {
        error: state.ErrorReducer.error,
        sessionId: state.AuthenReducer.sessionId,
    };
};

export default connect(mapStateToProps, {})(ShowFiles);
