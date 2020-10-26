import { makeFetchAction } from "redux-api-call";

import { respondToSuccess } from "../middlewares/api-reaction";
import nfetch from "../libs/nfetch";
import { getResetter } from "../libs";

const CREATE_NEW_GROUP = "CreateNewGroupAPI";
const ADD_REQUEST_TO_GROUP = "AddRequestToGroupAPI";

// Create new group
const CreateNewGroupAPI = makeFetchAction(
  CREATE_NEW_GROUP,
  ({ groupName, productId, description }) =>
    nfetch({
      endpoint: "/api/Group",
    })({ groupName, productId, description })
);

export const createNewGroup = ({ groupName, productId, description }) =>
  respondToSuccess(
    CreateNewGroupAPI.actionCreator({ groupName, productId, description })
  );

export const CreateNewGroupData = CreateNewGroupAPI.dataSelector;
export const CreateNewGroupError = CreateNewGroupAPI.errorSelector;
export const CreateNewGroupResetter = getResetter(CreateNewGroupAPI);

// Add request to group

const AddRequestToGroupAPI = makeFetchAction(
  CREATE_NEW_GROUP,
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
