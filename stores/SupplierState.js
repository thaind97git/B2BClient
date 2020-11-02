import { makeFetchAction } from "redux-api-call";
import { generateQuery, getResetter } from "../libs";
import nfetch from "../libs/nfetch";
import { respondToSuccess } from "../middlewares/api-reaction";
import { DEFAULT_PAGING_INFO } from "../utils";
import { getBuyerPaging } from "./BuyerState";

const GET_SUPPLIER_BY_GROUP_ID = "GetSupplierByGroupIdAPI";
const GET_SUPPLIER_PAGING = "GetSupplierPagingAPI";
export const BAN_USER = "BanUserAPI";
export const UN_BAN_USER = "UnBanUserAPI";
const GET_SUPPLIER_BY_PRODUCT_ID = "GetSupplierByProductIdAPI";
const GET_USER_DETAILS = "GetUserDetailsAPI";
export const SUPPLIER_REGISTER_PRODUCT = "SupplierRegisterProductAPI";
export const SUPPLIER_UPDATE_QUOTATION = "SupplierUpdateQuotationAPI";

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
  GET_SUPPLIER_BY_PRODUCT_ID,
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

export const banUser = ({ id, description, isSupplier = true }) =>
  respondToSuccess(
    BanUserAPI.actionCreator({ id, description }),
    (resp, _, store) => {
      if (resp) {
        store.dispatch(
          isSupplier
            ? getSupplierPaging({
                pageIndex: DEFAULT_PAGING_INFO.page,
                pageSize: DEFAULT_PAGING_INFO.pageSize,
              })
            : getBuyerPaging({
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

export const unBanUser = ({ id, isSupplier = true }) =>
  respondToSuccess(UnBanUserAPI.actionCreator({ id }), (resp, _, store) => {
    if (resp) {
      store.dispatch(
        isSupplier
          ? getSupplierPaging({
              pageIndex: DEFAULT_PAGING_INFO.page,
              pageSize: DEFAULT_PAGING_INFO.pageSize,
            })
          : getBuyerPaging({
              pageIndex: DEFAULT_PAGING_INFO.page,
              pageSize: DEFAULT_PAGING_INFO.pageSize,
            })
      );
    }
  });
export const UnBanUserData = UnBanUserAPI.dataSelector;
export const UnBanUserError = UnBanUserAPI.errorSelector;
export const UnBanUserResetter = getResetter(UnBanUserAPI);

// Register Product
const SupplierRegisterProductAPI = makeFetchAction(
  SUPPLIER_REGISTER_PRODUCT,
  ({ productId, description }) =>
    nfetch({
      endpoint: "/api/Supplier/Product",
    })({
      productId,
      description,
    })
);

export const supplierRegisterProduct = ({ productId, description }) =>
  respondToSuccess(
    SupplierRegisterProductAPI.actionCreator({ productId, description })
  );
export const SupplierRegisterProductData =
  SupplierRegisterProductAPI.dataSelector;
export const SupplierRegisterProductError =
  SupplierRegisterProductAPI.errorSelector;
export const SupplierRegisterProductResetter = getResetter(
  SupplierRegisterProductAPI
);

// Update Quotation
const SupplierUpdateQuotationAPI = makeFetchAction(
  SUPPLIER_UPDATE_QUOTATION,
  ({ id, description }) =>
    nfetch({
      endpoint: "/api/Supplier/Product",
    })({
      id,
      description,
    })
);

export const supplierUpdateQuotation = ({ id, description }) =>
  respondToSuccess(
    SupplierUpdateQuotationAPI.actionCreator({ id, description })
  );
export const SupplierUpdateQuotationData =
  SupplierUpdateQuotationAPI.dataSelector;
export const SupplierUpdateQuotationError =
  SupplierUpdateQuotationAPI.errorSelector;
export const SupplierUpdateQuotationResetter = getResetter(
  SupplierUpdateQuotationAPI
);
