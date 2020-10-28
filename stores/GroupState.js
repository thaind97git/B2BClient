import { makeFetchAction } from "redux-api-call";

import { respondToSuccess } from "../middlewares/api-reaction";
import nfetch from "../libs/nfetch";
import { getResetter } from "../libs";

const CREATE_NEW_GROUP = "CreateNewGroupAPI";
const ADD_REQUEST_TO_GROUP = "AddRequestToGroupAPI";
const GET_GROUP_BY_PRODUCT_ID = "GetGroupByProductIdAPI";

// Create new group
const CreateNewGroupAPI = makeFetchAction(
  CREATE_NEW_GROUP,
  ({ groupName, requestIds, description }) =>
    nfetch({
      endpoint: "/api/Group",
    })({ groupName, requestIds, description })
);

export const createNewGroup = ({ groupName, requestIds, description }) =>
  respondToSuccess(
    CreateNewGroupAPI.actionCreator({ groupName, requestIds, description })
  );

export const CreateNewGroupData = CreateNewGroupAPI.dataSelector;
export const CreateNewGroupError = CreateNewGroupAPI.errorSelector;
export const CreateNewGroupResetter = getResetter(CreateNewGroupAPI);

// Add request to group

const AddRequestToGroupAPI = makeFetchAction(
  ADD_REQUEST_TO_GROUP,
  ({ groupId, requestIds }) =>
    nfetch({
      endpoint: "/api/Group/RequestToGroup",
      method: "PUT",
    })({ groupId, requestIds })
);

export const addRequestToGroup = ({ groupId, requestIds }) =>
  respondToSuccess(AddRequestToGroupAPI.actionCreator({ groupId, requestIds }));

export const AddRequestToGroupData = AddRequestToGroupAPI.dataSelector;
export const AddRequestToGroupError = AddRequestToGroupAPI.errorSelector;
export const AddRequestToGroupResetter = getResetter(AddRequestToGroupAPI);

//Get Group By Product Id
const GetGroupByProductIdAPI = makeFetchAction(
  GET_GROUP_BY_PRODUCT_ID,
  (productId) =>
    nfetch({
      endpoint: `/api/Group/Filter?productId=${productId}`,
      method: "GET",
    })()
);

export const getGroupByProductId = (productId) =>
  respondToSuccess(GetGroupByProductIdAPI.actionCreator(productId));
export const GetGroupByProductIdData = GetGroupByProductIdAPI.dataSelector;
export const GetGroupByProductIdError = GetGroupByProductIdAPI.errorSelector;
export const GetGroupByProductIdResetter = getResetter(GetGroupByProductIdAPI);
