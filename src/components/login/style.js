import {StyleSheet, Dimensions} from 'react-native';
const {width} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
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
    color: '#000000',
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
  containerButtonWhite: {
    backgroundColor: 'white',
    borderRadius: 6,
    alignSelf: 'center',
    marginBottom: 50,
    marginTop: 25,
    borderWidth: 1,
    borderColor: '#2c64b8',
  },
  dropdown_2: {
    alignSelf: 'flex-end',
    width: 150,
    marginTop: 32,
    right: 8,
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: 'cornflowerblue',
  },
  dropdown_2_text: {
    marginVertical: 10,
    marginHorizontal: 6,
    fontSize: 18,
    color: '#2c64b8',
  },
  dropdown_2_dropdown: {
    width: width * 0.8,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 3,
    marginLeft: width * 0.1,
  },
  dropdown_2_row: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  dropdown_2_image: {
    marginLeft: 4,
    width: 30,
    height: 30,
  },
  dropdown_2_row_text: {
    marginHorizontal: 4,
    fontSize: 16,
    color: 'navy',
    textAlignVertical: 'center',
  },
  dropdown_2_separator: {
    height: 1,
    backgroundColor: 'cornflowerblue',
  },
  containerButtonDisable: {
    backgroundColor: '#94aed4',
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
  textButtonBlue: {
    paddingVertical: 15,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#2c64b8',
  },
  textVersion: {
    textAlign: 'center',
    fontSize: 13,
    color: '#808080',
    fontStyle: 'italic',
    height: 50,
  },

  underlineStyleBase: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    color: '#316ec4',
    fontSize: 18,
  },

  underlineStyleHighLighted: {
    borderColor: '#316ec4',
  },
});
