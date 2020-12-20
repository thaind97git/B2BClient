import { compact, flow, get, isArray, join, split } from 'lodash/fp';
import { getToken } from '../libs/localStorage';
import axios from 'axios';
import moment from 'moment';
import Router from 'next/router';
import { notification } from 'antd';
import brn from 'brn';
import { B_CANCELED, B_CLOSED, B_DONE, B_FAILED } from '../enums/biddingStatus';
import {
  N_AUCTION_WINNER,
  N_FEEDBACK_CREATED,
  N_INVITATION,
  N_ORDER_CREATED,
  N_REQUEST_CANCELED,
  N_REQUEST_GROUPED,
  N_REVERSE_AUCTION_START,
  N_RFQ_OUT_OF_DATE
} from '../enums/notificationStatus';
import { ADMIN, BUYER, MODERATOR, SUPPLIER } from '../enums/accountRoles';
import { Fragment } from 'react';
import momentTimeZone from 'moment-timezone';
import pluralize from 'pluralize';
export const currentPath = () => !isServer && Router.route;

export const isServer = !process.browser;

export const DATE_FORMAT = 'MM/DD/YYYY';

export const TIME_FORMAT = 'hh:mm:ss A';

export const DATE_TIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;

export const formatDate = (time) =>
  time ? moment(time).format(DATE_FORMAT) : null;

export const getFromNowTime = (time) =>
  time ? moment.utc(time).fromNow() : null;

export const getUtcTime = (time, format = DATE_TIME_FORMAT) =>
  time ? momentTimeZone.tz(time, 'Etc/GMT+7').utc().format(format) : null;
export const getUtcTimeWithoutFormat = (time) =>
  time ? momentTimeZone.tz(time, 'Etc/GMT+7').utc() : null;

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

export const displayCurrency = (amount, prefix = 'đ', splitChar = ',') =>
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
export const getFeedbackFileURL = (file) =>
  file
    ? `${process.env.API_SERVER_URL}/api/Feedback/FeedbackFile/${file}`
    : null;
export const getCurrentUserImage = (image) =>
  image ? `${process.env.API_SERVER_URL}/api/Account/Avatar/${image}` : null;

export const getFileMessage = (image) =>
  image ? `${process.env.API_SERVER_URL}/api/Message/File/${image}` : null;
export const getDefaultProductImage = () =>
  '/static/images/default_product_img.jpg';

export const getCurrentTimezone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone;

export const timeConvert = (n) => {
  let num = n;
  let hours = num / 60;
  let rhours = Math.floor(hours);
  let minutes = (hours - rhours) * 60;
  let rminutes = Math.round(minutes);
  const rsH = rhours === 0 ? '' : rhours + ` hour${rhours > 1 ? 's' : ''}`;
  const rsM =
    rminutes === 0 ? '' : rminutes + ` minute${rminutes > 1 ? 's' : ''}`;
  return rsH || rsM ? `${rsH} ${rsM}` : 'N/A';
};

export const getBadgeAuctionLabel = (
  auctionStartTime,
  isClosed = false,
  auctionStatus
) => {
  let text = 'A next few days';
  const auctionTime = new Date(auctionStartTime);
  const currentTime = new Date();
  const duration = moment.duration(
    moment(auctionTime).diff(moment(currentTime))
  );
  const dateBetween = Math.floor(duration.asDays());
  const hoursBetween = Math.floor(duration.asHours());
  const minutesBetween = Math.floor(duration.asMinutes());
  if (isClosed) {
    const getLabelByStatus = (status) => {
      switch (status) {
        case B_DONE:
          return 'Done';
        case B_CLOSED:
          return 'Closed';
        case B_CANCELED:
          return 'Canceled';
        case B_FAILED:
          return 'Failed';
        default:
          break;
      }
    };
    text = getLabelByStatus(auctionStatus);
  } else if (dateBetween <= 0) {
    if (hoursBetween <= 0) {
      if (minutesBetween <= 0) {
        text = 'Happening';
      } else if (minutesBetween > 0) {
        text = 'A few minutes';
      }
    } else if (hoursBetween > 0) {
      text = 'A few hours';
    }
  } else if (dateBetween === 1) {
    text = 'Tomorrow';
  } else if (dateBetween >= 7) {
    text = 'Next week';
  } else if (dateBetween >= 14) {
    text = 'A next few weeks';
  }
  return text;
};

export const getLabelNotify = ({ type, role = BUYER, id, title }) => {
  let label, link;
  if (role === MODERATOR) {
    switch (type) {
      case N_REQUEST_CANCELED:
        label = (
          <Fragment>
            A request cancelled in group <b>{title}</b>.
          </Fragment>
        );
        link = `/aggregator/group/details?id=${id}`;
        break;
      case N_RFQ_OUT_OF_DATE:
        label = (
          <Fragment>
            A RFQ is out of date in group <b>{title}</b>.
          </Fragment>
        );
        link = `/aggregator/group/details?id=${id}`;
        break;
      case N_REVERSE_AUCTION_START:
        label = (
          <Fragment>
            The reverse auction <b>{title}</b> has started.
          </Fragment>
        );
        link = `/aggregator/bidding/details?id=${id}`;
        break;

      default:
        break;
    }
  } else if (role === SUPPLIER) {
    switch (type) {
      case N_INVITATION:
        label = (
          <Fragment>
            You have been invited to reverse auction <b>{title}</b>.
          </Fragment>
        );
        link = `/supplier/bidding`;
        break;
      case N_REVERSE_AUCTION_START:
        label = (
          <Fragment>
            Reverse auction <b>{title}</b> has started.
          </Fragment>
        );
        link = `/supplier/bidding`;
        break;
      case N_AUCTION_WINNER:
        label = (
          <Fragment>
            You have won reverse auction <b>{title}</b>.
          </Fragment>
        );
        link = `/supplier/bidding/details?id=${id}`;
        break;
      case N_ORDER_CREATED:
        label = (
          <Fragment>
            An order of <b>{title}</b> has been created.
          </Fragment>
        );
        link = `/supplier/order/details?id=${id}`;
        break;
      default:
        break;
    }
  } else if (role === BUYER) {
    switch (type) {
      case N_RFQ_OUT_OF_DATE:
        label = (
          <Fragment>
            Your RFQ is out of date, <b>{title}</b>.
          </Fragment>
        );
        link = `/buyer/rfq`;
        break;
      case N_REQUEST_GROUPED:
        label = (
          <Fragment>
            One of your RFQ has been grouped, <b>{title}</b>.
          </Fragment>
        );
        link = `/buyer/rfq`;
        break;
      case N_ORDER_CREATED:
        label = (
          <Fragment>
            An order of <b>{title}</b> has been created.
          </Fragment>
        );
        link = `/buyer/order/details?id=${id}`;
        break;
      default:
        break;
    }
  } else if (role === ADMIN) {
    switch (type) {
      case N_FEEDBACK_CREATED:
        label = (
          <Fragment>
            Feedback for <b>{title}</b> has been created.
          </Fragment>
        );
        link = `/admin/feedback`;
        break;
      default:
        break;
    }
  }
  return {
    label,
    link
  };
};

export const getRangeDateLabel = (date = 30) => {
  return `From: ${moment().add(-date, 'days').format(DATE_FORMAT)} - To: Today`;
};

export const getNounQuantity = (quantity = 0, label) => {
  if (quantity <= 1) {
    return pluralize.singular(label);
  } else {
    return label;
  }
};

export const getRange = (quotations = [], quantity, key) => {
  let dataSource = quotations;
  if (key) {
    dataSource = dataSource.filter((quotation) => quotation.key !== key);
  }
  const min =
    dataSource.filter((quotation) => quotation.quantity >= quantity) || [];
  const max =
    dataSource.filter((quotation) => quotation.quantity < quantity) || [];
  const minSort = min.sort((a, b) => a.quantity - b.quantity);
  const maxSort = max.sort((a, b) => b.quantity - a.quantity);
  return {
    minSort,
    maxSort,
    minPrice: (minSort[0] || {}).price || 0,
    maxPrice: (maxSort[0] || {}).price || Infinity
  };
};
export const checkErrorQuotations = (quotations = []) => {
  let error = false,
    errorCurrent = {};
  quotations.sort((a, b) => b.quantity - a.quantity);

  const currentCheck = [];

  for (let i = 0; i < quotations.length; i++) {
    const currentQuotation = quotations[i];
    const nextQuotation = quotations[i + 1];
    const { minPrice } = getRange(currentCheck, currentQuotation.quantity);
    if (nextQuotation && currentQuotation.quantity === nextQuotation.quantity) {
      error = true;
      errorCurrent = nextQuotation;
      break;
    }
    if (currentQuotation.price <= minPrice) {
      error = true;
      errorCurrent = currentQuotation;
    }

    currentCheck.push(currentQuotation);
  }

  return {
    error,
    errorCurrent
  };
};
