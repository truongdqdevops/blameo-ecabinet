import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    subContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemContainer: {
        backgroundColor: '#fff',
        borderColor: '#d8d8d8',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10,
        minHeight: 50
    },
    searchContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderColor: '#d8d8d8',
        borderWidth: 1,
        borderRadius: 5,
    },
    itemFile: {
        marginTop: 10,
    },
    buttonViewDocument: {
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderRadius: 4,
        borderColor: '#7cabd8',
        width: 110,
        paddingVertical: 2,
        marginTop: 5
    },
    buttonOpenDrawer: {
        marginHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
    },
    buttonOpenDrawerBorder: {
        marginHorizontal: 5,
        paddingVertical:3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#94aed4',
    },
    viewPageDrawerBorder: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 3,
        borderColor: 'rgb(156,156,156)',
    },
    searchField: {
        height: 25,
        padding: 0,
        width: '90%'
    },
    containerPlaySound: {
        margin: 7,
        backgroundColor: '#fff',
        borderColor: '#d8d8d8',
        borderWidth: 1,
        paddingTop: 5,
        paddingBottom: 12,
        minHeight: 55
    },
    buttonPlay: {
        width: width * 0.1,
        justifyContent: 'center',
        marginLeft: 5,
    },
    boderBottom: {
        borderBottomWidth: 1,
        borderColor: '#cccccc',
    },
    TitleTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 7,
        paddingHorizontal: 10
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'stretch',
        height: 50
    },
    topButtons: {
        paddingVertical: 6,
        borderColor: '#cccccc',
        borderWidth: 1,
    },
    buttonLeft: {
        borderTopStartRadius: 5,
        borderBottomStartRadius: 5,
        borderRightWidth: 0,
    },
    buttonRight: {
        borderTopEndRadius: 5,
        borderBottomEndRadius: 5,
        borderLeftWidth: 0
    },
    buttonJoinContainer: {
        justifyContent: 'space-evenly',
        marginTop: 30,
        marginBottom: 15,
        position: 'absolute',
        bottom: 0,
        width: '100%'
    },
    headerJoinText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15
    },
});
