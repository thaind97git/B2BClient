import { Tag } from 'antd';
import React from 'react';
import {
  B_ACTIVE,
  B_CANCELED,
  B_CLOSED,
  B_DONE,
  B_FAILED,
  B_FEATURE
} from '../../enums/biddingStatus';
import {
  ExclamationCircleOutlined,
  CheckOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  CloseSquareOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

const BiddingStatusComponent = ({ status }) => {
  const getColorByStatus = (status) => {
    switch (status) {
      case B_FEATURE:
        return '#108ee9';
      case B_ACTIVE:
        return '#2db7f5';
      case B_DONE:
        return '#87d068';
      case B_CLOSED:
        return '#f50';
      case B_CANCELED:
        return 'red';
      case B_FAILED:
        return '#f50';
      default:
        break;
    }
  };
  const getLabelByStatus = (status) => {
    switch (status) {
      case B_FEATURE:
        return 'Waiting';
      case B_ACTIVE:
        return 'Opening';
      case B_DONE:
        return 'Done';
      case B_CLOSED:
        return 'Closed';
      case B_CANCELED:
        return 'Canceled';
      case B_FAILED:
        return 'Failed';
      default:
        break;
    }
  };
  const getIconByStatus = (status) => {
    switch (status) {
      case B_FEATURE:
        return <ExclamationCircleOutlined />;
      case B_ACTIVE:
        return <CheckOutlined />;
      case B_DONE:
        return <CheckCircleOutlined />;
      case B_CLOSED:
        return <CloseOutlined />;
      case B_CANCELED:
        return <CloseSquareOutlined />;
      case B_FAILED:
        return <CloseCircleOutlined />;
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

export default BiddingStatusComponent;
