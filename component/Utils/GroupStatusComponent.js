import { Tag } from "antd";
import React from "react";
import {
  G_BIDDING,
  G_CANCELED,
  G_DONE,
  G_WAITING,
} from "../../enums/groupStatus";

const GroupStatusComponent = ({ status }) => {
  const getColorByStatus = (status) => {
    switch (status) {
      case G_WAITING:
        return "default";
      case G_BIDDING:
        return "cyan";
      case G_DONE:
        return "success";
      case G_CANCELED:
        return "red";
      default:
        break;
    }
  };
  const getLabelByStatus = (status) => {
    switch (status) {
      case G_WAITING:
        return "WAITING";
      case G_BIDDING:
        return "BIDDING";
      case G_DONE:
        return "SUCCESS";
      case G_CANCELED:
        return "CANCELED";
      default:
        break;
    }
  };
  return <Tag color={getColorByStatus(status)}>{getLabelByStatus(status)}</Tag>;
};

export default GroupStatusComponent;
