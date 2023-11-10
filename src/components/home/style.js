
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#fafafa'
    },
    subContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
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
        padding: 10
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
        alignSelf: 'center'
    },
    itemDetailVote: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    colorItem: {
        width: 15,
        height: 15,
        marginRight: 10
    },
    contentAggregateContainer: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'flex-start',
        flexWrap: 'wrap'
    },
    aggregateItem: {
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#666666',
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 7,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    },
    meetingItem: {
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#666666',
        borderRadius: 5,
        padding: 7,
        marginTop: 10,
        width: '100%'
    },
    meetingItemStatus: {
        textAlign: 'center',
        paddingVertical: 3,
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold'
    },
    meetingButton: {
        backgroundColor: '#316ec4',
        alignSelf: 'center',
        marginTop: 8,
        marginBottom: 2,
        paddingVertical: 5,
        borderRadius: 4
    },
    containerChat: {
        width: 50,
        height: 50,
        backgroundColor: '#316ec4',
        position: 'absolute',
        right: 15,
        bottom: 15,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
