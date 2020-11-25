import { Button, Col, Input, Modal, Row, Space, Typography } from 'antd';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { U_ACTIVE, U_BANNED, U_PENDING } from '../enums/accountStatus';
import ReactTableLayout from '../layouts/ReactTableLayout';
import {
  getFeedbackReportedForSupplier,
  GetFeedbackReportedForSupplierData,
  GetFeedbackReportedForSupplierError,
  GetFeedbackReportedForSupplierResetter
} from '../stores/FeedbackState';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { DEFAULT_DATE_RANGE, getUtcTime, openNotification } from '../utils';
import FeedbackStatusComponent from './Utils/FeedbackStatusComponent';
import FeedbackTypeComponent from './Utils/FeedbackTypeComponent';
import { getUser, getUserData } from '../stores/UserState';
import {
  banUser,
  BanUserData,
  BanUserResetter,
  unBanUser,
  UnBanUserData,
  UnBanUserResetter
} from '../stores/SupplierState';
import { get } from 'lodash/fp';
const { Title } = Typography;
const connectToRedux = connect(
  createStructuredSelector({
    reportData: GetFeedbackReportedForSupplierData,
    reportError: GetFeedbackReportedForSupplierError,
    getUserData: getUserData,
    banUserData: BanUserData,
    unBanUserData: UnBanUserData
  }),
  (dispatch) => ({
    getReport: (pageIndex, pageSize, searchMessage, dateRange, supplierId) => {
      dispatch(
        getFeedbackReportedForSupplier({
          pageSize,
          pageIndex,
          supplierId
        })
      );
    },
    resetListReport: () => dispatch(GetFeedbackReportedForSupplierResetter),
    banSupplier: ({ id, description }) =>
      dispatch(banUser({ id, description })),
    unBanSupplier: ({ id }) => dispatch(unBanUser({ id })),
    resetBanAndUnBan: () => {
      dispatch(BanUserResetter);
      dispatch(UnBanUserResetter);
    },
    getUser: (id) => dispatch(getUser(id))
  })
);
const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: 'Service Type',
    dataIndex: 'service',
    key: 'service'
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions'
  }
];
const ListReportSupplierComponent = ({
  supplierId,
  getReport,
  reportData,
  reportError,
  resetListReport,
  banSupplier,
  unBanSupplier,
  getUserData,
  banUserData,
  unBanUserData,
  resetBanAndUnBan,
  getUser
}) => {
  const [loading, setLoading] = useState(true);
  const [banReason, setBanReason] = useState('');
  const [openBan, setOpenBan] = useState(false);
  useEffect(() => {
    if (reportData || reportError) {
      setLoading(false);
    }
  }, [reportData, reportError]);

  useEffect(() => {
    if (banUserData) {
      setOpenBan(false);
      resetBanAndUnBan();
      getReport(0, 10, '', {}, supplierId);
      getUser(supplierId);
    }
  }, [banUserData, resetBanAndUnBan, getReport, supplierId, getUser]);

  useEffect(() => {
    if (unBanUserData) {
      resetBanAndUnBan();
      getReport(0, 10, '', {}, supplierId);
      getUser(supplierId);
    }
  }, [unBanUserData, resetBanAndUnBan, supplierId, getReport, getUser]);

  useEffect(() => {
    return () => {
      resetListReport();
    };
  }, [resetListReport]);

  if (!supplierId) {
    return null;
  }
  if (!getUserData) {
    return null;
  }
  const getFeedbackTable = (feedbackData = []) => {
    return (
      feedbackData &&
      feedbackData.length > 0 &&
      feedbackData.map((feedback = {}) => ({
        key: feedback.id,
        title: feedback.title,
        service: <FeedbackTypeComponent feedback={feedback} />,
        status: (
          <FeedbackStatusComponent
            status={feedback.feedbackStatus.id}
          ></FeedbackStatusComponent>
        ),
        actions: (
          <a
            target="_blank"
            rel="noreferrer"
            href={`/admin/feedback/details?id=${feedback.id}`}
          >
            View
          </a>
        )
      }))
    );
  };

  let feedbackData = [],
    totalCount = 0;
  if (!!reportData) {
    feedbackData = reportData.data;
    totalCount = reportData.total;
  }
  return (
    <Row>
      <Modal
        okText="Ban"
        title="Ban Supplier"
        visible={openBan}
        onOk={() => {
          const banTrimmed = banReason && banReason.trim();
          if (!banTrimmed) {
            openNotification('error', {
              message: 'Please input the reason to ban account!'
            });
            return;
          }
          !!banReason.trim() &&
            banSupplier({ id: supplierId, description: banReason });
        }}
        onCancel={() => setOpenBan(false)}
      >
        <Input.TextArea
          value={banReason}
          onChange={(event) => setBanReason(event.target.value)}
          placeholder="Give a reason to ban this action"
          minLength={5}
        />
      </Modal>
      <Col span={24}>
        <Row justify="end">
          {get('userStatus.id')(getUserData) === U_ACTIVE && (
            <Button
              type="primary"
              danger
              onClick={() => {
                setOpenBan(true);
                // Modal.confirm({
                //   title: 'Do you want ban this account?',
                //   icon: <ExclamationCircleOutlined />,
                //   okText: 'Ban',
                //   cancelText: 'Cancel',
                //   onOk: () => {
                //     banSupplier({ id: supplierId });
                //   }
                // });
              }}
              size="small"
            >
              Ban Account
            </Button>
          )}
          {(get('userStatus.id')(getUserData) === U_PENDING ||
            get('userStatus.id')(getUserData) === U_BANNED) && (
            <Button
              type="primary"
              onClick={() => {
                Modal.confirm({
                  title: 'Do you want active this account?',
                  icon: <ExclamationCircleOutlined />,
                  okText: 'Active',
                  cancelText: 'Cancel',
                  onOk: () => {
                    unBanSupplier({ id: supplierId });
                  }
                });
              }}
              size="small"
            >
              Active Account
            </Button>
          )}
        </Row>
      </Col>
      <Col span={24}>
        <Row justify="space-between" align="middle">
          <Title level={5}>Supplier Reported List</Title>
          <Title level={5}>Total Report: {totalCount}</Title>
        </Row>
      </Col>
      <ReactTableLayout
        totalCount={totalCount}
        loading={loading}
        dispatchAction={getReport}
        searchProps={{
          exCondition: [supplierId],
          isDateRange: false,
          isSearch: false
        }}
        data={getFeedbackTable(feedbackData || [])}
        columns={columns}
      />
    </Row>
  );
};
export default connectToRedux(ListReportSupplierComponent);
