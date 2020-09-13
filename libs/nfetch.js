import { flow, identity, join, map, pickBy, toPairs, trim } from "lodash/fp";

import getHeaders from "./getHeaders";

export const objectToQuery = flow(
  pickBy(identity),
  toPairs,
  map((val) => `${val[0]}=${val[1]}`),
  join("&"),
  trim
);

const nfetch = ({ endpoint, method = "POST" }) => (
  variables = {},
  opts = {}
) => {
  if (method === "GET") {
    const query = objectToQuery(variables);
    return {
      endpoint: query ? endpoint + "?" + query : endpoint,
      method,
      headers: getHeaders(opts.headers),
    };
  } else {
    return {
      endpoint,
      method,
      headers: getHeaders(opts.headers),
      body: JSON.stringify(variables),
    };
  }
};
export default nfetch;
