import { Tag } from "antd";
import React from "react";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";

import {
  U_ACTIVE,
  U_BANNED,
  U_PENDING,
  U_REJECT,
} from "../../enums/accountStatus";

const UserStatusComponent = ({ status }) => {
  const getColorByStatus = (status) => {
    switch (status) {
      case U_PENDING:
        return "processing";
      case U_ACTIVE:
        return "success";
      case U_REJECT:
        return "red";
      case U_BANNED:
        return "red";
      default:
        break;
    }
  };
  const getLabelByStatus = (status) => {
    switch (status) {
      case U_PENDING:
        return "PENDING";
      case U_REJECT:
        return "REJECTED";
      case U_ACTIVE:
        return "ACTIVE";
      case U_BANNED:
        return "BANNED";
      default:
        break;
    }
  };

  const getIconByStatus = (status) => {
    switch (status) {
      case U_PENDING:
        return <ClockCircleOutlined />;
      case U_ACTIVE:
        return <CheckCircleOutlined />;
      case U_REJECT:
        return <CloseCircleOutlined />;
      case U_BANNED:
        return <StopOutlined />;
      default:
        break;
    }
  };
  return (
    <Tag icon={getIconByStatus(status)} color={getColorByStatus(status)}>
      {getLabelByStatus(status)}
    </Tag>
  );
};

export default UserStatusComponent;
