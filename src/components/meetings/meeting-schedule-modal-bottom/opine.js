import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-material-dropdown';
import { OPINION_STATUS } from '../const';
import styles from '../style';
import { Message } from '../../../assets/utils/message';
import { TITLE_MEETING } from '../../../assets/utils/title';

class ModalOpine extends Component {
    constructor(props) {
        super(props);

        const { width, height } = this.props;

        this.state = {
            validate: {},
            fileId: this.props.fileId || '',
            categoryId: '',
            height20: height * 0.2,
            width20: width * 0.2,
            width38: width * 0.38,
            width50: width * 0.5,
            width70: width * 0.7,
            width80: width * 0.8,
        };
    };

    convertListData = (listData = [], isListContent) => {
        const listContents = [{ label: 'Vui lòng chọn', value: '' }];
        if (isListContent) {
            listData.forEach(element => {
                const { title = '', fileId } = element;
                const newElement = { label: title, value: fileId };
                listContents.push(newElement);
            });
            return listContents;
        }
        listData.forEach(element => {
            const { name = '', categoryId, status } = element;
            if (status) {
                const newElement = { label: name, value: categoryId };
                listContents.push(newElement);
            }
        });
        return listContents;
    };

    submitOpine = async () => {
        const { fileId = '', content = '', categoryId = '' } = this.state;
        const { isMeetingDetail } = this.props;
        if (!isMeetingDetail) {
            // if (fileId === '' || categoryId === '' || content.trim() === '') {
            //     this.setState({
            //         validate: {
            //             opinion: Message.MSG0004
            //         }
            //     });
            //     return;
            // }
            if (fileId === '' || content.trim() === '') {
                this.setState({
                    validate: {
                        opinion: Message.MSG0004
                    }
                });
                return;
            }
        }
        if (this.props.isMeetingDetail) {
            if (content.trim() === '') {
                this.setState({
                    validate: {
                        opinion: Message.MSG0012
                    }
                });
                return;
            }
        }

        this.setState({
            validate: {}
        });
        this.props.toggleModal();
        setTimeout(async () => {
            const ConferenceOpinionEntity = {
                content: content.trim(),
                conferenceId: this.props.selectedMeeting.conferenceId,
                status: OPINION_STATUS.OPINE,
                conferenceFileId: fileId || this.props.fileId,
                fieldCategoyId: categoryId != ''? categoryId: null
            };

            const res = await this.props.addOpinionResources({ ConferenceOpinionEntity });
            const notify = res === 'true' ? Message.MSG0014 : Message.MSG0003;
            this.setState({ content: '' });
            await this.props.syncMeeting(notify, isMeetingDetail ? 'opine' : false);
        }, 450);
    };

    onClose = () => {
        this.setState({
            validate: {},
            fileId: this.props.fileId || '',
            categoryId: '',
        }, () => this.props.toggleModal());
    }

    render() {
        const {
            validate: { content = '', opinion = '' },
            height20,
            width20,
            width38,
            width50,
            width70,
            width80,
        } = this.state;
        const { isVisible = false, isMeetingDetail, listContent = [], listCategory = [] } = this.props;

        const dropdownObj = {
            containerStyle: { width: width50, height: 27, paddingLeft: 10 },
            dropdownOffset: { top: 0, left: 0 },
            inputContainerStyle: { borderBottomColor: 'transparent' },
        };

        return (
            <Modal
                animationInTiming={400}
                animationOutTiming={500}
                backdropTransitionInTiming={500}
                backdropTransitionOutTiming={500}
                isVisible={isVisible}
                onPress={this.onClose}
                backdropColor={'rgb(156,156,156)'}
                hideModalContentWhileAnimating
            >
                <KeyboardAvoidingView
                    behavior={'position'}
                >
                    <View style={{ backgroundColor: '#ebeff5' }}>
                        <View style={{ backgroundColor: '#316ec4', paddingVertical: 8 }}>
                            <Text style={styles.headerJoinText}>
                                {'Tham gia ý kiến'}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                            {!isMeetingDetail && (
                                <View style={[styles.flexRowAlignCenter, { marginBottom: 10 }]}>
                                    <Text style={{ width: width20 }}>
                                        {TITLE_MEETING.CONTENT}
                                        <Text style={{ color: 'red' }}>{'* '}</Text>
                                        {': '}
                                    </Text>

                                    <View style={[styles.flexRowAlignCenter, { justifyContent: 'space-between', backgroundColor: '#fff', marginLeft: 10 }]}>
                                        <Dropdown
                                            data={this.convertListData(listContent, true)}
                                            containerStyle={dropdownObj.containerStyle}
                                            dropdownPosition={0}
                                            dropdownOffset={dropdownObj.dropdownOffset}
                                            inputContainerStyle={dropdownObj.inputContainerStyle}
                                            selectedItemColor={'rgba(0, 0, 0, .38)'}
                                            itemColor={'rgba(0, 0, 0, .87)'}
                                            textColor={this.state.fileId === '' ? 'rgba(0, 0, 0, .38)' : 'rgba(0, 0, 0, .87)'}
                                            value={''}
                                            fontSize={15}
                                            onChangeText={(value) => this.setState({ fileId: value, validate: value ? '' : Message.MSG0022 })}
                                        />
                                    </View>
                                </View>
                            )}

                            <View style={[styles.flexRowAlignCenter, { marginBottom: 10 }]}>
                                <Text style={{ width: width20 }}>
                                    {TITLE_MEETING.CATEGORY}
                                    {/* <Text style={{ color: 'red' }}>{'* '}</Text> */}
                                    {': '}
                                </Text>

                                <View style={[styles.flexRowAlignCenter, { justifyContent: 'space-between', backgroundColor: '#fff', marginLeft: 10 }]}>
                                    <Dropdown
                                        data={this.convertListData(listCategory)}
                                        containerStyle={dropdownObj.containerStyle}
                                        dropdownPosition={0}
                                        dropdownOffset={dropdownObj.dropdownOffset}
                                        inputContainerStyle={dropdownObj.inputContainerStyle}
                                        selectedItemColor={'rgba(0, 0, 0, .38)'}
                                        itemColor={'rgba(0, 0, 0, .87)'}
                                        textColor={this.state.categoryId === '' ? 'rgba(0, 0, 0, .38)' : 'rgba(0, 0, 0, .87)'}
                                        value={''}
                                        fontSize={15}
                                        // onChangeText={(value) => this.setState({ categoryId: value, validate: value ? '' : Message.MSG0023 })}
                                        onChangeText={(value) => this.setState({ categoryId: value, validate: value })}
                                    />
                                </View>
                            </View>

                            <View style={{ width: width70 }}>
                                {content !== '' && (
                                    <Text style={{ textAlign: 'center', color: 'red', paddingBottom: 5 }}>
                                        {`*${content}`}
                                    </Text>
                                )}
                            </View>

                            <View style={{ justifyContent: 'flex-start', marginBottom: 10 }}>
                                <TextInput
                                    style={[styles.inputReason, { width: width80 + 10, height: height20, padding: 7, textAlignVertical: 'top' }]}
                                    placeholder={'Nhập ý kiến'}
                                    multiline
                                    onChangeText={contentText => {
                                        this.setState({
                                            content: contentText,
                                            validate: {
                                                ...this.state.validate,
                                                opinion: contentText === '' ? Message.MSG0012 : ''
                                            }
                                        });
                                    }}
                                />
                            </View>

                            <View style={{ width: width70 }}>
                                {opinion !== '' && (
                                    <Text style={{ textAlign: 'center', color: 'red' }}>
                                        {`*${opinion}`}
                                    </Text>
                                )}
                            </View>
                        </View>

                        <View style={[styles.flexRowAlignCenter, styles.buttonJoinContainer, { marginTop: 10 }]}>
                            <TouchableOpacity
                                style={{ backgroundColor: '#316ec4', borderRadius: 4, width: width38 }}
                                onPress={this.onClose}
                            >
                                <Text style={{ color: '#fff', paddingVertical: 8, textAlign: 'center' }}>{'Huỷ bỏ'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ backgroundColor: '#316ec4', borderRadius: 4, width: width38 }}
                                onPress={this.submitOpine}
                            >
                                <Text style={{ color: '#fff', paddingVertical: 8, textAlign: 'center' }}>{'Đồng ý'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        );
    };
};

const mapStateToProps = state => {
    return {
        error: state.ErrorReducer.error,
        selectedMeeting: state.MeetingReducer.selectedMeeting,
        userInfo: state.AuthenReducer.userInfo,
    };
};

export default connect(
    mapStateToProps, {}
)(ModalOpine);
