
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    boderBottom: {
        borderBottomWidth: 1,
        borderColor: '#cccccc',
    },
    containerItem: {
        minWidth: 50,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputDateContainer: {
        margin: 10,
        marginTop: 15,
    },
    inputDate: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    buttonCheckAll: {
        backgroundColor: '#1cb479',
        height: 30,
        width:30,
        borderRadius:5
    },
    buttonSearch: {
        backgroundColor: '#316ec4',
        height: 25,
        justifyContent: 'center',
    },
    timeSearch: {
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1
    },
    headerJoinText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15
    },
    buttonJoinContainer: {
        justifyContent: 'space-evenly',
        marginTop: 20,
        marginBottom: 15
    },
});
