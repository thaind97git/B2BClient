import { compact, concat, flow, join } from "lodash/fp";

export const getResetter = (api) =>
  typeof api === "object" && api.resetter(["data", "error"]);

export const createLink = flow(compact, concat([""]), join("/"));

export const getCategorySelected = flow(compact, concat([""]), join(" >> "));

export const generateQuery = (objectParams = {}) => {
  let query = "?";
  let arrayQuery = [];
  for (let i in objectParams) {
    const value = objectParams[i];
    if (!!value || (Array.isArray(value) && value.length > 0)) {
      arrayQuery.push(`${i}=${value}`);
    }
  }
  return (query += arrayQuery.join("&"));
};
