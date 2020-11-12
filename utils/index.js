import { compact, flow, get, isArray, join, split } from 'lodash/fp';
import { getToken } from '../libs/localStorage';
import axios from 'axios';
import moment from 'moment';
import Router from 'next/router';
import { notification } from 'antd';
import brn from 'brn';

export const currentPath = () => !isServer && Router.route;

export const isServer = !process.browser;

export const DATE_FORMAT = 'MM/DD/YYYY';

export const TIME_FORMAT = 'hh:mm:ss A';

export const DATE_TIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;

export const formatDate = (time) =>
  time ? moment(time).format(DATE_FORMAT) : null;

export const isValidDateFormat = (value) =>
  value ? moment(value, DATE_FORMAT, true).isValid() : false;

export const getShortContent = (content, length = 30) =>
  content
    ? content.length >= length
      ? content.slice(0, length) + '...'
      : content
    : '';

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
    get('error')
  );

export const doDispatchAction = (dispatch) => (fetchData) => {
  let actionCreators = fetchData;
  if (typeof fetchData === 'function') {
    actionCreators = [fetchData];
  }

  if (isArray(actionCreators)) {
    actionCreators.forEach((actionCreator) => dispatch(actionCreator()));
  }
};

export const DEFAULT_PAGING_INFO = {
  page: 1,
  pageSize: 10,
  filterContents: ''
};

export const DEFAULT_DATE_RANGE = {
  fromDate: null,
  toDate: null
};

export const doFunctionWithEnter = (event, func) =>
  typeof event === 'object' &&
  event.key === 'Enter' &&
  typeof func === 'function' &&
  func();

export const parseBoolean = (val) =>
  !val ||
  val === 'false' ||
  val === 'null' ||
  val === 'undefined' ||
  val === '0'
    ? false
    : true;

export const doGet = (args) =>
  axios({
    ...args,
    method: 'GET',
    headers: Object.assign({}, args.headers, { Authorization: getToken() })
  });

export const getImageMBFromBase64 = (image) => {
  if (image && typeof image === 'string') {
    const buffer = Buffer.from(image.substring(image.indexOf(',') + 1));
    return buffer.length / 1e6;
  }
};

export const imageTypeSupported = ['image/png', 'image/jpeg'];

export const openNotification = (
  type,
  { message = 'Notification Title', description }
) => {
  notification[type]({
    message,
    description
  });
};

export const displayCurrency = (amount, prefix = 'đ', splitChar = '.') =>
  amount
    ? `${amount} ${prefix}`.replace(/\B(?=(\d{3})+(?!\d))/g, splitChar)
    : `0 ${prefix}`;

export const parseCurrencyInput = (amount) => {
  return amount.replace(/,*/g, '');
};

export const formatCurrencyInput = (amount) => {
  return amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const acceptFileMimes = ['image/jpeg', 'image/png', 'image/jpg'];

export const acceptFileTypes = flow(
  join(''),
  split('image/'),
  compact,
  join('/')
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

export const calculateGroupRequest = (requests = []) => {
  const arrayPrice = requests.map((request) => +request.preferredUnitPrice);
  const totalRequest = requests.length;
  const totalQuantity = requests.reduce((prev, current) => {
    return prev + +current.quantity;
  }, 0);
  const minPrice = Math.min(...arrayPrice);
  const maxPrice = Math.max(...arrayPrice);
  return {
    totalRequest,
    totalQuantity: totalQuantity + ' ' + (requests[0] || {}).product.unitType,
    minPrice: displayCurrency(minPrice),
    maxPrice: displayCurrency(maxPrice)
  };
};

export const fallbackImage =
  'data:image/png;base64,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';
export const getProductImage = (image) =>
  image
    ? `${process.env.API_SERVER_URL}/api/Product/ProductImage/${image}`
    : null;
export const getCurrentUserImage = (image) =>
  image ? `${process.env.API_SERVER_URL}/api/Account/Avatar/${image}` : null;
export const getDefaultProductImage = () =>
  '/static/images/default_product_img.jpg';
