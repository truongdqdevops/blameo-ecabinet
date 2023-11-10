import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    boderBottom: {
        backgroundColor: '#446697',
        borderBottomWidth: 1,
        borderColor: '#cccccc',
    },
    circleButton: {
        alignItems: 'center',
        borderRadius: 50,
        height: 40,
        justifyContent: 'center',
        width: 40
    },
    container: {
        backgroundColor: '#fafafa',
        flex: 1,
        position: 'relative'
    },
    rows: {
        flexDirection: 'row',
        marginBottom: 10,
        flexWrap: 'wrap'
    },
    titles: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
        marginRight: 5
    },
    labelRed: {
        fontSize: 15,
        color: 'red',
        fontWeight: 'bold'
    },
    links: {
        color: '#6096D9',
        fontSize: 15,
        fontWeight: 'bold'
    },
    containerItem: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        minHeight: 80,
        paddingHorizontal: 10,
        paddingVertical: 3
    },
    detailBodyContent: {
        flexDirection: 'column',
        justifyContent: 'center',
        left: -1,
        paddingVertical: 20,
        right: -1
    },

    drawerContainer: {
        backgroundColor: '#fff',
        borderRightColor: '#999',
        borderRightWidth: 1,
        flex: 1
    },

    flexRow: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    headerBodyContent: {
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'center',
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1
    },
    drawerTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        paddingVertical: 11,
        textAlign: 'center',
        height: 40
    },
    normalTxt: {
        color: 'black',
        fontSize: 15
    },
    searchField: {
        // width: width * 0.6,
        // color: 'black',
        // fontWeight: '500',
        // fontSize: 15,
        // textAlign: 'left',
        // backgroundColor: 'white'
        height: 25,
        padding: 0,
        width: '90%'
    },
    searchContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderColor: '#d8d8d8',
        borderWidth: 1,
    },
    headerJoinText: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15
    },
    buttonJoinContainer: {
        justifyContent: 'space-evenly',
        marginTop: 30,
        marginBottom: 15
    },
    //ResolutionModal
    containerModal: {
        borderRadius: 8,
        height: '65%'
    },
    headerModal: {
        backgroundColor: '#326FC2',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    headerModalTitleView: {
        alignItems: 'center',
        textAlign: "center"

    },
    headerModalTitleText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },

    headerTable: {
        backgroundColor: '#EFEFF4',
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        height: 40
    },
    headerTableText: {
        color: 'black',
        fontWeight: 'bold',
        paddingVertical: 3,
        textAlign: 'center'
    },
    contentTable: {
        backgroundColor: '#fff',
        minHeight: 50,
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1
    },
    txtAlignCenter: {
        textAlign: "center"
    },
    txtAlignLeft: {
        textAlign: "left"
    },
    text: {
        color: 'black',
        fontSize: 15
    }
});
