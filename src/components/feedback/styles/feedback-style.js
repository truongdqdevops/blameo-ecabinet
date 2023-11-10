import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    boderBottom: {
        backgroundColor: '#446697',
        borderBottomWidth: 1,
        borderColor: '#cccccc',
    },

    circleButton: {
        alignItems: 'center',
        borderRadius: 40,
        height: 40,
        justifyContent: 'center',
        width: 40
    },
    container: {
        backgroundColor: 'white',
        flex: 1,
        position: 'relative'
    },
    containerItem: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        minHeight: 80,
        paddingHorizontal: 10,
        paddingVertical: 3
    },
    contentTable: {
        backgroundColor: '#fff',
        minHeight: 50,
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
    },
    contentTableText: {
        fontSize: 13,
        paddingHorizontal: 3
    },
    detailBodyContent: {
        flexDirection: 'column',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
    },

    labelFeedback: {
        flexDirection: 'row',
        marginBottom: 10,
        flexWrap: 'wrap'
    },

    drawerContainer: {
        backgroundColor: '#fff',
        borderRightColor: '#999',
        borderRightWidth: 1,
        flex: 1
    },
    drawerTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        paddingVertical: 11,
        textAlign: 'center',
        height: 40
    },

    flexRow: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    headerTable: {
        backgroundColor: '#DFEEFE',
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1
    },
    headerTableText: {
        color: 'black',
        fontWeight: 'bold',
        paddingVertical: 3,
        textAlign: 'center'
    },
    normalTxt: {
        color: 'black',
        fontSize: 14
    },
    boldTxt: {
        color: 'black',
        fontSize: 14,
        fontWeight: 'bold',
    },
    highlightBlueTxt: {
        color: '#3127F1',
        fontSize: 14,
        fontWeight: 'bold'
    },
    searchField: {
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
    button: {
        alignItems: 'center',
        backgroundColor: '#326EC4',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
        width: width * 0.3,
        height: width * 0.075
    },
    buttonOutline: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: '#326EC4',
        borderWidth: 1,
        marginTop: 30,
        width: width * 0.3,
        height: width * 0.075
    },

    headerJoinText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15
    },
});
