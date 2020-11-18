import { makeFetchAction } from 'redux-api-call';

import { respondToSuccess } from '../middlewares/api-reaction';
import nfetch from '../libs/nfetch';
import { generateQuery, getResetter } from '../libs';

export const CREATE_NEW_ORDER = 'CreateNewOrderAPI';
export const GET_ORDER_PAGING = 'GetOrderPagingAPI';

const CreateNewOrderAPI = makeFetchAction(
  CREATE_NEW_ORDER,
  ({ unitPrice, groupId, supplierId }) =>
    nfetch({
      endpoint: '/api/Order'
    })({ unitPrice, groupId, supplierId })
);

export const createNewOrder = ({ unitPrice, groupId, supplierId }, callback) =>
  respondToSuccess(
    CreateNewOrderAPI.actionCreator({ unitPrice, groupId, supplierId }),
    () => {
      typeof callback === 'function' && callback()
    }
  );
export const CreateNewOrderData = CreateNewOrderAPI.dataSelector;
export const CreateNewOrderError = CreateNewOrderAPI.errorSelector;
export const CreateNewOrderResetter = getResetter(CreateNewOrderAPI);

//Get order by filter
const GetOrderPagingAPI = makeFetchAction(
  GET_ORDER_PAGING,
  ({
    status ,
    groupName,
    fromDate,
    toDate,
    pageIndex,
    pageSize,
  }) => {
    return nfetch({
      endpoint: `/api/Order/Fillter${generateQuery({
        orderStatus: status,
        groupName: groupName,
        fromDate,
        toDate,
        pageIndex,
        pageSize,
        orderByDescending: true,
      })}`,
      method: 'GET'
    })();
  }
);

export const getOrderPaging = ({
  status,
  groupName,
  fromDate,
  toDate,
  pageIndex,
  pageSize
}) =>
  respondToSuccess(
    GetOrderPagingAPI.actionCreator({
      status,
      groupName,
      fromDate,
      toDate,
      pageIndex,
      pageSize
    }),
    () => {}
  );

export const GetOrderPagingData = GetOrderPagingAPI.dataSelector;
export const GetOrderPagingError = GetOrderPagingAPI.errorSelector;
export const GetOrderPagingResetter = getResetter(GetOrderPagingAPI);