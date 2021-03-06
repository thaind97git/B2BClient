import { makeFetchAction } from 'redux-api-call';

import { respondToSuccess } from '../middlewares/api-reaction';
import nfetch from '../libs/nfetch';
import { generateQuery, getResetter } from '../libs';
import { getRequestPaging } from './RequestState';
import { R_PENDING } from '../enums/requestStatus';

export const CREATE_NEW_GROUP = 'CreateNewGroupAPI';
export const ADD_REQUEST_TO_GROUP = 'AddRequestToGroupAPI';
export const REMOVE_REQUEST_FROM_GROUP = 'RemoveRequestFromGroupAPI';
const GET_GROUP_BY_PRODUCT_ID = 'GetGroupByProductIdAPI';
const GET_GROUP_PAGING = 'GetGroupPagingAPI';
const GET_GROUP_NOT_HAVING_SUPPLIER = 'GetGroupNotHavingSupplierAPI';
const GET_GROUP_HAVING_SUPPLIER = 'GetGroupHavingSupplierAPI';
const GET_GROUP_DETAILS = 'GetGroupDetailsAPI';
export const ADD_SUPPLIER_TO_GROUP = 'AddSupplierToGroupAPI';
export const ACCEPT_GROUP = 'AcceptGroupAPI';

// Create new group
const CreateNewGroupAPI = makeFetchAction(
  CREATE_NEW_GROUP,
  ({ groupName, requestIds, description }) =>
    nfetch({
      endpoint: '/api/Group'
    })({ groupName, requestIds, description })
);

export const createNewGroup = (
  { groupName, requestIds, description },
  callback
) =>
  respondToSuccess(
    CreateNewGroupAPI.actionCreator({ groupName, requestIds, description }),
    (resp, _, store) => {
      if (resp) {
        store.dispatch(
          getRequestPaging({
            status: [R_PENDING],
            productTitle: '',
            fromDate: null,
            toDate: null,
            pageIndex: 1,
            pageSize: 10
          })
        );
        typeof callback === 'function' && callback();
      }
    }
  );

export const CreateNewGroupData = CreateNewGroupAPI.dataSelector;
export const CreateNewGroupError = CreateNewGroupAPI.errorSelector;
export const CreateNewGroupResetter = getResetter(CreateNewGroupAPI);

// Add request to group
const AddRequestToGroupAPI = makeFetchAction(
  ADD_REQUEST_TO_GROUP,
  ({ groupId, requestIds }) =>
    nfetch({
      endpoint: '/api/Group/Requests',
      method: 'PUT'
    })({ groupId, requestIds })
);

export const addRequestToGroup = ({ groupId, requestIds, callback }) =>
  respondToSuccess(
    AddRequestToGroupAPI.actionCreator({ groupId, requestIds }),
    (resp) => {
      if (resp) {
        typeof callback === 'function' && callback();
      }
    }
  );

export const AddRequestToGroupData = AddRequestToGroupAPI.dataSelector;
export const AddRequestToGroupError = AddRequestToGroupAPI.errorSelector;
export const AddRequestToGroupResetter = getResetter(AddRequestToGroupAPI);

// Add supplier to group
const AddSupplierToGroupAPI = makeFetchAction(
  ADD_SUPPLIER_TO_GROUP,
  ({ groupId, supplierIds }) =>
    nfetch({
      endpoint: '/api/Group/Suppliers',
      method: 'PUT'
    })({ groupId, supplierIds })
);

export const addSupplierToGroup = ({ groupId, supplierIds, callback }) =>
  respondToSuccess(
    AddSupplierToGroupAPI.actionCreator({ groupId, supplierIds }),
    (resp, header, store) => {
      if (resp) {
        typeof callback === 'function' && callback();
        store.dispatch(getGroupDetails(groupId));
      }
    }
  );

export const AddSupplierToGroupData = AddSupplierToGroupAPI.dataSelector;
export const AddSupplierToGroupError = AddSupplierToGroupAPI.errorSelector;
export const AddSupplierToGroupResetter = getResetter(AddSupplierToGroupAPI);

//Get Group By Product Id
const GetGroupByProductIdAPI = makeFetchAction(
  GET_GROUP_BY_PRODUCT_ID,
  (productId, pageIndex, pageSize) =>
    nfetch({
      endpoint: `/api/Group/Filter?productId=${productId}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      method: 'GET'
    })()
);

export const getGroupByProductId = (productId, pageIndex, pageSize) =>
  respondToSuccess(
    GetGroupByProductIdAPI.actionCreator(productId, pageIndex, pageSize)
  );
export const GetGroupByProductIdData = GetGroupByProductIdAPI.dataSelector;
export const GetGroupByProductIdError = GetGroupByProductIdAPI.errorSelector;
export const GetGroupByProductIdResetter = getResetter(GetGroupByProductIdAPI);

// Get Group Paging
const GetGroupPagingAPI = makeFetchAction(
  GET_GROUP_PAGING,
  ({
    categoryId,
    productName,
    fromDate,
    toDate,
    pageIndex,
    pageSize,
    status
  }) => {
    return nfetch({
      endpoint: `/api/Group/Filter${generateQuery({
        categoryId,
        groupNameOrProductName: productName,
        fromDate,
        toDate,
        pageSize,
        pageIndex,
        orderByDateDescending: 'true',
        status
      })}`,
      method: 'GET'
    })();
  }
);

export const getGroupPaging = ({
  categoryId,
  productName,
  fromDate,
  toDate,
  pageIndex,
  pageSize,
  status
}) =>
  respondToSuccess(
    GetGroupPagingAPI.actionCreator({
      categoryId,
      productName,
      fromDate,
      toDate,
      pageIndex,
      pageSize,
      status
    }),
    () => {}
  );

export const GetGroupPagingData = GetGroupPagingAPI.dataSelector;
export const GetGroupPagingError = GetGroupPagingAPI.errorSelector;
export const GetGroupPagingResetter = getResetter(GetGroupPagingAPI);

// Get Group Not Having Supplier Paging
const GetGroupNotHavingSupplierPagingAPI = makeFetchAction(
  GET_GROUP_NOT_HAVING_SUPPLIER,
  ({
    categoryId,
    productName,
    fromDate,
    toDate,
    pageIndex,
    pageSize,
    status,
    productId
  }) => {
    return nfetch({
      endpoint: `/api/Group/FilterByNotHavingSuitableSupplier${generateQuery({
        categoryId,
        groupNameOrProductName: productName,
        productId,
        fromDate,
        toDate,
        pageSize,
        pageIndex,
        orderByDateDescending: 'true',
        status
      })}`,
      method: 'GET'
    })();
  }
);

export const getGroupNotHavingSupplierPaging = ({
  categoryId,
  productName,
  fromDate,
  toDate,
  pageIndex,
  pageSize,
  status,
  productId
}) =>
  respondToSuccess(
    GetGroupNotHavingSupplierPagingAPI.actionCreator({
      categoryId,
      productName,
      fromDate,
      toDate,
      pageIndex,
      pageSize,
      status,
      productId
    }),
    () => {}
  );

export const GetGroupNotHavingSupplierPagingData =
  GetGroupNotHavingSupplierPagingAPI.dataSelector;
export const GetGroupNotHavingSupplierPagingError =
  GetGroupNotHavingSupplierPagingAPI.errorSelector;
export const GetGroupNotHavingSupplierPagingResetter = getResetter(
  GetGroupNotHavingSupplierPagingAPI
);

// Get Group Having Supplier Paging
const GetGroupHavingSupplierPagingAPI = makeFetchAction(
  GET_GROUP_HAVING_SUPPLIER,
  ({
    categoryId,
    productName,
    fromDate,
    toDate,
    pageIndex,
    pageSize,
    status,
    productId
  }) => {
    return nfetch({
      endpoint: `/api/Group/FilterByHavingSuitableSupplier${generateQuery({
        categoryId,
        groupNameOrProductName: productName,
        productId,
        fromDate,
        toDate,
        pageSize,
        pageIndex,
        orderByDateDescending: 'true',
        status
      })}`,
      method: 'GET'
    })();
  }
);

export const getGroupHavingSupplierPaging = ({
  categoryId,
  productName,
  fromDate,
  toDate,
  pageIndex,
  pageSize,
  status,
  productId
}) =>
  respondToSuccess(
    GetGroupHavingSupplierPagingAPI.actionCreator({
      categoryId,
      productName,
      fromDate,
      toDate,
      pageIndex,
      pageSize,
      status,
      productId
    }),
    () => {}
  );

export const GetGroupHavingSupplierPagingData =
  GetGroupHavingSupplierPagingAPI.dataSelector;
export const GetGroupHavingSupplierPagingError =
  GetGroupHavingSupplierPagingAPI.errorSelector;
export const GetGroupHavingSupplierPagingResetter = getResetter(
  GetGroupHavingSupplierPagingAPI
);

// Aggregator accept group
const AcceptGroupAPI = makeFetchAction(ACCEPT_GROUP, ({ groupId, groupName }) =>
  nfetch({
    endpoint: '/api/Group/AggregatorAcceptedGroup',
    method: 'PUT'
  })({ groupId, groupName })
);

export const acceptGroup = ({ groupId, groupName, description, callback }) =>
  respondToSuccess(
    AcceptGroupAPI.actionCreator({ groupId, groupName, description }),
    (resp) => {
      if (resp) {
        typeof callback === 'function' && callback();
      }
    }
  );

export const AcceptGroupData = AcceptGroupAPI.dataSelector;
export const AcceptGroupError = AcceptGroupAPI.errorSelector;
export const AcceptGroupResetter = getResetter(AcceptGroupAPI);

// Group details
const GetGroupDetailsAPI = makeFetchAction(GET_GROUP_DETAILS, (id) =>
  nfetch({
    endpoint: `/api/Group?groupId=${id}`,
    method: 'GET'
  })()
);

export const getGroupDetails = (id) =>
  respondToSuccess(GetGroupDetailsAPI.actionCreator(id));
export const GetGroupDetailsData = GetGroupDetailsAPI.dataSelector;
export const GetGroupDetailsError = GetGroupDetailsAPI.errorSelector;
export const GetGroupDetailsResetter = getResetter(GetGroupDetailsAPI);

// Remove request to group
const RemoveRequestFromGroupAPI = makeFetchAction(
  REMOVE_REQUEST_FROM_GROUP,
  ({ groupId, requestId }) =>
    nfetch({
      endpoint: '/api/Group/Requests',
      method: 'DELETE'
    })({ groupId, requestId })
);

export const removeRequestFromGroup = ({ groupId, requestId, callback }) =>
  respondToSuccess(
    RemoveRequestFromGroupAPI.actionCreator({ groupId, requestId }),
    (resp) => {
      if (resp) {
        typeof callback === 'function' && callback();
      }
    }
  );

export const RemoveRequestFromGroupData =
  RemoveRequestFromGroupAPI.dataSelector;
export const RemoveRequestFromGroupError =
  RemoveRequestFromGroupAPI.errorSelector;
export const RemoveRequestFromGroupResetter = getResetter(
  RemoveRequestFromGroupAPI
);
