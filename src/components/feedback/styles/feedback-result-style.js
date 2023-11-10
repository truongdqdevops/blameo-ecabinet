import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#fff'
    },
    subContainer: {
        flex: 1,
    },
    boderBottom: {
        backgroundColor: '#446697'
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    drawerContainer: {
        backgroundColor: '#fff',
        flex: 1,
        borderRightColor: '#999',
        borderRightWidth: 1
    },
    drawerTitle: {
        textAlign: 'center',
        paddingVertical: 11,
        fontSize: 15,
        fontWeight: 'bold',
    },
    containerItem: {
        minHeight: 80,
        paddingHorizontal: 10,
        paddingVertical: 3,
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    headerTable: {
        backgroundColor: 'white',
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1
    },
    headerTableText: {
        textAlign: 'center',
        paddingVertical: 3,
        color: 'black',
        fontWeight: 'bold'
    },
    contentTable: {
        backgroundColor: '#fff',
        minHeight: 50,
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1
    },
    contentTableText: {
        textAlign: 'center'
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
    normalTxt: {
        color: 'black',
        fontSize: 15
    }
});
