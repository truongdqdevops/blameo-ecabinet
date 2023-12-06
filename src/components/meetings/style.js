import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");
const { widthScreen } = Dimensions.get("screen");
export default StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  feedback: {
    backgroundColor: "white",
    borderColor: "#2059EE",
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#326EC4",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    width: width * 0.3,
    height: width * 0.075,
    paddingHorizontal: 10,
  },
  buttonClose: {
    paddingHorizontal: 10,
    alignItems: "center",
  },
  buttonOutline: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    borderColor: "#326EC4",
    borderWidth: 1,
    marginVertical: 20,
    width: width * 0.3,
    height: width * 0.075,
    paddingHorizontal: 10,
  },
  boderBottom: {
    borderBottomWidth: 1,
    borderColor: "#cccccc",
  },
  flexRowAlignCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  flexRowAlignCenterSpaceBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  flexRowAlignEnd: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingEnd: 10,
  },
  flexRow: {
    flexDirection: "row",
  },
  titleConferenceList: {
    fontWeight: "bold",
    fontSize: 14,
  },
  width20: {
    width: 20,
  },
  paddingHorizontal10: {
    paddingHorizontal: 10,
  },
  marginVertical7: {
    marginVertical: 7,
  },
  stt: {
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 13,
  },
  bottomButtonsModalGuest: {
    paddingVertical: 5,
    backgroundColor: "#316ec4",
    width: width * 0.42,
  },
  textAlignCenterWhite: {
    textAlign: "center",
    color: "#fff",
  },
  labelGiayMoi: {
    color: "#316ec4",
    fontWeight: "bold",
    fontSize: 13,
    paddingLeft: 5,
    paddingVertical: 3,
  },
  containerButtonMap: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignSelf: "flex-start",
    marginTop: 5,
    marginLeft: 10,
  },
  buttonMap: {
    backgroundColor: "#316ec4",
    width: 70,
    paddingVertical: 3,
    borderRadius: 3,
  },
  buttonAuthority: {
    backgroundColor: "#1cb479",
    width: 80,
    paddingVertical: 3,
    marginStart: 10,
    borderRadius: 3,
  },
  containerModalMap: {
    backgroundColor: "#fff",
    flex: Platform.select({ ios: 0.9, android: 1 }),
  },
  containerModalInfo: {
    backgroundColor: "#ebeff5",
  },
  containerHeaderInfo: {
    backgroundColor: "#316ec4",
    paddingVertical: 8,
  },
  containerLabelLocation: {
    marginTop: 15,
    marginHorizontal: 15,
  },
  containerDetailLocation: {
    marginTop: 15,
    marginHorizontal: 15,
    maxHeight: 250,
  },
  drawerContainer: {
    backgroundColor: "#fff",
    flex: 1,
    borderRightColor: "#999",
    borderRightWidth: 1,
  },
  drawerTitle: {
    textAlign: "center",
    paddingVertical: 11,
    fontSize: 15,
    fontWeight: "bold",
    height: 40,
    textTransform: "uppercase",
  },
  drawerTitleTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  drawerButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "stretch",
    marginVertical: 8,
  },
  drawerTopButtons: {
    paddingVertical: 6,
    borderColor: "#cccccc",
    borderWidth: 1,
  },
  drawerButtonLeft: {
    borderTopStartRadius: 5,
    borderBottomStartRadius: 5,
    borderRightWidth: 0,
  },
  drawerButtonRight: {
    borderTopEndRadius: 5,
    borderBottomEndRadius: 5,
    borderLeftWidth: 0,
  },
  headerBodyContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
  },
  headerTextContent: {
    textAlign: "center",
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  bodyStatus: {
    width: width * 0.2,
    borderRadius: 3,
    paddingVertical: 2,
  },
  bodyStatusText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 12,
  },
  buttonOpenDrawer: {
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  detailBodyContent: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#cccccc",
    left: 2,
    right: -1,
  },
  containerItem: {
    minHeight: 60,
    paddingHorizontal: 10,
    paddingVertical: 3,
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  userStatus: {
    backgroundColor: "#aaaaaa",
    marginTop: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
  },
  userInfer: {
    marginTop: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTable: {
    backgroundColor: "#d6e2f3",
  },
  headerTableText: {
    textAlign: "center",
    padding: 3,
    fontWeight: "bold",
  },
  contentTable: {
    backgroundColor: "#fafafa",
    minHeight: 50,
  },
  contentTableNote: {
    backgroundColor: "#fafafa",
    minHeight: 60,
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
  },
  contentTableText: {
    padding: 3,
    fontSize: 13,
  },
  textButtonGuestType: {
    textAlign: "center",
    paddingVertical: 10,
    fontWeight: "bold",
  },
  headerTable2: {
    backgroundColor: "#e5e5e5",
    height: 45,
  },
  headerTableText2: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "bold",
  },
  contentTable2: {
    backgroundColor: "#fff",
    minHeight: 40,
  },
  contentTableText2: {
    padding: 4,
    fontSize: 12,
  },
  buttonJoinContainer: {
    justifyContent: "space-evenly",
    marginTop: 30,
    marginBottom: 15,
  },
  headerJoinText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
  },
  bottomButtons: {
    justifyContent: "center",
    marginRight: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  infoItemListConference: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3,
  },
  textSTT: {
    textAlign: "center",
    textAlignVertical: "center",
  },
  textContent: {
    color: "#316ec4",
    fontWeight: "bold",
    fontSize: 13,
  },
  padding5: {
    padding: 5,
  },
  totalConferenceContainer: {
    flexDirection: "row",
    paddingTop: 1,
  },
  textTotalConference: {
    color: "#316ec4",
    fontWeight: "bold",
  },
  loadingContainer: {
    position: "absolute",
    alignSelf: "center",
    height: "100%",
    justifyContent: "center",
  },
  noDataContainer: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
  },
  noDataImage: {
    width: 120,
    height: 150,
  },
  noDataText: {
    fontSize: 17,
    paddingTop: 20,
    color: "#333333",
  },
  textConferenceName: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
  textConferenceTime: {
    textAlign: "center",
    color: "#ef5c22",
    fontWeight: "bold",
    fontSize: 16,
  },
  textAlignCenter: { textAlign: "center" },
  textListJoins: {
    textAlign: "center",
    color: "#316ec4",
    fontWeight: "bold",
  },
  containerHeaderModalJoins: {
    backgroundColor: "#316ec4",
    paddingVertical: 8,
    justifyContent: "center",
  },
  textHeaderModalJoins: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  borderTableModalJoins: {
    borderWidth: 1,
    borderColor: "#ccc",
  },
  containerTableContent: {
    padding: 10,
    paddingLeft: 15,
  },
  textHeaderTableContent: {
    fontWeight: "bold",
    paddingTop: 5,
  },
  marginTop7: { marginTop: 7 },
  borderTableContent: {
    borderWidth: 1,
    borderColor: "#707070",
  },
  containerConferenceStatus: {
    padding: 10,
    paddingBottom: 80,
  },
  labelConferenceStatus: {
    fontWeight: "bold",
    paddingTop: 5,
  },
  textConferenceStatus: {
    textAlign: "center",
    color: "#fff",
  },
  containerBottomButtons: {
    flex: 1,
    position: "absolute",
    right: 20,
    bottom: 20,
  },
  buttonOKInfor: {
    justifyContent: "space-evenly",
    marginVertical: 15,
  },
  // MEETING-CONTENT
  programTextBorder: {
    padding: 15,
    paddingBottom: 0,
    borderWidth: 1,
    borderColor: "#cccccc",
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    borderRadius: 3,
  },
  programNoTextBorder: {
    padding: 15,
    paddingBottom: 0,
    marginLeft: 15,
  },
  detailContainer: {
    flexDirection: "column",
    justifyContent: "center",
    paddingVertical: 20,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#cccccc",
    left: -1,
    right: -1,
  },
  headerCollapse: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 7,
    paddingHorizontal: 15,
  },
  headerCollapseHasIcon: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 2,
    paddingHorizontal: 15,
  },
  headerCollapseText: {
    paddingLeft: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
  generalInfo: {
    color: "#666666",
    fontWeight: "bold",
    fontSize: 12.5,
    paddingBottom: 3,
  },
  issueStatus: {
    padding: 3,
    borderRadius: 5,
    alignSelf: "center",
  },
  buttonVote: {
    backgroundColor: "#316ec4",
    padding: 3,
    borderRadius: 5,
    marginRight: 4,
  },
  buttonDelete: {
    backgroundColor: "#ef5c22",
    padding: 3,
    borderRadius: 5,
  },
  buttonEdit: {
    backgroundColor: "#316ec4",
    padding: 5,
    borderRadius: 5,
    marginRight: 4,
  },
  buttonViewResult: {
    backgroundColor: "#1cb479",
    padding: 3,
    borderRadius: 5,
    alignSelf: "center",
  },

  // ABSENT
  inputReason: {
    backgroundColor: "#F2F2F2",
    marginTop: 7,
    flexWrap: "wrap",
  },

  // MEETING MAP
  colorItem: {
    width: 15,
    height: 15,
    marginRight: 10,
    borderRadius: 15 / 2,
  },
  itemDetailVote: {
    flexDirection: "row",
    marginBottom: 5,
    marginRight: 10,
    minWidth: 100,
  },
  titleInfor: {
    fontSize: 14,
    fontWeight: "bold",
    paddingBottom: 3,
  },
  contentInfor: {
    textAlign: "justify",
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#fff",
  },

  // GENERAL
  flex1: {
    flex: 1,
  },
  //note
  buttonNote: {
    justifyContent: "center",
    backgroundColor: "#fba500",
    padding: 5,
    borderRadius: 3,
    color: "#fff",
  },
  borderButtonNote: {
    backgroundColor: "#EFEFF4",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    height: 40,
    paddingEnd: 10,
  },
  borderButtonEditNote: {
    paddingTop: 5,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  highlightBlueTxt: {
    color: '#3127F1',
    fontSize: 14,
    fontWeight: 'bold'
  },
  btnAttachVOfficeFile: {
    width: 130,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#2059EE',
    display: 'flex',
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  btnAttachVOfficeFileText: {
    fontWeight: "600",
    fontSize: 15,
    textAlign: "center",
    color: "#2059EE",
    marginLeft: 5
  }
});
