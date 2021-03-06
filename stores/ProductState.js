import { makeFetchAction } from 'redux-api-call';
import { respondToSuccess } from '../middlewares/api-reaction';
import nfetch from '../libs/nfetch';
import { generateQuery, getResetter } from '../libs';
import { getToken } from '../libs/localStorage';
import Router from 'next/router';
import { openNotification } from '../utils';

const GET_PRODUCT_BY_CATEGORY = 'GetProductByCategoryAPI';
const GET_PRODUCT_PAGING = 'GetProductPagingAPI';
const GET_PRODUCT_DETAILS = 'GetProductDetailsAPI';
const GET_SUPPLIER_PRODUCT_DETAILS = 'GetSupplierProductDetailsAPI';
const CREATE_PRODUCT = 'CreateProductAPI';
const UPDATE_PRODUCT = 'UpdateProductAPI';
const GET_PRODUCT_BY_SUPPLIER = 'GetProductBySupplierAPI';
const GET_PRODUCT_FOR_SUPPLIER = 'GetProductForSupplierAPI';
const GET_PRODUCT_SUGGEST = 'GetProductSuggestAPI';
const DELETE_PRODUCT_IMAGES = 'DeleteProductImagesAPI';

const GetProductByCategoryAPI = makeFetchAction(
  GET_PRODUCT_BY_CATEGORY,
  (categoryId, pageSize, pageIndex, name) =>
    nfetch({
      endpoint: `/api/Product/Filter${generateQuery({
        name,
        categoryId,
        pageIndex,
        pageSize
      })}`,
      method: 'GET'
    })()
);

export const getProductByCategory = (id, pageSize, pageIndex, name) =>
  respondToSuccess(
    GetProductByCategoryAPI.actionCreator(id, pageSize, pageIndex, name),
    (resp) => {
      console.log({ resp });
    }
  );

export const GetProductByCategoryData = GetProductByCategoryAPI.dataSelector;
export const GetProductByCategoryError = GetProductByCategoryAPI.errorSelector;
export const GetProductByCategoryResetter = getResetter(
  GetProductByCategoryAPI
);

//Get Product paging
const GetProductPagingAPI = makeFetchAction(
  GET_PRODUCT_PAGING,
  ({ productName, categoryID, pageSize, pageIndex }) => {
    return nfetch({
      endpoint: `/api/Product/Filter${generateQuery({
        categoryId: categoryID,
        name: productName,
        pageSize,
        pageIndex
      })}`,
      method: 'GET'
    })();
  }
);

export const getProductPaging = ({
  productName,
  categoryID,
  pageSize,
  pageIndex
}) =>
  respondToSuccess(
    GetProductPagingAPI.actionCreator({
      productName,
      categoryID,
      pageSize,
      pageIndex
    }),
    () => {}
  );

export const GetProductPagingData = GetProductPagingAPI.dataSelector;
export const GetProductPagingError = GetProductPagingAPI.errorSelector;
export const getProductPagingResetter = getResetter(GetProductPagingAPI);

//Get Product Suggest
const GetProductSuggestAPI = makeFetchAction(
  GET_PRODUCT_SUGGEST,
  ({ pageSize, pageIndex }) => {
    return nfetch({
      endpoint: `/api/Product/Suggest${generateQuery({
        pageSize,
        pageIndex
      })}`,
      method: 'GET'
    })();
  }
);

export const getProductSuggest = ({ pageSize, pageIndex }) =>
  respondToSuccess(
    GetProductSuggestAPI.actionCreator({
      pageSize,
      pageIndex
    }),
    () => {}
  );

export const GetProductSuggestData = GetProductSuggestAPI.dataSelector;
export const GetProductSuggestError = GetProductSuggestAPI.errorSelector;
export const GetProductSuggestResetter = getResetter(GetProductSuggestAPI);

// Product Details
const GetProductDetailsAPI = makeFetchAction(GET_PRODUCT_DETAILS, (id) =>
  nfetch({
    endpoint: `/api/Product/${id}`,
    method: 'GET'
  })()
);

export const getProductDetails = (id) =>
  respondToSuccess(GetProductDetailsAPI.actionCreator(id), () => {});

export const GetProductDetailsData = GetProductDetailsAPI.dataSelector;
export const GetProductDetailsError = GetProductDetailsAPI.errorSelector;
export const GetProductDetailsResetter = getResetter(GetProductDetailsAPI);

//Supplier Product Details
const GetSupplierProductDetailsAPI = makeFetchAction(
  GET_PRODUCT_DETAILS,
  (id) =>
    nfetch({
      endpoint: `/api/Supplier/Product/${id}`,
      method: 'GET'
    })()
);

export const getSupplierProductDetails = (id) =>
  respondToSuccess(GetSupplierProductDetailsAPI.actionCreator(id), () => {});

export const GetSupplierProductDetailsData =
  GetSupplierProductDetailsAPI.dataSelector;
export const GetSupplierProductDetailsError =
  GetSupplierProductDetailsAPI.errorSelector;
export const GetSupplierProductDetailsResetter = getResetter(
  GetSupplierProductDetailsAPI
);

// Create product
const CreateProductAPI = makeFetchAction(CREATE_PRODUCT, (product) =>
  nfetch({
    endpoint: '/api/Product'
  })(product)
);

export const createNewProduct = (product, fileList) =>
  respondToSuccess(CreateProductAPI.actionCreator(product), (resp) => {
    if (resp) {
      openNotification('success', {
        message: 'Create new product success !'
      });
      onUploadImage(resp, fileList);
      Router.push('/admin/product');
    }
  });

export const CreateNewProductData = CreateProductAPI.dataSelector;
export const CreateNewProductError = CreateProductAPI.errorSelector;
export const CreateNewProductResetter = getResetter(CreateProductAPI);

// Update Product
const UpdateProductAPI = makeFetchAction(UPDATE_PRODUCT, (object) =>
  nfetch({
    endpoint: '/api/Product',
    method: 'PUT'
  })(object)
);

export const updateProduct = (product, newFileList, deleteFileList) =>
  respondToSuccess(
    UpdateProductAPI.actionCreator(product),
    (resp) => {
      if (resp) {
        openNotification('success', { message: 'Update product success!' });
        if (newFileList !== null) {
          if (newFileList.length > 0) onUploadImage(resp, newFileList);
        }
        Router.push('/admin/product');
      }
    }
  );
export const UpdateProductData = UpdateProductAPI.dataSelector;
export const UpdateProductError = UpdateProductAPI.errorSelector;
export const UpdateProductResetter = getResetter(UpdateProductAPI);

// Get Product By Supplier Paging table
const GetProductBySupplierAPI = makeFetchAction(
  GET_PRODUCT_BY_SUPPLIER,
  ({ productName, pageSize, pageIndex, category, fromDate, toDate }) =>
    nfetch({
      endpoint: `/api/Supplier/Product/Filter${generateQuery({
        productName,
        categoryId: category,
        fromDate,
        toDate,
        pageIndex,
        pageSize
      })}`,
      method: 'GET'
    })()
);

export const getProductBySupplier = ({
  productName,
  pageSize,
  pageIndex,
  category,
  fromDate,
  toDate
}) =>
  respondToSuccess(
    GetProductBySupplierAPI.actionCreator({
      productName,
      pageSize,
      pageIndex,
      category,
      fromDate,
      toDate
    })
  );

export const GetProductBySupplierData = GetProductBySupplierAPI.dataSelector;
export const GetProductBySupplierError = GetProductBySupplierAPI.errorSelector;
export const GetProductBySupplierResetter = getResetter(
  GetProductBySupplierAPI
);

// Get Product For Supplier Register Sell
const GetProductForSupplierAPI = makeFetchAction(
  GET_PRODUCT_FOR_SUPPLIER,
  ({ productName, pageSize, pageIndex, category }) =>
    nfetch({
      endpoint: `/api/Product/SearchBySupplier${generateQuery({
        name: productName,
        categoryId: category,
        pageIndex,
        pageSize
      })}`,
      method: 'GET'
    })()
);

export const getProductForSupplier = ({
  productName,
  pageSize,
  pageIndex,
  category
}) =>
  respondToSuccess(
    GetProductForSupplierAPI.actionCreator({
      productName,
      pageSize,
      pageIndex,
      category
    })
  );

export const GetProductForSupplierData = GetProductForSupplierAPI.dataSelector;
export const GetProductForSupplierError =
  GetProductForSupplierAPI.errorSelector;
export const GetProductForSupplierResetter = getResetter(
  GetProductForSupplierAPI
);
//Add image
const onUploadImage = (productId, fileList) => {
  const listFileOrigin = fileList.map((file) => file.originFileObj);
  const formData = new FormData();
  for (let file of listFileOrigin) {
    formData.append('files', file);
  }

  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${getToken()}`);
  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: formData
  };

  fetch(
    `${process.env.API_SERVER_URL}/api/Product/ProductImage/${productId}`,
    requestOptions
  );
};

//Delete image
const DeleteProductImageAPI = makeFetchAction(
  DELETE_PRODUCT_IMAGES,
  (deleteFileList) =>
    nfetch({
      endpoint: '/api/Product/DeleteProductImage',
      method: 'PUT'
    })({ ids: deleteFileList })
);

export const deleteProductImage = (deleteFileList) =>
  respondToSuccess(
    DeleteProductImageAPI.actionCreator(deleteFileList),
    (resp) => {}
  );