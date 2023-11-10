import {ACTION_TYPES} from '../types';
// import { getErrors, clearErrors } from './errors.action';
import {getErrors} from './errors.action';
import {
  getDashboardService,
  getDashboardConfirmeService,
  getListConfernceService,
} from '../../services/service';

const getDashboardAction = (data) => {
  const {
    summary = {},
    conferences = [],
    conference = {},
    summaryData = [],
  } = data;
  return {
    type: ACTION_TYPES.GET_DASHBOARD,
    summary,
    conferences,
    conference,
    summaryData,
  };
};

const getDashboardConfirmeAction = (data) => {
  const totalMeeting = data;
  return {
    type: ACTION_TYPES.GET_DASHBOARD_CONFIRM,
    totalMeeting,
  };
};

const getListConfernceAction = (data) => {
  const listMeeting = data;
  return {
    type: ACTION_TYPES.GET_LIST_CONFERENCE_DASHBOARD,
    listMeeting,
  };
};

export const getDashboard = () => async (dispatch) => {
  try {
    // await dispatch(clearErrors());

    const res = await getDashboardService();
    const {mess = {}} = res;
    const {messCode, messDetail = ''} = mess;

    if (messCode === 1) {
      const data = JSON.parse(res.data);
      console.log('bb data getDashboardService', data);
      dispatch(getDashboardAction(data));
    } else {
      await dispatch(getErrors(messDetail));
    }
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};

export const getDashboardConfirme = (body) => async (dispatch) => {
  try {
    // await dispatch(clearErrors());

    const res = await getDashboardConfirmeService(body);
    const {mess = {}} = res;
    const {messCode, messDetail = ''} = mess;

    if (messCode === 1) {
      const data = JSON.parse(res.data);
      dispatch(getDashboardConfirmeAction(data));
    } else {
      await dispatch(getErrors(messDetail));
    }
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};

export const getListConfernce = (body) => async (dispatch) => {
  try {
    // await dispatch(clearErrors());

    const res = await getListConfernceService(body);
    const {mess = {}} = res;
    const {messCode, messDetail = ''} = mess;

    if (messCode === 1) {
      const data = JSON.parse(res.data);
      dispatch(getListConfernceAction(data));
    } else {
      await dispatch(getErrors(messDetail));
    }
  } catch (error) {
    dispatch(getErrors(error));
    console.log(error);
  }
};
