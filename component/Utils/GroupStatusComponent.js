import { Tag } from 'antd';
import React from 'react';
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ScheduleOutlined,
  AreaChartOutlined,
  FormOutlined
} from '@ant-design/icons';
import {
  G_BIDDING,
  G_FAILED,
  G_DONE,
  G_PENDING,
  G_NEGOTIATING,
  G_WAIT_FOR_AUCTION,
  G_ORDERED
} from '../../enums/groupStatus';

const GroupStatusComponent = ({ status }) => {
  const getColorByStatus = (status) => {
    switch (status) {
      case G_PENDING:
        return 'default';
      case G_BIDDING:
        return 'cyan';
      case G_DONE:
        return 'success';
      case G_FAILED:
        return 'red';
      case G_NEGOTIATING:
        return 'blue';
      case G_WAIT_FOR_AUCTION:
        return 'processing';
      case G_ORDERED:
        return '#87d068';
      default:
        break;
    }
  };
  const getLabelByStatus = (status) => {
    switch (status) {
      case G_PENDING:
        return 'PENDING';
      case G_BIDDING:
        return 'BIDDING';
      case G_DONE:
        return 'DONE';
      case G_FAILED:
        return 'FAILED';
      case G_NEGOTIATING:
        return 'NEGOTIATING';
      case G_WAIT_FOR_AUCTION:
        return 'WAIT FOR REVERSE AUCTION';
      case G_ORDERED:
        return 'ORDERED';
      default:
        break;
    }
  };

  const getIconByStatus = (status) => {
    switch (status) {
      case G_PENDING:
        return <ClockCircleOutlined />;
      case G_BIDDING:
        return <AreaChartOutlined />;
      case G_DONE:
        return <CheckCircleOutlined />;
      case G_FAILED:
        return <CloseCircleOutlined />;
      case G_NEGOTIATING:
        return <FormOutlined />;
      case G_WAIT_FOR_AUCTION:
        return <SyncOutlined />;
      case G_ORDERED:
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

export default GroupStatusComponent;
