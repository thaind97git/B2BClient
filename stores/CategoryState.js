import { makeFetchAction } from "redux-api-call";
import { get, flow } from "lodash/fp";

import { respondToSuccess } from "../middlewares/api-reaction";
import { createErrorSelector } from "../utils";
import nfetch from "../libs/nfetch";
import { getResetter } from "../libs";

const GET_CATEGORY = "GET_CATEGORY";
const GET_PARENT_CATEGORY = "GET_PARENT_CATEGORY";
const GET_CHILD_CATEGORY = "GET_CHILD_CATEGORY";
export const ADD_NEW_CATEGORY = "ADD_NEW_CATEGORY";
export const DELETE_CATEGORY = "DELETE_CATEGORY";
export const UPDATE_CATEGORY = "UPDATE_CATEGORY";
export const GET_CATEGORY_BY_ID = "GET_CATEGORY_BY_ID";

// Service
export const ADD_NEW_SERVICE = "ADD_NEW_SERVICE";
export const UPDATE_SERVICE = "UPDATE_SERVICE";
export const GET_SERVICE_BY_ID = "GET_SERVICE_BY_ID";

//Get category
const GetCategoriesAPI = makeFetchAction(GET_CATEGORY, () =>
  nfetch({
    endpoint: `/api/Category`,
    method: "GET",
  })()
);
export const getCategories = () =>
  respondToSuccess(GetCategoriesAPI.actionCreator({}), () => {});
export const GetCategoriesDataSelector = GetCategoriesAPI.dataSelector;

// GET PARENT CATEGORY
const GetParentCategoryAPI = makeFetchAction(
  GET_PARENT_CATEGORY,
  (categoryId) =>
    nfetch({
      endpoint: `/api/Category/ParentCategory${
        categoryId ? `?childId=${categoryId}` : ""
      }`,
      method: "GET",
    })()
);

export const getParentCategory = (categoryId) =>
  respondToSuccess(
    GetParentCategoryAPI.actionCreator(categoryId),
    (resp, _, store) => {
      console.log({ resp });
      if (resp) {
        store.dispatch(getChildCategoryResetter);
      }
    }
  );

export const parentCategoryDataSelector = GetParentCategoryAPI.dataSelector;
export const parentCategoryErrorSelector = createErrorSelector(
  GetParentCategoryAPI
);
export const getParentCategoryResetter = getResetter(GetParentCategoryAPI);

// GET CHILD CATEGORY
const GetChildCategoryAPI = makeFetchAction(GET_CHILD_CATEGORY, (parentId) =>
  nfetch({
    endpoint: `/api/Category/SubCategory/${parentId}`,
    method: "GET",
  })()
);

export const getChildCategory = (parentId) =>
  respondToSuccess(
    GetChildCategoryAPI.actionCreator(parentId),
    (resp, _, store) => {
      console.log({ resp });
      if (resp) {
        store.dispatch(getParentCategoryResetter);
      }
    }
  );
export const childCategoryDataSelector = GetChildCategoryAPI.dataSelector;
export const childCategoryErrorSelector = createErrorSelector(
  GetChildCategoryAPI
);
export const getChildCategoryResetter = getResetter(GetChildCategoryAPI);
