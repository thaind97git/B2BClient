import { ACTIONS } from 'redux-api-call';
import { openNotification } from '../utils';
import {
  CANCEL_AUCTION,
  CREATE_REVERSE_AUCTION,
  PLACE_NEW_BID,
  REMOVE_SUPPLIER_AUCTION,
  RESPONSE_AUCTION_INVITATION
} from './AuctionState';
import { UPDATE_FEEDBACK_RATE } from './FeedbackState';
import {
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
import { USER_LOGIN, USER_REGISTER, USER_UPDATE_PASSWORD } from './UserState';

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
          msgNotify = 'Create new password successfully';
          break;
        case REMOVE_SUPPLIER_AUCTION:
          msgNotify = 'Remove Supplier from Auction successfully';
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
        case CREATE_NEW_ORDER_AUCTION:
          msgNotify = 'Create new order fail';
          break;
        case USER_UPDATE_PASSWORD:
          msgNotify = 'Create new password fail';
          break;
        case REMOVE_SUPPLIER_AUCTION:
          msgNotify = 'Remove Supplier from Auction fail';
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
