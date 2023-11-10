export const STATUS = {
  CHUA_KET_THUC: "CHUA_KET_THUC",
  DA_KET_THUC: "DA_KET_THUC"
};

export const CONFERENCE_STATUS = {
  DA_XOA: 0,
  CHUA_GUI: 1,
  DA_GUI: 2,
  DANG_HOP: 3,
  CHO_PHE_DUYET: 4,
  DA_KET_THUC: 5,
  TU_CHOI: 6,
  DA_PHE_DUYET: 7,
  DA_HOP: 9
};

export const CONFERENCE_STATUS_COLORS = {
  0: "#000000",
  1: "#646464",
  2: "#3060DB",
  3: "#038A00",
  4: "#EA5C30",
  5: "#000000",
  6: "#D7002E",
  7: "#3060DB",
  9: "#000000"
};

export const CONFERENCE_STATUS_LABELS = {
  0: "Đã xóa",
  1: "Chưa gửi",
  2: "Đã phê duyệt",
  3: "Đang họp",
  4: "Chờ phê duyệt",
  5: "Đã kết thúc",
  6: "Từ chối",
  7: "Đã phê duyệt",
  9: "Đã họp"
};

export const CONFERENCE_CONTENTS_STATUS = {
  AN_NOI_DUNG: -1,
  DEFAULT: 0,
  DANG_HOP: 1
};

export const DEFAULT_VALUE_GET_LIST_MEETING = {
  ACTIVE_PAGE: 0,
  STATUS: STATUS.CHUA_KET_THUC,
  PAGE_SIZE: 20
};

export const PARTICIPANT_STATUS = {
  NOT_CONFIRM: 0,
  JOIN: 1,
  ABSENT: 2,
  DELEGATION: 11
};
export const PARTICIPANT_STATUS_COLORS = {
  0: {
    color: "#EA5C30",
    name: "Chưa xác nhận tham gia"
  },
  1: {
    color: "#3060DB",
    name: "Đã xác nhận tham gia"
  },
  2: {
    color: "#D7002E",
    name: "Vắng mặt"
  }
};

export const PARTICIPANT_STATUS_NAME = {
  NOT_CONFIRM: "Chưa xác nhận tham gia",
  JOIN: "Đã xác nhận tham gia",
  ABSENT: "Vắng mặt"
};
export const PARTICIPANT_APPROVE_ABSENT_STATUS = {
  NOT_ACCEPT: 0,
  ACCEPT: 1
};
export const OPINION_STATUS = {
  OPINE: 0,
  SPEAK: 1
};

export const STATUS_GET_LIST_OPINION = {
  OPINE: 1,
  SPEAK: 2
};

export const ISSUE_STATUS = {
  0: {
    name: "DEFAULT",
    icon: "account-multiple",
    color: "#b7b7b7"
  },
  1: {
    name: "DANG_HOP",
    icon: "account-group",
    color: "#316ec4"
  },
  2: {
    name: "CHO_BIEU_QUYET",
    icon: "account-edit",
    color: "#8879b4"
  },
  3: {
    name: "DEFAULT",
    icon: "account-multiple",
    color: "#b7b7b7"
  },
  4: {
    name: "DA_BIEU_QUYET",
    icon: "account-multiple-check",
    color: "#b7b7b7"
  }
};

export const VOTE_TYPE = {
  OPTION_2: "OPTION_2",
  OPTION: "OPTION",
  YESNO: "YESNO"
};

export const ANSWER_TYPE = {
  CHUA_TRA_LOI: "CHUA_TRA_LOI",
  PHUONG_AN_KHAC: "PHUONG_AN_KHAC",
  Y_KIEN_KHAC: "Y_KIEN_KHAC"
};

export const LIST_PROPS_VOTE_RESULT_YESNO = {
  YES: "Đồng ý",
  NO: "Ý kiến khác",
  CHUA_TRA_LOI: "Chưa trả lời",
  PHUONG_AN_KHAC: "Phương án khác"
};

export const LIST_PROPS_VOTE_RESULT = {
  YES: "Đồng ý",
  Y_KIEN_KHAC: "Ý kiến khác",
  CHUA_TRA_LOI: "Chưa trả lời"
};

export const LIST_RESPONSE_VOTE_RESULT = {
  YES: "YES",
  Y_KIEN_KHAC: "Y_KIEN_KHAC",
  CHUA_TRA_LOI: "CHUA_TRA_LOI"
};

export const OBJECT_RESPONSE_VOTE_RESULT = {
  YES: "YES",
  NO: "NO",
  CHUA_TRA_LOI: "CHUA_TRA_LOI",
  PHUONG_AN_KHAC: "PHUONG_AN_KHAC",
  Y_KIEN_KHAC: "Y_KIEN_KHAC"
};

export const LIST_VOTE_RESULT = {
  YES: "Đồng ý",
  NO: "Ý kiến khác",
  PHUONG_AN: "Phương án",
  CHUA_TRA_LOI: "Chưa trả lời",
  PHUONG_AN_KHAC: "Phương án khác",
  Y_KIEN_KHAC: "Ý kiến khác"
};

export const NOT_COMPLETE = {
  PROPERTY: "NOT_COMPLETE",
  STATUS:
    "Vấn đề đang được biểu quyết. Chỉ được xem kết quả sau khi hoàn thành biểu quyết"
};

export const LOAI_GIAY_MOI = {
  CA_NHAN: "Mời cá nhân",
  DON_VI: "Mời đơn vị"
};

export const DEPARTMENT_TYPE_NAME = "DEPARTMENT";

export const STATUS_ASSIGN = {
  INSERT: 0,
  UPDATE: 4,
  DENY: 5
};

export const LABELS = {
  LAB0001: "Họp uỷ ban nhân dân",
  LAB0002: "Danh sách phiên họp",
  LAB0003: "Chưa kết thúc",
  LAB0004: "Đã kết thúc",
  LAB0005: "Chi tiết phiên họp",
  LAB0006: "Thành viên tham gia và khách mời",
  LAB0007: "Thành phần tham gia",
  LAB0008: "Thành viên CP",
  LAB0009: "Khách mời",
  LAB0010: "Đại diện tham gia",
  LAB0012: "Đã họp",
  // TABLE MEMS
  LAB0015: "STT",
  LAB0016: "Chức vụ - Họ tên",
  LAB0017: "Tham gia",
  // TABLE GUESTS
  LAB0020: "Tên đơn vị",
  LAB0021: "Tên cá nhân",
  // TABLE CONTENT
  LAB0023: "Cơ quan chủ đề án",
  // MODALS
  LAB0024: "Đồng ý",
  LAB0025: "Huỷ bỏ",
  // MODAL JOIN
  LAB0026: "Xác nhận",
  LAB0027: "Xác nhận tham gia phiên họp?",
  // MODAL ABSENT
  LAB0028: "Báo vắng",
  LAB0030: "Vui lòng chọn",
  // MODAL OPINE
  LAB0031: "Tham gia ý kiến",
  LAB0032: "Nhập ý kiến",
  // MODAL SPEAK
  LAB0033: "Đăng ký phát biểu",
  LAB0034: "Xác nhận đăng ký phát biểu về nội dung này?",

  // MEETING DETAIL
  LAB0035: "Nội dung phiên họp",
  LAB0036: "Chi tiết nội dung",
  LAB0041: "Không có",
  LAB0042: "Nội dung tài liệu",
  LAB0046: "Đăng ký phát biểu",
  LAB0047: "Tham gia ý kiến",
  LAB0048: "Quay lại lịch họp",
  // VOTE
  LAB0049: "Người nêu ý kiến",
  LAB0050: "Ý kiến",
  LAB0051: "Phương án",
  LAB0052: "Kết quả biểu quyếtđ",
  LAB0053: "OK",
  LAB0054: "Vấn đề biểu quyết",
  LAB0055: "Tổng số",
  LAB0056: "(phiếu)",
  LAB0057: "Ý kiến khác",
  LAB0058: "Vấn đề",
  LAB0059: "Không đồng ý",
  LAB0060: "Biểu quyết",
  LAB0061: "cuộc họp",
  LAB0062: "Thông tin vị trí"
};

export const PERMISSIONS = {
  XEM: "CONFERENCE-VIEW",
  SUA: "CONFERENCE-EDIT",
  XOA: "CONFERENCE-DELETE",
  GUI: "CONFERENCE-SEND",
  XAC_NHAN_THAM_GIA: "CONFERENCE-CONFIRM",
  CHO_Y_KIEN: "CONFERENCE-COMMENT",
  BIEU_QUYET: "CONFERENCE-VOTE",
  TAO: "CONFERENCE-CREATE",
  BAO_VANG: "CONFERENCE-REJECT\n",
  UY_QUYEN: "CONFERENCE-AUTHORITY\n",
  DANG_KY_PHAT_BIEU: "CONFERENCE-REGISTER",
  DONG: "CONFERENCE-CLOSE",
  BO_SUNG_TAI_LIEU: "CONFERENCE-UPDATE_ATTACH",
  DIEU_KHIEN: "CONFERENCE-CONTROLLER",
  XEM_KQ_BIEU_QUYET: "CONFERENCE-RESULT",
  XEM_ND_PHAT_BIEU: "CONFERENCE-RECORD",
  THAO_TAC_KHO_TAI_LIEU: "CONFERENCE-FILE_STORE_ACTION",
  BAO_CAO_TONG_HOP: "CONFERENCE-EXPORT_SUMMARY_REPORT",
  PHAN_CONG: "CONFERENCE-PARTICIPANT",
  NOTE_KET_LUAN: "CONFERENCE-CONCLUSION_MEETING",
  TAO_CONG_VIEC_VOFFICE: "CONFERENCE-VOFFICE_JOB_CREATE",
  SUA_SO_DO: "CONFERENCE-EDIT_ROOM",
  GAN_VI_TRI: "CONFERENCE-ASSIGN",
  CHI_DINH_PHAT_BIEU: "CONFERENCE-APPOINT",
  DANG_PHAT_BIEU: "CONFERENCE-IS_STATEMENT",
  KET_THUC_PHAT_BIEU: "CONFERENCE-FINISH_STATEMENT",
  THEM_DU_THAO: "CONFERENCE-DU_THAO_VAN_BAN",
  DANG_KY_LICH: "CONFERENCE-DANG_KY_LICH",
  BAC_BO_PHAT_BIEU: "CONFERENCE-REMOVE_STATEMENT",
  DUYET_BAO_VANG: "CONFERENCE-ABSENT_APPROVE",
  TRINH_PHE_DUYET: "CONFERENCE-APPROVE"
};

export const ELEMENTS_MAP_MEETING_OBJECT_TYPE = {
  TABLE: "Bàn",
  CHAIR: "Ghế"
};

export const MEETING_MAP_STATUS = {
  INVITED: "1",
  ABSENT: "3",
  IS_STATE: "7",
  REGISTER_STATE: "4",
  WAS_STATE: "5",
  EMPTY: "6",
  JOINED: "2"
};

export const USER_TYPE = {
    MEMBER: 'MEMBER'
};

export const STATE_CODE = {
    CHO_PHAT_BIEU: 0,
};

export const SIZE_OF_MEETING_MAP_WEB = 1500;

export const CONST_CHECK_VOTE = {
    YES: 1,
    NO: 0,
    NOT_CHECK: -1,
};

export const SUBJECT_TYPES = {
    WITHOUT: 'WITHOUT'
};
