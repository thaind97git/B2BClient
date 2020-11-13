import { Tag } from 'antd';
import React from 'react';
import { O_DONE, O_ORDERED } from '../../enums/orderStatus';

const OrderStatusComponent = ({ status }) => {
  const getColorByStatus = (status) => {
    switch (status) {
      case O_DONE:
        return '#2db7f5';
      case O_ORDERED:
        return '#f50';
      default:
        break;
    }
  };
  const getLabelByStatus = (status) => {
    switch (status) {
      case O_DONE:
        return 'Done';
      case O_ORDERED:
        return 'Ordered';
      default:
        break;
    }
  };
  return <Tag color={getColorByStatus(status)}>{getLabelByStatus(status)}</Tag>;
};

export default OrderStatusComponent;
