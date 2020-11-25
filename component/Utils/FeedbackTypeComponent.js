import { Tag } from 'antd';
import React from 'react';
import { F_AUCTION, F_RFQ, F_SYSTEM, F_ORDER } from '../../enums/feedbackType';

const FeedingTypeComponent = ({ status }) => {
  const getColorByStatus = (status) => {
    switch (status) {
      case F_AUCTION:
        return '#fcba03';
      case F_RFQ:
        return '#03fc28';
      case F_SYSTEM:
        return '#037bfc';
      case F_ORDER:
        return '#d500ed';
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
  return <Tag color={getColorByStatus(status)}>{getLabelByStatus(status)}</Tag>;
};

export default FeedingTypeComponent;
