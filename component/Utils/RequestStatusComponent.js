import { Tag } from "antd";
import React from "react";
import {
  R_CANCELED,
  R_DONE,
  R_GROUPING,
  R_REJECTED,
  R_PENDING,
} from "../../enums/requestStatus";

const RequestStatusComponent = ({ status }) => {
  const getColorByStatus = (status) => {
    switch (status) {
      case R_PENDING:
        return "default";
      case R_GROUPING:
        return "#2db7f5";
      case R_DONE:
        return "#87d068";
      case R_CANCELED:
        return "error";
      case R_REJECTED:
        return "#f50";
      default:
        break;
    }
  };
  const getLabelByStatus = (status) => {
    switch (status) {
      case R_PENDING:
        return "WAITING";
      case R_GROUPING:
        return "GROUPING";
      case R_DONE:
        return "DONE";
      case R_CANCELED:
        return "CANCELED";
      case R_REJECTED:
        return "REJECTED";
      default:
        break;
    }
  };
  return <Tag color={getColorByStatus(status)}>{getLabelByStatus(status)}</Tag>;
};

export default RequestStatusComponent;
