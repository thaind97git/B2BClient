import { makeFetchAction } from "redux-api-call";
import { generateQuery, getResetter } from "../libs";
import nfetch from "../libs/nfetch";
import { respondToSuccess } from "../middlewares/api-reaction";
import { DEFAULT_PAGING_INFO } from "../utils";

const GET_SUPPLIER_BY_GROUP_ID = "GetSupplierByGroupIdAPI";
const GET_SUPPLIER_PAGING = "GetSupplierPagingAPI";
const BAN_USER = "BanUserAPI";
const UN_BAN_USER = "UnBanUserAPI";
const GET_SUPPLIER_BY_PRODUCT_ID = "GetSupplierByProductIdAPI";

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

// Get Supplier By Product Id
const GetSupplierByProductIdAPI = makeFetchAction(
  GET_SUPPLIER_BY_GROUP_ID,
  ({ productId, pageIndex, pageSize }) =>
    nfetch({
      endpoint: `/api/Supplier/Product${generateQuery({
        productId,
        pageIndex,
        pageSize,
      })}`,
      method: "GET",
    })()
);

export const getSupplierByProductId = ({
  productId,
  pageIndex = 1,
  pageSize = 10,
}) =>
  respondToSuccess(
    GetSupplierByProductIdAPI.actionCreator({ productId, pageIndex, pageSize })
  );
export const GetSupplierByProductIdData =
  GetSupplierByProductIdAPI.dataSelector;
export const GetSupplierByProductIdError =
  GetSupplierByProductIdAPI.errorSelector;
export const GetSupplierByProductIdResetter = getResetter(
  GetSupplierByProductIdAPI
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
const BanUserAPI = makeFetchAction(BAN_USER, ({ id, description }) =>
  nfetch({
    endpoint: `/api/Supplier/BanUser`,
    method: "PUT",
  })({ id, description })
);

export const banUser = ({ id, description }) =>
  respondToSuccess(
    BanUserAPI.actionCreator({ id, description }),
    (resp, _, store) => {
      if (resp) {
        store.dispatch(
          getSupplierPaging({
            pageIndex: DEFAULT_PAGING_INFO.page,
            pageSize: DEFAULT_PAGING_INFO.pageSize,
          })
        );
      }
    }
  );
export const BanUserData = BanUserAPI.dataSelector;
export const BanUserError = BanUserAPI.errorSelector;
export const BanUserResetter = getResetter(BanUserAPI);

//Un Ban Supplier
const UnBanUserAPI = makeFetchAction(UN_BAN_USER, ({ id }) =>
  nfetch({
    endpoint: `/api/Supplier/UnBanUser/${id}`,
    method: "PUT",
  })()
);

export const unBanUser = ({ id }) =>
  respondToSuccess(UnBanUserAPI.actionCreator({ id }), (resp, _, store) => {
    if (resp) {
      store.dispatch(
        getSupplierPaging({
          pageIndex: DEFAULT_PAGING_INFO.page,
          pageSize: DEFAULT_PAGING_INFO.pageSize,
        })
      );
    }
  });
export const UnBanUserData = UnBanUserAPI.dataSelector;
export const UnBanUserError = UnBanUserAPI.errorSelector;
export const UnBanUserResetter = getResetter(UnBanUserAPI);
