import { identity, pickBy } from "lodash/fp";
import { getToken } from "./localStorage";

export const formatObj = pickBy(identity);

const getHeaders = (options = {}) =>
  Object.assign(
    {},
    {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    formatObj(options)
  );

export default getHeaders;
