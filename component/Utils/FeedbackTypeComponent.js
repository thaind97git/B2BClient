<<<<<<< HEAD
import React from 'react';
const FeedbackTypeComponent = ({ feedback = {} }) => {
  const { order, request, reverseAuction } = feedback || {};
  let label;
  switch (true) {
    case !!order:
      label = 'Order';
      break;
    case !!request:
      label = 'Order';
      break;
    case !!reverseAuction:
      label = 'Reverse Auction';
      break;
    default:
      label = 'System';
      break;
  }
  return <span>{label}</span>;
};

export default FeedbackTypeComponent;
=======
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
>>>>>>> origin/dev_quang
