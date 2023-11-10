import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    partContainer: {
        alignSelf: 'stretch',
        marginHorizontal: 10,
        marginTop: 10,
        borderColor: '#666666',
        borderRadius: 5,
        borderWidth: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
    },
    headerPartText: {
        alignSelf: 'flex-start',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#444'
    },
    pieChart: {
        height: 200,
        width: 200,
        marginTop: 10,
        alignSelf: 'center',
    },
    itemDetailVote: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        marginLeft:20,
        marginRight:50
    },
    colorItem: {
        width: 15,
        height: 15,
        marginRight: 10,
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonOpenDrawer: {
        marginHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonOKContainer: {
        justifyContent: 'space-evenly',
        marginTop: 25,
        marginBottom: 15
    },
    headerTable: {
        backgroundColor: '#d6e2f3',
    },
    headerTableText: {
        textAlign: 'center',
        paddingVertical: 3,
        fontWeight: 'bold',
        fontSize: 14
    },
    tableResultVote: {
        borderRadius: 8,
        backgroundColor: '#fff',
        borderColor: "#D3D3D3",
        borderWidth: 1,
        padding: 5,
        margin: 15
    },
    textVoted: {
        textAlign: 'right',
        fontSize: 13,
        paddingEnd: 20,
        fontStyle: 'italic'
    },
    contentTableText: {
        padding: 5,
        fontSize: 13,
    },
    headerCollapse: {
        backgroundColor: '#e5e5e5',
        paddingVertical: 7,
        paddingHorizontal: 15,
    },
    headerCollapseText: {
        paddingLeft: 5,
        fontSize: 15,
        fontWeight: 'bold',
        textAlignVertical: 'center'
    },
    inputOtherAnswer: {
        backgroundColor: '#fff',
        marginTop: 7,
        flexWrap: 'wrap'
    },
    headerVote: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 14,
        textTransform: 'uppercase'
    },
    loadingContainer: {
        position: 'absolute',
        alignSelf: 'center',
        height: '90%',
        marginTop: '10%',
        justifyContent: 'center',
    },
});
