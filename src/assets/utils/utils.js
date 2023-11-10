import { utils, AES, RSA } from '@egendata/react-native-simple-crypto';
import { Buffer } from 'buffer';
import { Alert } from 'react-native';
import store from '../../redux/store';

const setTypePublicKey = (string) => {
    const { length } = string;
    let newString = '-----BEGIN RSA PUBLIC KEY-----\n';

    for (let index = 0; index < length; index += 64) {
        const last = index + 64;
        if (last < length) {
            newString += `${string.slice(index, last)}\n`;
        } else {
            newString += string.slice(index, length);
        }
    };

    newString += '\n-----END RSA PUBLIC KEY-----';
    return newString;
};

export const convertHexToBase64 = (string) => {
    const arrBuffer = utils.convertHexToArrayBuffer(string);
    return utils.convertArrayBufferToBase64(arrBuffer);
};

export const convertBase64ToHex = (string) => {
    const arrBuffer = utils.convertBase64ToArrayBuffer(string);
    return utils.convertArrayBufferToHex(arrBuffer);
};

export const randomKeyAES = async (length) => {
    const randomArr = await utils.randomBytes(length);
    return utils.convertArrayBufferToHex(randomArr);
};

export const encryptRSA = async (aesKey, publicKey64) => {
    const correctFormatPublicKey = setTypePublicKey(publicKey64);
    const rsaEncryptedMessage = await RSA.encrypt(aesKey, correctFormatPublicKey);
    const aesEncodeKey = Buffer.from(rsaEncryptedMessage, 'base64').toString('hex');
    return aesEncodeKey;
};


export const encryptAES = async (data, aesKey, ivKey) => {
    const stringData = JSON.stringify(data);
    const stringDataArrBuf = utils.convertUtf8ToArrayBuffer(stringData);
    const aesKeyArrBuf = utils.convertUtf8ToArrayBuffer(aesKey);
    const ivKeyArrBuf = utils.convertUtf8ToArrayBuffer(ivKey);

    const dataEncryptArrBuf = await AES.encrypt(stringDataArrBuf, aesKeyArrBuf, ivKeyArrBuf);
    const dataEncrypt = utils.convertArrayBufferToHex(dataEncryptArrBuf);
    return dataEncrypt;
};

export const decryptAES = async (data, aesKey, ivKey) => {
    const stringDataArrBuf = utils.convertHexToArrayBuffer(data);
    const aesKeyArrBuf = utils.convertUtf8ToArrayBuffer(aesKey);
    const ivKeyArrBuf = utils.convertUtf8ToArrayBuffer(ivKey);

    const dataDecryptArrBuf = await AES.decrypt(stringDataArrBuf, aesKeyArrBuf, ivKeyArrBuf);
    const dataDecrypt = utils.convertArrayBufferToUtf8(dataDecryptArrBuf);

    return dataDecrypt;
};

export const checkPermission = (permission) => {
    const { userInfo } = store.getState().AuthenReducer;
    const { menuPermission } = userInfo;
    const {code } = userInfo;
    // Alert.alert(permission,""+(menuPermission.filter(element => permission === element).length > 0))
    if (menuPermission === 'CONFERENCE-CONFIRM' && code === 'ROLE_KHACHMOI') return false;
    else
    return menuPermission.filter(element => permission === element).length > 0;
};
