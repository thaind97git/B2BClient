import { makeFetchAction } from "redux-api-call";
import { respondToSuccess } from "../middlewares/api-reaction";
import nfetch from "../libs/nfetch";
import { getResetter } from "../libs";
import { getToken } from "../libs/localStorage";
import Router from "next/router";
import { openNotification } from "../utils";

const GET_PRODUCT_BY_CATEGORY = "GetProductByCategoryAPI";
const GET_PRODUCT_DETAILS = "GetProductDetailsAPI";
const CREATE_PRODUCT = "CreateProductAPI";

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
const GetProductDetailsAPI = makeFetchAction(GET_PRODUCT_DETAILS, (id) =>
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

// Create product
const onUploadImage = (productId, fileList) => {
  const listFileOrigin = fileList.map((file) => file.originFileObj);
  const formData = new FormData();
  for (let file of listFileOrigin) {
    formData.append("files", file);
  }

  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${getToken()}`);
  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: formData,
  };

  fetch(
    `http://103.92.29.179:1234/api/Product/ProductImage/${productId}`,
    requestOptions
  );
};

const CreateProductAPI = makeFetchAction(CREATE_PRODUCT, (product) =>
  nfetch({
    endpoint: "/api/Product",
  })(product)
);

export const createNewProduct = (product, fileList) =>
  respondToSuccess(CreateProductAPI.actionCreator(product), (resp) => {
    if (resp) {
      openNotification("success", {
        message: "Create new product success !",
      });
      onUploadImage(resp, fileList);
      Router.push("/admin/product");
    }
  });

export const CreateNewProductData = CreateProductAPI.dataSelector;
export const CreateNEwProductError = CreateProductAPI.errorSelector;
export const CreateNewProductResetter = getResetter(CreateProductAPI);
