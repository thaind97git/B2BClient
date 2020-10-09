import { Tag } from "antd";
import React from "react";
import {
  R_CANCELED,
  R_DONE,
  R_GROUPED,
  R_REJECTED,
  R_PENDING,
  R_NEGOTIATING,
  R_WAIT_FOR_AUCTION,
  R_BIDDING,
  R_ORDERED,
} from "../../enums/requestStatus";

const RequestStatusComponent = ({ status }) => {
  const getColorByStatus = (status) => {
    switch (status) {
      case R_PENDING:
        return "default";
      case R_GROUPED:
        return "#2db7f5";
      case R_DONE:
        return "success";
      case R_CANCELED:
        return "error";
      case R_REJECTED:
        return "error";
      case R_NEGOTIATING:
        return "blue";
      case R_WAIT_FOR_AUCTION:
        return "processing";
      case R_BIDDING:
        return "cyan";
      case R_ORDERED:
        return "#87d068";
      default:
        break;
    }
  };
  const getLabelByStatus = (status) => {
    switch (status) {
      case R_PENDING:
        return "PENDING";
      case R_GROUPED:
        return "GROUPING";
      case R_DONE:
        return "DONE";
      case R_CANCELED:
        return "CANCELED";
      case R_REJECTED:
        return "REJECTED";
      case R_NEGOTIATING:
        return "NEGOTIATING";
      case R_WAIT_FOR_AUCTION:
        return "WAIT FOR AUCTION";
      case R_BIDDING:
        return "BIDDING";
      case R_ORDERED:
        return "ORDERED";
      default:
        break;
    }
  };
  return <Tag color={getColorByStatus(status)}>{getLabelByStatus(status)}</Tag>;
};

export default RequestStatusComponent;
