import { Tag } from 'antd';
import React from 'react';
import { O_DONE, O_ORDERED } from '../../enums/orderStatus';

const OrderStatusComponent = ({ status }) => {
  const getColorByStatus = (status) => {
    switch (status) {
      case O_DONE:
        return '#87d068';
      case O_ORDERED:
        return 'success';
      default:
        break;
    }
  };
  const getLabelByStatus = (status) => {
    switch (status) {
      case O_DONE:
        return 'DONE';
      case O_ORDERED:
        return 'ORDERED';
      default:
        break;
    }
  };
  return <Tag color={getColorByStatus(status)}>{getLabelByStatus(status)}</Tag>;
};

export default OrderStatusComponent;
