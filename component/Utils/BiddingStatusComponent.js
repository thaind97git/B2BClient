import { Tag } from "antd";
import React from "react";
import {
  B_ACTIVE,
  B_CLOSED,
  B_DONE,
  B_FEATURE,
} from "../../enums/biddingStatus";

const BiddingStatusComponent = ({ status }) => {
  const getColorByStatus = (status) => {
    switch (status) {
      case B_FEATURE:
        return "#108ee9";
      case B_ACTIVE:
        return "#2db7f5";
      case B_DONE:
        return "#87d068";
      case B_CLOSED:
        return "#f50";
      default:
        break;
    }
  };
  const getLabelByStatus = (status) => {
    switch (status) {
      case B_FEATURE:
        return "Waiting";
      case B_ACTIVE:
        return "Opening";
      case B_DONE:
        return "Done";
      case B_CLOSED:
        return "Closed";
      default:
        break;
    }
  };
  return <Tag color={getColorByStatus(status)}>{getLabelByStatus(status)}</Tag>;
};

export default BiddingStatusComponent;
