import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    subContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textHeader: {
        textTransform: 'uppercase',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ce1126',
        marginTop: 10,
    },
    textBody: {
        textTransform: 'uppercase',
        textAlign: 'center',
        fontSize: 25,
        fontWeight: 'bold',
        color: '#2c64b8',
    },
    containerInput: {
        marginBottom: 20,
        padding: 1,
    },
    subContainerInput: {
        borderBottomWidth: 1,
        borderColor: '#666666',
    },
    labelInput: {
        textAlign: 'left',
        fontSize: 14,
        color: '#666666',
    },
    containerButton: {
        backgroundColor: '#2c64b8',
        borderRadius: 6,
        alignSelf: 'center',
        marginBottom: 50,
        marginTop: 25,
    },
    textButton: {
        paddingVertical: 15,
        textTransform: 'uppercase',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
        color: '#fff',
    },
});
