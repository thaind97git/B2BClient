import { makeFetchAction } from 'redux-api-call';

import { respondToSuccess } from '../middlewares/api-reaction';
import nfetch from '../libs/nfetch';
import { getResetter } from '../libs';

const GET_CONFIG_SETTING = 'GET_CONFIG_SETTING';
export const UPDATE_CONFIG_SETTING = 'UPDATE_CONFIG_SETTING';

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
