import { createStore, compose, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import { compact } from "lodash/fp";
import { createWrapper } from "next-redux-wrapper";
import { middleware as apiReactionMiddleware } from "../middlewares/api-reaction";
import { isServer } from "../utils";
import apiMiddlewares from "../middlewares";
import apiPrefix from "../middlewares/api-prefix";
import rootReducer from "./rootReducer";

const env = process.env.NODE_ENV || "development";

const logger = () => (next) => (action) => {
  isServer && env === "development" && console.log("REDUX: %s", action.type);
  return next(action);
};

const makeStore = () => {
  const base = process.env.API_SERVER_URL || "http://localhost:3003";
  const enhancers = compact([
    applyMiddleware(
      logger,
      reduxThunk,
      apiPrefix(base),
      apiMiddlewares,
      apiReactionMiddleware
    ),
    typeof window !== "undefined" &&
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__(),
  ]);

  const store = createStore(rootReducer, {}, compose(...enhancers));

  if (module.hot) {
    module.hot.accept("./rootReducer", () => {
      const newReducer = require("./rootReducer").default;

      store.replaceReducer(newReducer);
    });
  }

  return store;
};
export const wrapper = createWrapper(makeStore);
