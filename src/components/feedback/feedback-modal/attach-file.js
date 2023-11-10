import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { Table, Row } from 'react-native-table-component';
import MHeader from '../../../assets/components/header';
import ShowFiles from '../../document/show-files';

class ModalAttachFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: [],
        };
    }

    componentDidMount() {
        this.renderHeaderTable();
    }

    renderHeaderTable() {
        const itemData = [
            <Text style={styles.headerTableText}>STT</Text>,
            <Text style={[styles.headerTableText, { textAlign: 'left', paddingLeft: 10 }]}>Tài liệu</Text>,
            <Text style={[styles.headerTableText, { textAlign: 'left', paddingLeft: 10 }]}>Mô tả tài liệu</Text>,
        ];
        this.setState({
            tableHead: itemData
        });
    }

    render() {
        const { width, isVisible = false, toggleModal, height, headName, isVisibleShowFiles, attachFileId, toggleShowFiles } = this.props;
        const {
            tableHead = [],
        } = this.state;
        return (
            <Modal
                isVisible={isVisible}
                onBackdropPress={toggleModal}
                backdropColor={'rgb(156,156,156)'}
                animationInTiming={400}
                animationOutTiming={500}
                backdropTransitionInTiming={500}
                backdropTransitionOutTiming={500}
                hideModalContentWhileAnimating
            >
                <View style={{ backgroundColor: '#EBEFF5', height: height * 0.65 }}>
                    <MHeader
                        haveClose
                        haveEmail={false}
                        onClose={toggleModal}
                        title={headName}
                        navigation={this.props.navigation}
                        width={width}
                    />

                    <Table>
                        <Row
                            flexArr={[1, 5, 4]}
                            data={tableHead}
                            style={styles.headerTable}
                            textStyle={styles.headerTableText}
                        />
                    </Table>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <TouchableWithoutFeedback>
                            <Table>
                                {this.props.tableData}
                            </Table>
                        </TouchableWithoutFeedback>
                    </ScrollView>

                    {isVisibleShowFiles && (
                        <ShowFiles
                            isVisible
                            title={'Nội dung tài liệu'}
                            fileId={attachFileId || 0}
                            toggleModal={toggleShowFiles}
                        />
                    )}
                </View>
            </Modal>
        );
    };
};

const styles = StyleSheet.create({
    headerTable: {
        backgroundColor: '#EFEFF4',
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        height: 40,
    },
    headerTableText: {
        color: 'black',
        fontWeight: 'bold',
        paddingVertical: 3,
        textAlign: 'center'
    },

});

export default ModalAttachFile;
