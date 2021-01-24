import { ACTIONS } from 'redux-api-call';
import { openNotification } from '../utils';
import {
  CANCEL_AUCTION,
  CREATE_REVERSE_AUCTION,
  PLACE_NEW_BID,
  REMOVE_SUPPLIER_AUCTION,
  RESPONSE_AUCTION_INVITATION
} from './AuctionState';
import { ADD_NEW_CATEGORY, UPDATE_CATEGORY } from './CategoryState';
import { UPDATE_FEEDBACK_RATE } from './FeedbackState';
import {
  ACCEPT_GROUP,
  ADD_REQUEST_TO_GROUP,
  ADD_SUPPLIER_TO_GROUP,
  CREATE_NEW_GROUP,
  REMOVE_REQUEST_FROM_GROUP
} from './GroupState';
import { CREATE_NEW_ORDER, CREATE_NEW_ORDER_AUCTION } from './OrderState';
import { CANCEL_REQUEST, REJECT_REQUEST } from './RequestState';
import {
  ACTIVE_SUPPLIER_PRODUCT,
  APPROVE_USER,
  BAN_USER,
  DELETE_SUPPLIER_PRODUCT,
  IGNORE_SUPPLIER,
  REJECT_USER,
  SUPPLIER_REGISTER_PRODUCT,
  SUPPLIER_UPDATE_QUOTATION,
  UN_BAN_USER,
  UN_IGNORE_SUPPLIER
} from './SupplierState';
import {
  USER_LOGIN,
  USER_REGISTER,
  USER_UPDATE_PASSWORD,
  USER_UPDATE_ACCOUNT,
  USER_UPDATE_PASSWORD_BY_CODE,
  USER_ACTIVE_CODE
} from './UserState';

import { CREATE_NEW_AGGREGATOR } from './BuyerState';
import { get } from 'lodash/fp';
import {
  UPDATE_CONFIG_GROUP_SETTING,
  UPDATE_CONFIG_SETTING
} from './SettingState';

const hasError = get('json.errorMessage');

export default {
  displayNotify(state = {}, { type, payload = {} }) {
    const { name } = payload;
    let msgNotify = '';
    if (type === ACTIONS.COMPLETE) {
      switch (name) {
        case USER_LOGIN:
          msgNotify = 'Login successfully';
          break;
        case USER_REGISTER:
          msgNotify = 'Register successfully';
          break;
        case ADD_REQUEST_TO_GROUP:
          msgNotify = 'Add Request to Group successfully';
          break;
        case ADD_SUPPLIER_TO_GROUP:
          msgNotify = 'Add Supplier to Group successfully';
          break;
        case CREATE_NEW_GROUP:
          msgNotify = 'Create new Group successfully';
          break;
        case CANCEL_REQUEST:
          msgNotify = 'Cancel Request successfully';
          break;
        case REJECT_REQUEST:
          msgNotify = 'Reject Request successfully';
          break;
        case REMOVE_REQUEST_FROM_GROUP:
          msgNotify = 'Remove Request from Group successfully';
          break;
        case BAN_USER:
          msgNotify = 'Ban User successfully';
          break;
        case UN_BAN_USER:
          msgNotify = 'Active User successfully';
          break;
        case SUPPLIER_REGISTER_PRODUCT:
          msgNotify = 'Register Product successfully';
          break;
        case SUPPLIER_UPDATE_QUOTATION:
          msgNotify = 'Update Product Quotation successfully';
          break;
        case DELETE_SUPPLIER_PRODUCT:
          msgNotify = 'Deactive product successfully';
          break;
        case ACTIVE_SUPPLIER_PRODUCT:
          msgNotify = 'Active product successfully';
          break;
        case CREATE_REVERSE_AUCTION:
          msgNotify = 'Create new reverse auction successfully';
          break;
        case IGNORE_SUPPLIER:
          msgNotify = 'Ignore successfully';
          break;
        case UN_IGNORE_SUPPLIER:
          msgNotify = 'Un-Ignore successfully';
          break;
        case CANCEL_AUCTION:
          msgNotify = 'Cancel successfully';
          break;
        case RESPONSE_AUCTION_INVITATION:
          msgNotify = 'Response event successfully';
          break;
        case PLACE_NEW_BID:
          msgNotify = 'Place new bid successfully';
          break;
        case UPDATE_FEEDBACK_RATE:
          msgNotify = 'Submit rating successfully';
          break;
        case APPROVE_USER:
          msgNotify = 'Approve account successfully';
          break;
        case REJECT_USER:
          msgNotify = 'Reject account successfully';
          break;
        case CREATE_NEW_ORDER:
        case CREATE_NEW_ORDER_AUCTION:
          msgNotify = 'Create new order successfully';
          break;
        case USER_UPDATE_PASSWORD:
          msgNotify = 'Update password successfully';
          break;
        case REMOVE_SUPPLIER_AUCTION:
          msgNotify = 'Remove Supplier from Auction successfully';
          break;
        case USER_UPDATE_ACCOUNT:
          msgNotify = 'Update account successfully';
          break;
        case ADD_NEW_CATEGORY:
          msgNotify = 'Add new category successfully';
          break;
        case UPDATE_CATEGORY:
          msgNotify = 'Update category successfully';
          break;
        case CREATE_NEW_AGGREGATOR:
          msgNotify = 'Create new aggregator successfully';
          break;
        case UPDATE_CONFIG_SETTING:
          msgNotify = 'Update configs setting successfully';
          break;
        case UPDATE_CONFIG_GROUP_SETTING:
          msgNotify = 'Update configs group setting successfully';
          break;
        case USER_UPDATE_PASSWORD_BY_CODE:
          msgNotify = 'Update password successfully';
          break;
        case USER_ACTIVE_CODE:
          msgNotify = 'Send active code successfully';
          break;
        case ACCEPT_GROUP:
          msgNotify = 'Receive group successfully';
          break;
        default:
          break;
      }
      msgNotify && openNotification('success', { message: msgNotify });
      return payload;
    } else if (type === ACTIONS.FAILURE) {
      switch (name) {
        case USER_LOGIN:
          msgNotify = hasError(payload) || 'Login fail';
          break;
        case USER_REGISTER:
          msgNotify = hasError(payload) || 'Register fail';
          break;
        case ADD_REQUEST_TO_GROUP:
          msgNotify = 'Add Request to Group fail';
          break;
        case ADD_SUPPLIER_TO_GROUP:
          msgNotify = 'Add Supplier to Group fail';
          break;
        case CREATE_NEW_GROUP:
          msgNotify = 'Create new Group fail';
          break;
        case CANCEL_REQUEST:
          msgNotify = 'Cancel Request fail';
          break;
        case REJECT_REQUEST:
          msgNotify = 'Reject Request fail';
          break;
        case REMOVE_REQUEST_FROM_GROUP:
          msgNotify = 'Remove Request from Group fail';
          break;
        case BAN_USER:
          msgNotify = 'Ban User fail';
          break;
        case UN_BAN_USER:
          msgNotify = 'Active User fail';
          break;
        case SUPPLIER_REGISTER_PRODUCT:
          msgNotify = 'Register Product fail';
          break;
        case SUPPLIER_UPDATE_QUOTATION:
          msgNotify = 'Update Product Quotation fail';
          break;
        case DELETE_SUPPLIER_PRODUCT:
          msgNotify = 'Deactive product fail';
          break;
        case ACTIVE_SUPPLIER_PRODUCT:
          msgNotify = 'Active product fail';
          break;
        case CREATE_REVERSE_AUCTION:
          msgNotify = 'Create new reverse auction fail';
          break;
        case IGNORE_SUPPLIER:
          msgNotify = 'Ignore fail';
          break;
        case UN_IGNORE_SUPPLIER:
          msgNotify = 'Un-Ignore fail';
          break;
        case CANCEL_AUCTION:
          msgNotify = 'Cancel fail';
          break;
        case RESPONSE_AUCTION_INVITATION:
          msgNotify = 'Response event fail';
          break;
        case PLACE_NEW_BID:
          msgNotify = 'Place new bid fail';
          break;
        case UPDATE_FEEDBACK_RATE:
          msgNotify = 'Submit rating fail';
          break;
        case APPROVE_USER:
          msgNotify = 'Approve account fail';
          break;
        case REJECT_USER:
          msgNotify = 'Reject account fail';
          break;
        case CREATE_NEW_ORDER:
        case CREATE_NEW_ORDER_AUCTION:
          msgNotify = 'Create new order fail';
          break;
        case USER_UPDATE_PASSWORD:
          msgNotify = 'Update password fail';
          break;
        case REMOVE_SUPPLIER_AUCTION:
          msgNotify = 'Remove Supplier from Auction fail';
          break;
        case USER_UPDATE_ACCOUNT:
          msgNotify = 'Update account failed';
          break;
        case ADD_NEW_CATEGORY:
          msgNotify = 'Add new category fail';
          break;
        case UPDATE_CATEGORY:
          msgNotify = 'Update category fail';
          break;
        case CREATE_NEW_AGGREGATOR:
          msgNotify = 'Create new aggregator fail';
          break;
        case UPDATE_CONFIG_SETTING:
          msgNotify = 'Update configs setting fail';
          break;
        case UPDATE_CONFIG_GROUP_SETTING:
          msgNotify = 'Update configs group setting fail';
          break;
        case USER_UPDATE_PASSWORD_BY_CODE:
          msgNotify = 'Update password fail';
          break;
        case USER_ACTIVE_CODE:
          msgNotify = 'Send active code fail';
          break;
        case ACCEPT_GROUP:
          msgNotify = 'Receive group fail';
          break;
        default:
          break;
      }
      msgNotify && openNotification('error', { message: msgNotify });
      return payload;
    }
    return state;
  }
};
