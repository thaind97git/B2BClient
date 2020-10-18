import { makeFetchAction } from "redux-api-call";
import { respondToSuccess } from "../middlewares/api-reaction";
import nfetch from "../libs/nfetch";
import { getResetter } from "../libs";

const GET_PRODUCT_BY_CATEGORY = "GetProductByCategoryAPI";
const Get_PRODUCT_DETAILS = "GetProductDetailsAPI";

const GetProductByCategoryAPI = makeFetchAction(
  GET_PRODUCT_BY_CATEGORY,
  (categoryId, pageSize, pageIndex) =>
    nfetch({
      endpoint: `/api/Product/Category?id=${categoryId}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      method: "GET",
    })()
);

export const getProductByCategory = (id, pageSize, pageIndex) =>
  respondToSuccess(
    GetProductByCategoryAPI.actionCreator(id, pageSize, pageIndex),
    (resp) => {
      console.log({ resp });
    }
  );

export const GetProductByCategoryData = GetProductByCategoryAPI.dataSelector;
export const GetProductByCategoryError = GetProductByCategoryAPI.errorSelector;
export const GetProductByCategoryResetter = getResetter(
  GetProductByCategoryAPI
);

// Product Details
const GetProductDetailsAPI = makeFetchAction(Get_PRODUCT_DETAILS, (id) =>
  nfetch({
    endpoint: `/api/Product/${id}`,
    method: "GET",
  })()
);

export const getProductDetails = (id, pageSize, pageIndex) =>
  respondToSuccess(
    GetProductDetailsAPI.actionCreator(id, pageSize, pageIndex),
    (resp) => {
      console.log({ resp });
    }
  );

export const GetProductDetailsData = GetProductDetailsAPI.dataSelector;
export const GetProductDetailsError = GetProductDetailsAPI.errorSelector;
export const GetProductDetailsResetter = getResetter(GetProductDetailsAPI);
