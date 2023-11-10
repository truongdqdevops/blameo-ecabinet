import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    containerButton: {
        backgroundColor: '#fff',
        borderRadius: 6,
        alignSelf: 'center',
        marginBottom: 30,
        marginTop: 15,
        borderWidth: 1,
        borderColor: '#2c64b8',
    },
    textButton: {
        paddingVertical: 10,
        textTransform: 'uppercase',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
        color: '#2c64b8',
    },
});
