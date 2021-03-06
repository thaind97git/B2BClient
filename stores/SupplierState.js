import { makeFetchAction } from 'redux-api-call';
import { generateQuery, getResetter } from '../libs';
import nfetch from '../libs/nfetch';
import { respondToSuccess } from '../middlewares/api-reaction';
import { DEFAULT_PAGING_INFO } from '../utils';
import { getBuyerPaging } from './BuyerState';
import { getProductBySupplier, getProductForSupplier } from './ProductState';

const GET_SUPPLIER_BY_GROUP_ID = 'GetSupplierByGroupIdAPI';
const GET_SUPPLIER_PAGING = 'GetSupplierPagingAPI';
export const BAN_USER = 'BanUserAPI';
export const UN_BAN_USER = 'UnBanUserAPI';
export const APPROVE_USER = 'ApproveUserAPI';
export const REJECT_USER = 'RejectUserAPI';
const GET_SUPPLIER_BY_PRODUCT_ID = 'GetSupplierByProductIdAPI';
export const SUPPLIER_REGISTER_PRODUCT = 'SupplierRegisterProductAPI';
export const SUPPLIER_UPDATE_QUOTATION = 'SupplierUpdateQuotationAPI';
export const DELETE_SUPPLIER_PRODUCT = 'DeleteSupplierProductAPI';
export const ACTIVE_SUPPLIER_PRODUCT = 'ActiveSupplierProductAPI';

export const IGNORE_SUPPLIER = 'IgnoreSupplierAPI';
export const UN_IGNORE_SUPPLIER = 'UnIgnoreSupplierAPI';

// Get Supplier By Group Id
const GetSupplierByGroupIdAPI = makeFetchAction(
  GET_SUPPLIER_BY_GROUP_ID,
  ({ groupId, pageIndex, pageSize }) =>
    nfetch({
      endpoint: `/api/Group/Suppliers${generateQuery({
        groupId,
        pageIndex,
        pageSize
      })}`,
      method: 'GET'
    })()
);

export const getSupplierByGroupId = ({
  groupId,
  pageIndex = 1,
  pageSize = 10
}) =>
  respondToSuccess(
    GetSupplierByGroupIdAPI.actionCreator({ groupId, pageIndex, pageSize })
  );
export const GetSupplierByGroupIdData = GetSupplierByGroupIdAPI.dataSelector;
export const GetSupplierByGroupIdError = GetSupplierByGroupIdAPI.errorSelector;
export const GetSupplierByGroupIdResetter = getResetter(
  GetSupplierByGroupIdAPI
);

// Get Supplier By Product For Group Id
const GetSupplierByProductIdAPI = makeFetchAction(
  GET_SUPPLIER_BY_PRODUCT_ID,
  ({ productId, pageIndex, pageSize, groupId }) =>
    nfetch({
      endpoint: `/api/Supplier/Product${generateQuery({
        productId,
        groupId,
        pageIndex,
        pageSize
      })}`,
      method: 'GET'
    })()
);

export const getSupplierByProductId = ({
  productId,
  pageIndex = 1,
  pageSize = 10,
  groupId
}) =>
  respondToSuccess(
    GetSupplierByProductIdAPI.actionCreator({
      productId,
      pageIndex,
      pageSize,
      groupId
    })
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
  ({ pageIndex, pageSize, statusId, email, rateFrom, rateTo }) =>
    nfetch({
      endpoint: `/api/Supplier/Filter${generateQuery({
        statusId,
        email,
        pageIndex,
        pageSize,
        rateFrom,
        rateTo
      })}`,
      method: 'GET'
    })()
);

export const getSupplierPaging = ({
  statusId,
  email,
  pageIndex = 1,
  pageSize = 10,
  rateFrom,
  rateTo
}) =>
  respondToSuccess(
    GetSupplierPagingAPI.actionCreator({
      statusId,
      email,
      pageIndex,
      pageSize,
      rateFrom,
      rateTo
    })
  );
export const GetSupplierPagingData = GetSupplierPagingAPI.dataSelector;
export const GetSupplierPagingError = GetSupplierPagingAPI.errorSelector;
export const GetSupplierPagingResetter = getResetter(GetSupplierPagingAPI);

// Ban Supplier
const BanUserAPI = makeFetchAction(BAN_USER, ({ id, description }) =>
  nfetch({
    endpoint: `/api/Supplier/BanUser`,
    method: 'PUT'
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
                pageSize: DEFAULT_PAGING_INFO.pageSize
              })
            : getBuyerPaging({
                pageIndex: DEFAULT_PAGING_INFO.page,
                pageSize: DEFAULT_PAGING_INFO.pageSize
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
    method: 'PUT'
  })()
);

export const unBanUser = ({ id, isSupplier = true }) =>
  respondToSuccess(UnBanUserAPI.actionCreator({ id }), (resp, _, store) => {
    if (resp) {
      store.dispatch(
        isSupplier
          ? getSupplierPaging({
              pageIndex: DEFAULT_PAGING_INFO.page,
              pageSize: DEFAULT_PAGING_INFO.pageSize
            })
          : getBuyerPaging({
              pageIndex: DEFAULT_PAGING_INFO.page,
              pageSize: DEFAULT_PAGING_INFO.pageSize
            })
      );
    }
  });
export const UnBanUserData = UnBanUserAPI.dataSelector;
export const UnBanUserError = UnBanUserAPI.errorSelector;
export const UnBanUserResetter = getResetter(UnBanUserAPI);

//Approve Supplier
const ApproveSupplierAPI = makeFetchAction(APPROVE_USER, ({ id }) =>
  nfetch({
    endpoint: `/api/Supplier/ApproveSupplier/${id}`,
    method: 'PUT'
  })()
);

export const approveSupplier = ({ id }) =>
  respondToSuccess(
    ApproveSupplierAPI.actionCreator({ id }),
    (resp, _, store) => {
      if (resp) {
        store.dispatch(
          getSupplierPaging({
            pageIndex: DEFAULT_PAGING_INFO.page,
            pageSize: DEFAULT_PAGING_INFO.pageSize
          })
        );
      }
    }
  );
export const ApproveSupplierData = ApproveSupplierAPI.dataSelector;
export const ApproveSupplierError = ApproveSupplierAPI.errorSelector;
export const ApproveSupplierResetter = getResetter(ApproveSupplierAPI);

//Reject Supplier
const RejectSupplierAPI = makeFetchAction(REJECT_USER, ({ id }) =>
  nfetch({
    endpoint: `/api/Supplier/RejectSupplier/${id}`,
    method: 'PUT'
  })()
);

export const rejectSupplier = ({ id }) =>
  respondToSuccess(
    RejectSupplierAPI.actionCreator({ id }),
    (resp, _, store) => {
      if (resp) {
        store.dispatch(
          getSupplierPaging({
            pageIndex: DEFAULT_PAGING_INFO.page,
            pageSize: DEFAULT_PAGING_INFO.pageSize
          })
        );
      }
    }
  );
export const RejectSupplierData = RejectSupplierAPI.dataSelector;
export const RejectSupplierError = RejectSupplierAPI.errorSelector;
export const RejectSupplierResetter = getResetter(RejectSupplierAPI);

//Approve Buyer
const ApproveBuyerAPI = makeFetchAction(APPROVE_USER, ({ id }) =>
  nfetch({
    endpoint: `/api/Supplier/ApproveSupplier/${id}`,
    method: 'PUT'
  })()
);

export const approveBuyer = ({ id }) =>
  respondToSuccess(
    ApproveBuyerAPI.actionCreator({ id }),
    (resp, _, store) => {
      if (resp) {
        store.dispatch(
          getBuyerPaging({
            pageIndex: DEFAULT_PAGING_INFO.page,
            pageSize: DEFAULT_PAGING_INFO.pageSize
          })
        );
      }
    }
  );
export const ApproveBuyerData = ApproveBuyerAPI.dataSelector;
export const ApproveBuyerError = ApproveBuyerAPI.errorSelector;
export const ApproveBuyerResetter = getResetter(ApproveBuyerAPI);

//Reject Supplier
const RejectBuyerAPI = makeFetchAction(REJECT_USER, ({ id }) =>
  nfetch({
    endpoint: `/api/Supplier/RejectSupplier/${id}`,
    method: 'PUT'
  })()
);

export const rejectBuyer = ({ id }) =>
  respondToSuccess(
    RejectBuyerAPI.actionCreator({ id }),
    (resp, _, store) => {
      if (resp) {
        store.dispatch(
          getBuyerPaging({
            pageIndex: DEFAULT_PAGING_INFO.page,
            pageSize: DEFAULT_PAGING_INFO.pageSize
          })
        );
      }
    }
  );
export const RejectBuyerData = RejectBuyerAPI.dataSelector;
export const RejectBuyerError = RejectBuyerAPI.errorSelector;
export const RejectBuyerResetter = getResetter(RejectBuyerAPI);

// Register Product
const SupplierRegisterProductAPI = makeFetchAction(
  SUPPLIER_REGISTER_PRODUCT,
  ({ productId, description }) =>
    nfetch({
      endpoint: '/api/Supplier/Product'
    })({
      productId,
      description
    })
);

export const supplierRegisterProduct = ({ productId, description, callback }) =>
  respondToSuccess(
    SupplierRegisterProductAPI.actionCreator({ productId, description }),
    () => {
      typeof callback === 'function' && callback();
    }
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
  ({ productId, description }) =>
    nfetch({
      endpoint: '/api/Supplier/Product',
      method: 'PUT'
    })({
      productId,
      description
    })
);

export const supplierUpdateQuotation = ({ productId, description, callback }) =>
  respondToSuccess(
    SupplierUpdateQuotationAPI.actionCreator({ productId, description }),
    () => {
      typeof callback === 'function' && callback();
    }
  );
export const SupplierUpdateQuotationData =
  SupplierUpdateQuotationAPI.dataSelector;
export const SupplierUpdateQuotationError =
  SupplierUpdateQuotationAPI.errorSelector;
export const SupplierUpdateQuotationResetter = getResetter(
  SupplierUpdateQuotationAPI
);

// Delete Supplier Product
const DeleteSupplierProductAPI = makeFetchAction(
  DELETE_SUPPLIER_PRODUCT,
  (id) =>
    nfetch({
      endpoint: `/api/Supplier/Product/${id}`,
      method: 'DELETE'
    })()
);

export const deleteSupplierProduct = (id) =>
  respondToSuccess(
    DeleteSupplierProductAPI.actionCreator(id),
    (_, __, store) => {
      store.dispatch(
        getProductBySupplier({
          pageIndex: DEFAULT_PAGING_INFO.page,
          pageSize: DEFAULT_PAGING_INFO.pageSize,
          productName: '',
          category: ''
        })
      );
    }
  );
export const DeleteSupplierProductData = DeleteSupplierProductAPI.dataSelector;
export const DeleteSupplierProductError =
  DeleteSupplierProductAPI.errorSelector;
export const DeleteSupplierProductResetter = getResetter(
  DeleteSupplierProductAPI
);

// Active Supplier Product
const ActiveSupplierProductAPI = makeFetchAction(
  ACTIVE_SUPPLIER_PRODUCT,
  (id) =>
    nfetch({
      endpoint: `/api/Supplier/Product/Active/${id}`,
      method: 'PUT'
    })()
);

export const activeSupplierProduct = (id) =>
  respondToSuccess(
    ActiveSupplierProductAPI.actionCreator(id),
    (_, __, store) => {
      store.dispatch(
        getProductBySupplier({
          pageIndex: DEFAULT_PAGING_INFO.page,
          pageSize: DEFAULT_PAGING_INFO.pageSize,
          productName: '',
          category: ''
        })
      );
    }
  );
export const ActiveSupplierProductData = ActiveSupplierProductAPI.dataSelector;
export const ActiveSupplierProductError =
  ActiveSupplierProductAPI.errorSelector;
export const ActiveSupplierProductResetter = getResetter(
  ActiveSupplierProductAPI
);

// Ignore Supplier
export const IgnoreSupplierAPI = makeFetchAction(
  IGNORE_SUPPLIER,
  (conversationId) =>
    nfetch({
      method: 'PUT',
      endpoint: `/api/Conversation/Ignore/${conversationId}`
    })()
);
export const ignoreSupplier = (conversationId, callback) =>
  respondToSuccess(IgnoreSupplierAPI.actionCreator(conversationId), () => {
    typeof callback === 'function' && callback();
  });
export const IgnoreSupplierData = IgnoreSupplierAPI.dataSelector;
export const IgnoreSupplierError = IgnoreSupplierAPI.errorSelector;
export const IgnoreSupplierResetter = getResetter(IgnoreSupplierAPI);

//Un-Ignore Supplier
export const UnIgnoreSupplierAPI = makeFetchAction(
  UN_IGNORE_SUPPLIER,
  (conversationId) =>
    nfetch({
      method: 'PUT',
      endpoint: `/api/Conversation/UnIgnore/${conversationId}`
    })()
);
export const unIgnoreSupplier = (conversationId, callback) =>
  respondToSuccess(UnIgnoreSupplierAPI.actionCreator(conversationId), () => {
    typeof callback === 'function' && callback();
  });
export const UnIgnoreSupplierData = UnIgnoreSupplierAPI.dataSelector;
export const UnIgnoreSupplierError = UnIgnoreSupplierAPI.errorSelector;
export const UnIgnoreSupplierResetter = getResetter(UnIgnoreSupplierAPI);
