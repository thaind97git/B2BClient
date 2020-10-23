import {
  camelCase,
  compact,
  concat,
  flow,
  forEach,
  get,
  isArray,
  join,
  map,
  split,
  tap,
} from "lodash/fp";
import { getToken } from "../libs/localStorage";
import axios from "axios";
import moment from "moment";
import Router from "next/router";
import { notification } from "antd";
import brn from "brn";

export const currentPath = () => !isServer && Router.route;

export const isServer = !process.browser;

export const DATE_FORMAT = "MM/DD/YYYY";

export const TIME_FORMAT = "hh:mm:ss A";

export const DATE_TIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;

export const formatDate = (time) =>
  time ? moment(time).format(DATE_FORMAT) : null;

export const isValidDateFormat = (value) =>
  value ? moment(value, DATE_FORMAT, true).isValid() : false;

export const Days = (selectedMonth, selectedYear) => {
  const month = parseInt(selectedMonth);
  const year = parseInt(selectedYear);

  let maxDay = 31;
  if ([4, 6, 9, 11].includes(month)) {
    maxDay = 30;
  }
  if (month === 2) {
    maxDay = 28;
    if (!(year % 4)) {
      maxDay = 29;
    }
  }
  let days = [];

  for (let i = 1; i <= maxDay; i++) {
    days.push({ name: i, value: i });
  }

  return days;
};

export const Months = () => {
  let months = [];
  for (let i = 1; i <= 12; i++) {
    months.push({ name: i, value: i });
  }
  return months;
};

export const Years = () => {
  let years = [];
  let currentYear = new Date().getFullYear();
  const endYear = currentYear - 18;
  const startYear = endYear - 80;

  for (let i = endYear; i >= startYear; i--) {
    years.push({ name: i, value: i });
  }

  return years;
};

export const createErrorSelector = (action) =>
  flow(
    brn(action.errorSelector, action.errorSelector, action.dataSelector),
    get("error")
  );

export const doDispatchAction = (dispatch) => (fetchData) => {
  let actionCreators = fetchData;
  if (typeof fetchData === "function") {
    actionCreators = [fetchData];
  }

  if (isArray(actionCreators)) {
    actionCreators.forEach((actionCreator) => dispatch(actionCreator()));
  }
};

export const DEFAULT_PAGING_INFO = {
  page: 0,
  pageSize: 10,
  filterContents: "",
};

export const DEFAULT_DATE_RANGE = {
  fromDate: null,
  toDate: null,
};

export const doFunctionWithEnter = (event, func) =>
  typeof event === "object" &&
  event.key === "Enter" &&
  typeof func === "function" &&
  func();

export const parseBoolean = (val) =>
  !val ||
  val === "false" ||
  val === "null" ||
  val === "undefined" ||
  val === "0"
    ? false
    : true;

export const doGet = (args) =>
  axios({
    ...args,
    method: "GET",
    headers: Object.assign({}, args.headers, { Authorization: getToken() }),
  });

export const getImageMBFromBase64 = (image) => {
  if (image && typeof image === "string") {
    const buffer = Buffer.from(image.substring(image.indexOf(",") + 1));
    return buffer.length / 1e6;
  }
};

export const imageTypeSupported = ["image/png", "image/jpeg"];

export const openNotification = (
  type,
  { message = "Notification Title", description }
) => {
  notification[type]({
    message,
    description,
  });
};

export const displayCurrency = (amount, prefix = "đ", splitChar = ".") =>
  amount
    ? `${amount} ${prefix}`.replace(/\B(?=(\d{3})+(?!\d))/g, splitChar)
    : `0 ${prefix}`;

export const parseCurrencyInput = (amount) => {
  return amount.replace(/,*/g, "");
};

export const formatCurrencyInput = (amount) => {
  return amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const acceptFileMimes = ["image/jpeg", "image/png", "image/jpg"];

export const acceptFileTypes = flow(
  join(""),
  tap(console.log),
  split("image/"),
  compact,
  join("/")
)(acceptFileMimes);

export const getAveragePrice = (prices = []) => {
  const totalQuantity = prices.reduce((prev, current) => {
    return prev + current.quantity;
  }, 0);
  if (totalQuantity === 0) {
    return 0;
  }
  const totalAmount = prices.reduce((prev, current) => {
    return prev + current.quantity * current.price;
  }, 0);

  return Math.floor(totalAmount / totalQuantity);
};
