import {ACTION_TYPES} from '../types';
import {getErrors, clearErrors} from './errors.action';
import {
  getAESPublicKey,
  loginService,
  createOTPService,
  changePasswordService,
  encodeService,
  validateOTPService,
  submitListDonvi,
  getListDonvi,
} from '../../services/service';
import {randomKeyAES, convertHexToBase64} from '../../assets/utils/utils';

const getPublicKeyAction = (data) => {
  const {publicKey = '', params = ''} = data;
  const newPublicKey = publicKey.slice(48);
  const publicKey64 = convertHexToBase64(newPublicKey);

  return {
    type: ACTION_TYPES.GET_PUBLIC_KEY,
    publicKey,
    publicKey64,
    params,
  };
};

const getRandomAESKeyAction = (aesKey, ivKey) => {
  return {
    type: ACTION_TYPES.GET_AES_KEY,
    aesKey,
    ivKey,
  };
};

const getDataLogin = (data) => {
  return {
    type: ACTION_TYPES.LOGIN,
    userInfo: data,
  };
};
const getListDonVi = (data) => {
  return {
    type: ACTION_TYPES.GET_LIST_DONVI,
    listDonVi: data,
  };
};

const getDataCreateOTP = (data) => {
  return {
    type: ACTION_TYPES.CREATE_OTP,
    OTPInfo: data,
  };
};

const encodeAction = (data) => {
  return {
    type: ACTION_TYPES.ENCODE_DATA_CHAT,
    encodedDataChat: data,
  };
};

const setServerConnectAction = (server) => {
  return {
    server,
    type: ACTION_TYPES.SET_SERVER,
  };
};

const logOutAction = () => {
  return {
    type: ACTION_TYPES.LOGOUT,
  };
};

export const getPublicKey = () => async (dispatch) => {
  try {
    await dispatch(clearErrors());

    const res = await getAESPublicKey();

    const {mess = {}} = res;
    if (mess?.messCode === 1) {
      const data = JSON.parse(res.data);
      dispatch(getPublicKeyAction(data));
    } else {
      await dispatch(getErrors(res));
    }
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};

export const login = (reqData) => async (dispatch) => {
  try {
    await dispatch(clearErrors());
    const res = await loginService(reqData);
    const {mess = {}} = res;
    const {messCode, messDetail = ''} = mess;
    console.log('bb res login', mess);
    if (messCode === -1003) {
      return {messCode, messDetail};
    }
    if (messCode === 1) {
      const data = JSON.parse(res.data);

      dispatch(getDataLogin(data));
    } else {
      await dispatch(getErrors(messDetail));
    }
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};
export const loginWithUnit = (reqData) => async (dispatch) => {
  try {
    await dispatch(clearErrors());
    const res = await submitListDonvi(reqData);
    const {mess = {}} = res;
    const {messCode, messDetail = ''} = mess;
    if (messCode === -1003) {
      return {messCode, messDetail};
    }
    if (messCode === 1) {
      const data = JSON.parse(res.data);
      dispatch(getDataLogin(data));
    } else {
      await dispatch(getErrors(messDetail));
    }
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};

export const getListDonViAction = (reqData) => async (dispatch) => {
  try {
    await dispatch(clearErrors());
    const res = await getListDonvi(reqData);
    const {mess = {}} = res;
    const {messCode, messDetail = ''} = mess;

    if (messCode === 1) {
      const data = JSON.parse(res.data);
      // const dataTest = [
      //   {
      //     accountId: 106,
      //     name: 'Bộ Giao thông vận tải',
      //     code: 'bgtvt',
      //     createdDateStr: '12/07/2021',
      //     status: 1,
      //   },
      //   {
      //     accountId: 1064,
      //     name: 'Bộ Giao 1',
      //     code: 'bgtvt',
      //     createdDateStr: '12/07/2021',
      //     status: 1,
      //   },
      //   {
      //     accountId: 1066,
      //     name: 'Bộ Giao 2',
      //     code: 'bgtvt',
      //     createdDateStr: '12/07/2021',
      //     status: 1,
      //   },
      //   {
      //     accountId: 1069,
      //     name: 'Bộ Giao 3',
      //     code: 'bgtvt',
      //     createdDateStr: '12/07/2021',
      //     status: 1,
      //   },
      //   {
      //     accountId: 1070,
      //     name: 'Bộ Giao 4',
      //     code: 'bgtvt',
      //     createdDateStr: '12/07/2021',
      //     status: 1,
      //   },
      //   {
      //     accountId: 1071,
      //     name:
      //       'Bộ Giao 5 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Reiciendis, repellendus.lorem10   Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil, corrupti?',
      //     code: 'bgtvt',
      //     createdDateStr: '12/07/2021',
      //     status: 1,
      //   },
      //   {
      //     accountId: 1072,
      //     name: 'Bộ Giao 6',
      //     code: 'bgtvt',
      //     createdDateStr: '12/07/2021',
      //     status: 1,
      //   },
      // ];
      dispatch(getListDonVi(data));
    } else {
      await dispatch(getErrors(messDetail));
    }
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};

export const createOTP = (body) => async (dispatch) => {
  try {
    await dispatch(clearErrors());
    const res = await createOTPService(body);
    const data = JSON.parse(res);
    const {message} = data;
    const {messCode, messDetail = ''} = message;

    if (messCode === 1) {
      dispatch(getDataCreateOTP(data.data));
    } else {
      await dispatch(getErrors(messDetail));
    }
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};

export const validateOTP = (body) => async (dispatch) => {
  try {
    await dispatch(clearErrors());
    const res = await validateOTPService(body);
    const data = JSON.parse(res);
    const {message} = data;
    const {messCode, messDetail = ''} = message;

    if (messCode === 1) {
      return data;
    } else {
      await dispatch(getErrors(messDetail));
    }
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};

export const changePassword = (body) => async (dispatch) => {
  try {
    const res = await changePasswordService(body);
    const {mess = {}, data = ''} = res;
    const {messCode, messDetail = ''} = mess;

    if (messCode === 1) {
      return data;
    }
    await dispatch(getErrors(messDetail));
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
  return null;
};

export const getRandomAESKey = () => async (dispatch) => {
  try {
    const aesKey = await randomKeyAES(8);
    const ivKey = await randomKeyAES(8);

    dispatch(getRandomAESKeyAction(aesKey, ivKey));
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};

export const encode = (reqData) => async (dispatch) => {
  try {
    await dispatch(clearErrors());
    const res = await encodeService(reqData);
    dispatch(encodeAction(res || []));
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};

export const setServerConnect = (server) => async (dispatch) => {
  try {
    dispatch(setServerConnectAction(server));
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};

export const logOut = () => async (dispatch) => {
  try {
    dispatch(logOutAction());
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};
