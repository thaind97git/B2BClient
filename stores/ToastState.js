import { ACTIONS } from 'redux-api-call';
import { openNotification } from '../utils';
import {
  CANCEL_AUCTION,
  CREATE_REVERSE_AUCTION,
  PLACE_NEW_BID,
  RESPONSE_AUCTION_INVITATION
} from './AuctionState';
import { UPDATE_FEEDBACK_RATE } from './FeedbackState';
import {
  ADD_REQUEST_TO_GROUP,
  ADD_SUPPLIER_TO_GROUP,
  CREATE_NEW_GROUP,
  REMOVE_REQUEST_FROM_GROUP
} from './GroupState';
import { CREATE_NEW_ORDER } from './OrderState';
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
  UN_IGNORE_SUPPLIER,
} from './SupplierState';
import { USER_LOGIN, USER_REGISTER, USER_UPDATE_PASSWORD } from './UserState';

export default {
  displayNotify(state = {}, { type, payload = {} }) {
    const { name } = payload;
    let msgNotify = '';
    if (type === ACTIONS.COMPLETE) {
      switch (name) {
        case USER_LOGIN:
          msgNotify = 'Login success';
          break;
        case USER_REGISTER:
          msgNotify = 'Register success';
          break;
        case ADD_REQUEST_TO_GROUP:
          msgNotify = 'Add Request to Group success';
          break;
        case ADD_SUPPLIER_TO_GROUP:
          msgNotify = 'Add Supplier to Group success';
          break;
        case CREATE_NEW_GROUP:
          msgNotify = 'Create new Group success';
          break;
        case CANCEL_REQUEST:
          msgNotify = 'Cancel Request success';
          break;
        case REJECT_REQUEST:
          msgNotify = 'Reject Request success';
          break;
        case REMOVE_REQUEST_FROM_GROUP:
          msgNotify = 'Remove Request from Group success';
          break;
        case BAN_USER:
          msgNotify = 'Ban User success';
          break;
        case UN_BAN_USER:
          msgNotify = 'Active User success';
          break;
        case SUPPLIER_REGISTER_PRODUCT:
          msgNotify = 'Register Product success';
          break;
        case SUPPLIER_UPDATE_QUOTATION:
          msgNotify = 'Update Product Quotation success';
          break;
        case DELETE_SUPPLIER_PRODUCT:
          msgNotify = 'Deactive product success';
          break;
        case ACTIVE_SUPPLIER_PRODUCT:
          msgNotify = 'Active product success';
          break;
        case CREATE_REVERSE_AUCTION:
          msgNotify = 'Create new reverse auction success';
          break;
        case IGNORE_SUPPLIER:
          msgNotify = 'Ignore success';
          break;
        case UN_IGNORE_SUPPLIER:
          msgNotify = 'Un-Ignore success';
          break;
        case CANCEL_AUCTION:
          msgNotify = 'Cancel success';
          break;
        case RESPONSE_AUCTION_INVITATION:
          msgNotify = 'Response event success';
          break;
        case PLACE_NEW_BID:
          msgNotify = 'Place new bid success';
          break;
        case UPDATE_FEEDBACK_RATE:
          msgNotify = 'Submit rating success';
          break;
        case APPROVE_USER:
          msgNotify = 'Approve account success';
          break;
        case REJECT_USER:
          msgNotify = 'Reject account success';
          break;
        case CREATE_NEW_ORDER:
          msgNotify = 'Create new order success';
          break;
        case USER_UPDATE_PASSWORD:
          msgNotify = 'Create new password success';
          break;
        default:
          break;
      }
      msgNotify && openNotification('success', { message: msgNotify });
      return payload;
    } else if (type === ACTIONS.FAILURE) {
      switch (name) {
        case USER_LOGIN:
          msgNotify = 'Login fail';
          break;
        case USER_REGISTER:
          msgNotify = 'Register fail';
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
          msgNotify = 'Create new order fail';
          break;
        case USER_UPDATE_PASSWORD:
          msgNotify = 'Create new password fail';
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
