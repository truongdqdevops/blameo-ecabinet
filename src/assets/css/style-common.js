import { StyleSheet } from 'react-native';

const stylesCommon = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    column: {
        flexDirection: 'column',
    },
    left: {
        justifyContent: 'flex-start',
    },
    cen: {
        justifyContent: 'center',
    },
    right: {
        justifyContent: 'flex-end',
    },
    spaceBetween: {
        justifyContent: 'space-between',
    },
    spaceAround: {
        justifyContent: 'space-around',
    },
    alignCen: {
        alignItems: 'center'
    },
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    fullScreen: {
        backgroundColor: '#F5F5F5',
        flex: 1,
        flexDirection: 'column',
    },
    backgroundWhite: {
        backgroundColor: 'white',
    },
    backgroundGray: {
        backgroundColor: 'gray',
    },
    backgroundBlue: {
        backgroundColor: 'blue',
    },
    backgroundCustomBlue: {
        backgroundColor: 'rgb(60,128,205)'
    },
    
    mt5: {
        marginTop: 5
    },
    mt10: {
        marginTop: 10
    },
    mt15: {
        marginTop: 15
    },
    mt30: {
        marginTop: 30
    },

    ml5: {
        marginLeft: 5
    },
    ml10: {
        marginLeft: 10
    },
    ml15: {
        marginLeft: 15
    },
    ml20: {
        marginLeft: 20
    },
    ml30: {
        marginLeft: 30
    },

    mr5: {
        marginRight: 5
    },
    mr10: {
        marginRight: 10
    },
    mr15: {
        marginRight: 15
    },
    mr30: {
        marginRight: 30
    },

    mb5: {
        marginBottom: 5
    },
    mb10: {
        marginBottom: 10
    },
    mb15: {
        marginBottom: 15
    },
    mb20: {
        marginBottom: 15
    },
    w100: {
        flex: 1
    },
    w50: {
        flex: 0.5
    },
    w60: {
        flex: 0.6
    },
    fontSize20: {
        fontSize: 20
    },
    fontSize12: {
        fontSize: 12
    },
    bold: {
        fontWeight: 'bold',
    },
    title: {
        // color: 'black',
        lineHeight: 20,
    },
    titleBorder: {
        marginTop: 30,
        marginBottom: 15,
        color: 'black',
        lineHeight: 20,
        fontWeight: 'bold',
        borderBottomColor: 'black',
        borderBottomWidth: 1
    },
    lblBlue: {
        color: 'blue'
    },
    lblBack: {
        color: 'black'
    },
    lblCustomBlue: {
        color: 'rgb(60,128,205)'
    },
    border: {
        borderColor: 'silver',
        borderWidth: 1,
    },
    txtMutipleLine: {
        textAlignVertical: 'top',
        borderColor: 'silver',
        borderWidth: 1,
    },
    circleButton: {
        alignItems: 'center',
        borderRadius: 50,
        height: 40,
        justifyContent: 'center',
        width: 40
    },
})

export default stylesCommon
