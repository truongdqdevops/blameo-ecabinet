/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import { Table, Row } from 'react-native-table-component';
// import PDFView from 'react-native-view-pdf';
import stylesCommon from '../../assets/css/style-common';
import styles from './style';

class ModalAttachFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: [],
            tableData: [],
            isDisplayFile: false,
            itemSelect: null,
        };
    }

    componentWillMount() {
        this.renderHeaderTable();
        this.renderContentTable();
    }

    renderHeaderTable() {
        const itemData = [
            <Text style={[styles.headerTableText, styles.txtAlignCenter]}>STT</Text>,
            <Text style={[styles.headerTableText, styles.txtAlignLeft]}>Tên tài liệu</Text>,
            <Text style={[styles.headerTableText, styles.txtAlignLeft]}>Mô tả tài liệu</Text>,
        ];
        this.setState({
            tableHead: itemData
        });
    }

    selectFileAttach(item) {
        this.setState({
            itemSelect: item,
            isDisplayFile: true
        });
    }

    renderContentTable = () => {
        const tableData = [];
        const { length } = Object.keys(this.props.tableData);
        if (length > 0) {
            this.props.tableData.forEach((element, index) => {
                const stt = index + 1;
                const { name = '', title = '' } = element;
                const itemData = [
                    <Text style={styles.txtAlignCenter}>{stt}</Text>,
                    <TouchableOpacity onPress={() => this.selectFileAttach(element)}>
                        <Text style={[styles.txtAlignLeft, { color: '#326FC2' }]}>{name}</Text>
                    </TouchableOpacity>,
                    <Text style={styles.txtAlignLeft}>{title}</Text>
                ];
                const rowData = <Row key={index.toString()} flexArr={[1, 5, 4]} data={itemData} style={styles.contentTable} />;
                tableData.push(rowData);
            });
        }
        this.setState({
            tableData
        });
    };

    render() {
        const {
            isVisible = false,
            closeModal,
        } = this.props;

        const { tableHead, tableData, isDisplayFile } = this.state;

        return (
            <Modal
                animationIn="bounceInDown"
                animationOut="bounceOutUp"
                isVisible={isVisible}
                onBackdropPress={closeModal}
                backdropColor={'rgb(156,156,156)'}
                animationInTiming={200}
                animationOutTiming={200}
                backdropTransitionInTiming={200}
                backdropTransitionOutTiming={0}
                onModalWillShow={() => { this.setState({ isDisplayFile: false }); }}
            >
                {!isDisplayFile &&
                    <View style={[{ backgroundColor: '#ebeff5' }, styles.containerModal]}>
                        <View style={[stylesCommon.row, stylesCommon.spaceBetween, styles.headerModal]}>
                            <View styles={styles.headerModalTitleView}>
                                <Text style={styles.headerModalTitleText}>
                                    {this.props.title}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={closeModal}>
                                <IconM name="close" size={20} color="#043E7C" />
                            </TouchableOpacity>
                        </View>

                        <View style={stylesCommon.mt5}>
                            <Table>
                                <Row
                                    flexArr={[1, 5, 4]}
                                    data={tableHead}
                                    style={styles.headerTable}
                                    textStyle={styles.headerTableText}
                                />
                                <ScrollView>
                                    {tableData}
                                </ScrollView>
                            </Table>
                        </View>
                    </View>
                }
                {/* {isDisplayFile && <View style={[stylesCommon.backgroundWhite, stylesCommon.w100]}>
                    <View style={[stylesCommon.row, stylesCommon.spaceBetween]}>
                        <View style={[stylesCommon.ml20, stylesCommon.mt10]} />
                        <TouchableOpacity style={stylesCommon.border} onPress={() => { this.setState({ isDisplayFile: false }) }}>
                            <IconM name="close" size={25} color="silver" />
                        </TouchableOpacity>
                    </View>
                    <PDFView
                        fadeInDuration={250.0}
                        style={stylesCommon.w100}
                        resource={this.state.itemSelect.url}
                        resourceType={this.state.itemSelect.resourceType}
                    />
                </View>
                } */}
            </Modal>
        );
    };
};

export default ModalAttachFile;
