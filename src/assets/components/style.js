import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    containerHeader: {
        backgroundColor: '#316ec4',
        flexDirection: 'row',
        alignItems: 'center'
    },
    containerMenuIcon: {
        marginHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        width: 30,
    },
    textTitle: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerJoinText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15
    },
    buttonJoinContainer: {
        justifyContent: 'space-evenly',
        marginTop: 30,
        marginBottom: 15
    },
    containerBadge: {
        backgroundColor: 'red',
        position: 'absolute',
        borderRadius: 4,
        left: 14
    },
    textBadge: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        textAlignVertical: 'center',
        paddingHorizontal: 1.5,
        textAlign: 'center'
    },
});
