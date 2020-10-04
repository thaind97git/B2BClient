import { compact, concat, flow, join } from "lodash/fp";

export const getResetter = (api) =>
  typeof api === "object" && api.resetter(["data", "error"]);

export const createLink = flow(compact, concat([""]), join("/"));
