import { makeFetchAction } from 'redux-api-call';

import { respondToSuccess } from '../middlewares/api-reaction';
import { createErrorSelector, parseBoolean } from '../utils';
import nfetch from '../libs/nfetch';
import { generateQuery, getResetter } from '../libs';

export const CREATE_NEW_ORDER = 'CreateNewOrderAPI';

const CreateNewOrderAPI = makeFetchAction(
  CREATE_NEW_ORDER,
  ({ unitPrice, groupId, supplierId }) =>
    nfetch({
      endpoint: '/api/Order'
    })({ unitPrice, groupId, supplierId })
);

export const createNewOrder = ({ unitPrice, groupId, supplierId }) =>
  respondToSuccess(
    CreateNewOrderAPI.actionCreator({ unitPrice, groupId, supplierId }),
    () => {}
  );
export const CreateNewOrderData = CreateNewOrderAPI.dataSelector;
export const CreateNewOrderError = CreateNewOrderAPI.errorSelector;
export const CreateNewOrderResetter = getResetter(CreateNewOrderAPI);
