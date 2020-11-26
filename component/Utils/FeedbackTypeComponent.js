import { Tag } from 'antd';
import React from 'react';
import { F_AUCTION, F_RFQ, F_SYSTEM, F_ORDER } from '../../enums/feedbackType';
import {
  LineChartOutlined,
  ScheduleOutlined,
  BugOutlined
} from '@ant-design/icons';
const FeedbackTypeComponent = ({ status }) => {
  const getColorByStatus = (status) => {
    switch (status) {
      case F_AUCTION:
        return 'cyan';
      case F_RFQ:
        return 'blue';
      case F_SYSTEM:
        return 'error';
      case F_ORDER:
        return 'blue';
      default:
        break;
    }
  };
  const getLabelByStatus = (status) => {
    switch (status) {
      case F_AUCTION:
        return 'Auction';
      case F_RFQ:
        return 'Order';
      case F_SYSTEM:
        return 'System';
      case F_ORDER:
        return 'Order';
      default:
        break;
    }
  };
  const getIconByStatus = (status) => {
    switch (status) {
      case F_AUCTION:
        return <LineChartOutlined />;
      case F_RFQ:
        return <ScheduleOutlined />;
      case F_SYSTEM:
        return <BugOutlined />;
      case F_ORDER:
        return <ScheduleOutlined />;

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

export default FeedbackTypeComponent;
