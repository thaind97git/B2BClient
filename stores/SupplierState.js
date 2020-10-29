import { makeFetchAction } from "redux-api-call";
import { getResetter } from "../libs";
import nfetch from "../libs/nfetch";
import { respondToSuccess } from "../middlewares/api-reaction";

const GET_SUPPLIER_BY_GROUP_ID = "GetSupplierByGroupIdAPI";

// Get Request By Group Id
const GetSupplierByGroupIdAPI = makeFetchAction(
  GET_SUPPLIER_BY_GROUP_ID,
  ({ groupId, pageIndex, pageSize }) =>
    nfetch({
      endpoint: `/api/Group/Suppliers?groupId=${groupId}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      method: "GET",
    })()
);

export const getSupplierByGroupId = ({
  groupId,
  pageIndex = 1,
  pageSize = 10,
}) =>
  respondToSuccess(
    GetSupplierByGroupIdAPI.actionCreator({ groupId, pageIndex, pageSize })
  );
export const GetSupplierByGroupIdData = GetSupplierByGroupIdAPI.dataSelector;
export const GetSupplierByGroupIdError = GetSupplierByGroupIdAPI.errorSelector;
export const GetSupplierByGroupIdResetter = getResetter(
  GetSupplierByGroupIdAPI
);
