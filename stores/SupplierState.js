import { makeFetchAction } from "redux-api-call";
import { generateQuery, getResetter } from "../libs";
import nfetch from "../libs/nfetch";
import { respondToSuccess } from "../middlewares/api-reaction";

const GET_SUPPLIER_BY_GROUP_ID = "GetSupplierByGroupIdAPI";
const GET_SUPPLIER_PAGING = "GetSupplierPagingAPI";
const BAN_SUPPLIER = "BanSupplierAPI";
const UN_BAN_SUPPLIER = "UnBanSupplierAPI";

// Get Supplier By Group Id
const GetSupplierByGroupIdAPI = makeFetchAction(
  GET_SUPPLIER_BY_GROUP_ID,
  ({ groupId, pageIndex, pageSize }) =>
    nfetch({
      endpoint: `/api/Group/Suppliers${generateQuery({
        groupId,
        pageIndex,
        pageSize,
      })}`,
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

// Get Supplier Paging
const GetSupplierPagingAPI = makeFetchAction(
  GET_SUPPLIER_PAGING,
  ({ pageIndex, pageSize, statusId, email }) =>
    nfetch({
      endpoint: `/api/Supplier/Filter${generateQuery({
        statusId,
        email,
        pageIndex,
        pageSize,
      })}`,
      method: "GET",
    })()
);

export const getSupplierPaging = ({
  statusId,
  email,
  pageIndex = 1,
  pageSize = 10,
}) =>
  respondToSuccess(
    GetSupplierPagingAPI.actionCreator({ statusId, email, pageIndex, pageSize })
  );
export const GetSupplierPagingData = GetSupplierPagingAPI.dataSelector;
export const GetSupplierPagingError = GetSupplierPagingAPI.errorSelector;
export const GetSupplierPagingResetter = getResetter(GetSupplierPagingAPI);

// Ban Supplier
const BanSupplierAPI = makeFetchAction(BAN_SUPPLIER, ({ id, description }) =>
  nfetch({
    endpoint: `/api/Supplier/BanUser`,
    method: "PUT",
  })({ id, description })
);

export const banSupplier = ({ id, description }) =>
  respondToSuccess(BanSupplierAPI.actionCreator({ id, description }));
export const BanSupplierData = BanSupplierAPI.dataSelector;
export const BanSupplierError = BanSupplierAPI.errorSelector;
export const BanSupplierResetter = getResetter(BanSupplierAPI);

//Un Ban Supplier
const UnBanSupplierAPI = makeFetchAction(UN_BAN_SUPPLIER, ({ id }) =>
  nfetch({
    endpoint: `/api/Supplier/UnBanUser/${id}`,
    method: "PUT",
  })()
);

export const unBanSupplier = ({ id }) =>
  respondToSuccess(UnBanSupplierAPI.actionCreator({ id }));
export const UnBanSupplierData = UnBanSupplierAPI.dataSelector;
export const UnBanSupplierError = UnBanSupplierAPI.errorSelector;
export const UnBanSupplierResetter = getResetter(UnBanSupplierAPI);
