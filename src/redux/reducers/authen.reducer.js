import { ACTION_TYPES } from '../types';

const initialState = {
    publicKey: '',
    publicKey64: '',
    sessionId: '',
    aesKey: '',
    ivKey: '',
    aesPost: '',
    userInfo: null,
    OTPInfo: null,
    serverConnect: '',
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.GET_PUBLIC_KEY: {
            const { publicKey = '', publicKey64 = '', params = '' } = action;

            return {
                ...state,
                publicKey,
                publicKey64,
                sessionId: params,
            };
        }
        case ACTION_TYPES.GET_AES_KEY: {
            const { aesKey = '', ivKey = '' } = action;
            const aesPost = `${aesKey}JOINAESKEY${ivKey}`;

            return {
                ...state,
                aesKey,
                ivKey,
                aesPost,
            };
        }
        case ACTION_TYPES.LOGIN: {
            const { userInfo = {} } = action;
            let { menuPermission } = userInfo;
            let { listRoleEntity = {} } = userInfo;
            let code = ""
            if (listRoleEntity.length > 0) {
                  code = listRoleEntity[0];
            }
            menuPermission = menuPermission.split(',').filter(permission => permission !== '');

            return {
                ...state,
                userInfo: { ...userInfo, menuPermission, code },
            };
        }
        case ACTION_TYPES.GET_LIST_DONVI: {
            const { listDonVi = {} } = action;
            return {
                ...state,
                listDonVi,
            };
        }
        case ACTION_TYPES.CREATE_OTP: {
            const { OTPInfo  } = action;
            return {
                ...state,
                OTPInfo: OTPInfo
            };
        }
        case ACTION_TYPES.ENCODE_DATA_CHAT: {
            const { encodedDataChat } = action;
            return {
                ...state,
                encodedDataChat
            };
        }
        case ACTION_TYPES.SET_SERVER: {
            const { server = '' } = action;
            return {
                ...state,
                serverConnect: server,
            };
        }
        case ACTION_TYPES.LOGOUT: {
            const { serverConnect = '' } = state;
            return {
                ...initialState,
                serverConnect
            };
        }
        default:
            return state;
    }
};
