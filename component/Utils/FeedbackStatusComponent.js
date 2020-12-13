import { Tag } from 'antd';
import React from 'react';
import { F_OPEN, F_CLOSED } from '../../enums/feedbackStatus';

const FeedingStatusComponent = ({ status }) => {
  const getColorByStatus = (status) => {
    switch (status) {
      case F_OPEN:
        return '#2db7f5';
      case F_CLOSED:
        return 'gray';
      default:
        break;
    }
  };
  const getLabelByStatus = (status) => {
    switch (status) {
      case F_OPEN:
        return 'Opening';
      case F_CLOSED:
        return 'Closed';
      default:
        break;
    }
  };
  return <Tag color={getColorByStatus(status)}>{getLabelByStatus(status)}</Tag>;
};

export default FeedingStatusComponent;
