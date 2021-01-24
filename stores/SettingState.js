import { makeFetchAction } from 'redux-api-call';

import { respondToSuccess } from '../middlewares/api-reaction';
import nfetch from '../libs/nfetch';
import { getResetter } from '../libs';

const GET_CONFIG_SETTING = 'GET_CONFIG_SETTING';
export const UPDATE_CONFIG_SETTING = 'UPDATE_CONFIG_SETTING';
const Get_CONFIG_GROUP_SETTING = 'GetConfigSettingGroupAPI';
export const UPDATE_CONFIG_GROUP_SETTING = 'UpdateConfigGroupSettingAPI';

const GetConfigSettingAPI = makeFetchAction(
  GET_CONFIG_SETTING,
  nfetch({
    endpoint: '/api/AdminSetting',
    method: 'GET'
  })
);
export const getConfigSetting = () =>
  respondToSuccess(GetConfigSettingAPI.actionCreator());
export const GetConfigSettingData = GetConfigSettingAPI.dataSelector;
export const GetConfigSettingError = GetConfigSettingAPI.errorSelector;
export const GetConfigSettingResetter = getResetter(GetConfigSettingAPI);

const UpdateConfigSettingAPI = makeFetchAction(
  UPDATE_CONFIG_SETTING,
  (values) =>
    nfetch({
      endpoint: '/api/AdminSetting',
      method: 'PUT'
    })(values)
);
export const updateConfigSetting = (values = {}) =>
  respondToSuccess(UpdateConfigSettingAPI.actionCreator(values));
export const UpdateConfigSettingData = UpdateConfigSettingAPI.dataSelector;
export const UpdateConfigSettingError = UpdateConfigSettingAPI.errorSelector;
export const UpdateConfigSettingResetter = getResetter(UpdateConfigSettingAPI);

const GetConfigGroupSettingAPI = makeFetchAction(
  Get_CONFIG_GROUP_SETTING,
  nfetch({
    endpoint: '/api/GroupSetting',
    method: 'GET'
  })
);
export const getConfigGroupSetting = () =>
  respondToSuccess(GetConfigGroupSettingAPI.actionCreator());
export const GetConfigGroupSettingData = GetConfigGroupSettingAPI.dataSelector;
export const GetConfigGroupSettingError =
  GetConfigGroupSettingAPI.errorSelector;
export const GetConfigGroupSettingResetter = getResetter(
  GetConfigGroupSettingAPI
);

const UpdateConfigGroupSettingAPI = makeFetchAction(
  UPDATE_CONFIG_GROUP_SETTING,
  (values) =>
    nfetch({
      endpoint: '/api/GroupSetting',
      method: 'PUT'
    })(values)
);
export const updateConfigGroupSetting = (values = {}) =>
  respondToSuccess(
    UpdateConfigGroupSettingAPI.actionCreator(values),
    (_, __, store) => {
      store.dispatch(getConfigGroupSetting());
    }
  );
export const UpdateConfigGroupSettingData =
  UpdateConfigGroupSettingAPI.dataSelector;
export const UpdateConfigGroupSettingError =
  UpdateConfigGroupSettingAPI.errorSelector;
export const UpdateConfigGroupSettingResetter = getResetter(
  UpdateConfigGroupSettingAPI
);
