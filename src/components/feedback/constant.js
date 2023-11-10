export const DEFAULT = {
  ACTIVE_PAGE: 0,
  // STATUS: STATUS.ALL,
  PAGE_SIZE: 1000,
};

export const VOTE_TYPE = {
  OPTION: 'OPTION',
  YESNO: 'YESNO',
};

export const THONG_BAO = {
  GUI_VAN_THU_THANH_CONG: 'Gửi văn thư thành công !',
  LUU_TRA_LOI_THANH_CONG: 'Lưu trả lời ý kiến thành công !',
  BAO_VANG_THANH_CONG: 'Báo vắng thành công!',
  THAM_GIA_Y_KIEN: 'Tham gia ý kiến thành công!',
  DANG_KY_PHAT_BIEU: 'Đăng ký phát biểu thành công!',
  KHONG_THANH_CONG: 'Có lỗi, vui lòng thử lại sau !',
};

export const STATUS = {
  CHUA_TRA_LOI: 'Chưa trả lời',
  DA_TRA_LOI: 'Đã trả lời',
};

export const TYPE_LABEL = {
  CHUA_TRA_LOI: 'Chưa trả lời',
  PHUONG_AN_KHAC: 'Phương án khác',
  Y_KIEN_KHAC: 'Ý kiến khác',
  YES: 'Đồng ý',
  NO: 'Không đồng ý',
};

export const TYPE_STATUS = {
  TAT_CA: 'Tất cả',
  DA_TRA_LOI: 'Đã trả lời',
  CON_HAN: 'Chưa trả lời trong hạn',
  QUA_HAN: 'Chưa trả lời quá hạn',
  DA_GUI_CAP_TREN: 'Đã gửi cấp trên',
  CHO_PHE_DUYET: 'Chờ phê duyệt',
  DA_DUYET: 'Đã duyệt',
  TU_CHOI_DUYET: 'Từ chối duyệt',
};
export const TYPE_STATUS_CV = {
  TAT_CA: 'Tất cả',
  CHUAGUI: 'Chưa gửi',
  DAGUI: 'Đã gửi',
  DATRINHDUYET: 'Đã trình duyệt',
  DA_DUYET: 'Đã duyệt',
  TU_CHOI_DUYET: 'Từ chối duyệt',
};

export const TYPE_ACTION = {
  GIA_HAN_TRA_LOI: 'Gia hạn trả lời phiếu',
};

export const TYPE_FILE = {
  KIN: 'PRIVATE',
  CONG_KHAI: 'PUBLIC',
};

export const PERMISSIONS = {
  XEM: 'FILE-VIEW',
  XOA: 'FILE-DELETE',
  SUA: 'FILE-EDIT',
  XEM_FILE_DINH_KEM: 'FILE-VIEW_FILE_ATTACH',
  CAP_NHAT_TRANG_THAI_PHIEU: 'FILE-UPDATE_FILE_STATUS',
  TAO_PLYK: 'FILE-CREATE',
  CHUYEN_PHIEU_CHO_VT: 'FILE-FORWARD',
  TRA_LOI_PLYK: 'FILE-ANSWER',
  GUI_PLYK: 'FILE-SEND',
  XEM_KQ_PLYK: 'FILE-RESULT',
  GUI_CAP_TREN: 'FILE-ASSIST',
  GIA_HAN_PLYK: 'FILE-EXTEND',
};
