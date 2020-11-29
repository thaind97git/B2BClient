import {
  Button,
  Col,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Typography
} from 'antd';
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
import { getUtcTime, openNotification } from '../utils';
import { getUser, getUserData } from '../stores/UserState';
import {
  approveSupplier,
  ApproveSupplierData,
  ApproveSupplierResetter,
  banUser,
  BanUserData,
  BanUserResetter,
  rejectSupplier,
  RejectSupplierData,
  RejectSupplierResetter,
  unBanUser,
  UnBanUserData,
  UnBanUserResetter
} from '../stores/SupplierState';
import { get } from 'lodash/fp';
import DisplayStarComponent from './Utils/DisplayStarComponent';
import {
  ASCENDING,
  DESCENDING,
  HIGHEST_RATING,
  LOWEST_RATING
} from '../enums/sortFeedback';
const { Title } = Typography;
const { Option } = Select;
const connectToRedux = connect(
  createStructuredSelector({
    reportData: GetFeedbackReportedForSupplierData,
    reportError: GetFeedbackReportedForSupplierError,
    getUserData: getUserData,
    banUserData: BanUserData,
    unBanUserData: UnBanUserData,
    approveData: ApproveSupplierData,
    rejectData: RejectSupplierData
  }),
  (dispatch) => ({
    getReport: (
      pageIndex,
      pageSize,
      searchMessage,
      dateRange = {},
      supplierId
    ) => {
      dispatch(
        getFeedbackReportedForSupplier({
          pageSize,
          pageIndex,
          supplierId,
          fromDate: dateRange.fromDate,
          toDate: dateRange.toDate
        })
      );
    },
    resetListReport: () => dispatch(GetFeedbackReportedForSupplierResetter),
    banSupplier: ({ id, description }) =>
      dispatch(banUser({ id, description })),
    unBanSupplier: ({ id }) => dispatch(unBanUser({ id })),
    resetAccountData: () => {
      dispatch(BanUserResetter);
      dispatch(UnBanUserResetter);
      dispatch(ApproveSupplierResetter);
      dispatch(RejectSupplierResetter);
    },
    getUser: (id) => dispatch(getUser(id)),
    approveSupplier: ({ id }) => dispatch(approveSupplier({ id })),
    rejectSupplier: ({ id }) => dispatch(rejectSupplier({ id }))
  })
);
const columns = [
  {
    title: 'Feedback From',
    dataIndex: 'from',
    key: 'from'
  },
  {
    title: 'Date Created',
    dataIndex: 'createdAt',
    key: 'createdAt'
  },
  // {
  //   title: 'Quantity',
  //   dataIndex: 'quantity',
  //   key: 'quantity'
  // },
  // {
  //   title: 'Unit Price',
  //   dataIndex: 'unitPrice',
  //   key: 'unitPrice'
  // },
  {
    title: 'Average Rating',
    dataIndex: 'averageRatingOrder',
    key: 'averageRatingOrder'
  },
  {
    title: 'Details',
    dataIndex: 'detail',
    key: 'detail'
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
  resetAccountData,
  getUser,
  approveData,
  rejectData,
  rejectSupplier,
  approveSupplier
}) => {
  const [loading, setLoading] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [openBan, setOpenBan] = useState(false);
  const [sortBy, setSortBy] = useState(DESCENDING);
  useEffect(() => {
    if (reportData || reportError) {
      setLoading(false);
    }
  }, [reportData, reportError]);

  useEffect(() => {
    if (approveData) {
      resetAccountData();
      getReport(0, 10, '', {}, supplierId);
      getUser(supplierId);
    }
  }, [approveData, resetAccountData, getReport, supplierId, getUser]);

  useEffect(() => {
    if (rejectData) {
      resetAccountData();
      getReport(0, 10, '', {}, supplierId);
      getUser(supplierId);
    }
  }, [rejectData, resetAccountData, getReport, supplierId, getUser]);
  useEffect(() => {
    if (banUserData) {
      setBanReason('');
      setOpenBan(false);
      resetAccountData();
      getReport(0, 10, '', {}, supplierId);
      getUser(supplierId);
    }
  }, [banUserData, resetAccountData, getReport, supplierId, getUser]);

  useEffect(() => {
    if (unBanUserData) {
      setBanReason('');
      resetAccountData();
      getReport(0, 10, '', {}, supplierId);
      getUser(supplierId);
    }
  }, [unBanUserData, resetAccountData, supplierId, getReport, getUser]);

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
      feedbackData.map((feedback = {}) => {
        const { id, averageRating, dateCreated, buyer } = feedback || [];
        return {
          key: feedback.id,
          from: buyer.email,
          createdAt: getUtcTime(dateCreated),
          averageRatingOrder: <DisplayStarComponent star={averageRating} />,
          detail: (
            <a
              target="_blank"
              rel="noreferrer"
              href={`/admin/feedback/details?id=${id}`}
            >
              View
            </a>
          )
        };
      })
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
              }}
              size="small"
            >
              Ban Account
            </Button>
          )}
          {get('userStatus.id')(getUserData) === U_PENDING && (
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  Modal.confirm({
                    title: 'Are you sure you want to approve this account?',
                    icon: <ExclamationCircleOutlined />,
                    okText: 'Approve',
                    cancelText: 'Cancel',
                    onOk: () => {
                      approveSupplier({ id: supplierId });
                    }
                  });
                }}
                size="small"
              >
                Approve Account
              </Button>
              <Button
                danger
                onClick={() => {
                  Modal.confirm({
                    title: 'Are you sure you want to reject this account?',
                    icon: <ExclamationCircleOutlined />,
                    okText: 'Reject',
                    cancelText: 'Cancel',
                    onOk: () => {
                      rejectSupplier({ id: supplierId });
                    }
                  });
                }}
                size="small"
              >
                Reject Account
              </Button>
            </Space>
          )}
          {get('userStatus.id')(getUserData) === U_BANNED && (
            <Button
              type="primary"
              onClick={() => {
                Modal.confirm({
                  title: 'Are you sure you want to active this account?',
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
          <Title level={5}>Order Feedback List</Title>
          <Title level={5}>Total: {totalCount}</Title>
        </Row>
      </Col>
      <ReactTableLayout
        totalCount={totalCount}
        loading={loading}
        dispatchAction={getReport}
        searchProps={{
          exCondition: [supplierId, sortBy],
          isDateRange: false,
          isSearch: false,
          exElement: (
            <Space>
              <Select
                size="small"
                placeholder="Sort"
                style={{ width: 200 }}
                onChange={(value) => setSortBy(value)}
                defaultValue={DESCENDING}
              >
                <Option value={DESCENDING}>Date recently</Option>
                <Option value={ASCENDING}>Date oldest</Option>
                <Option value={LOWEST_RATING}>Lowest rating</Option>
                <Option value={HIGHEST_RATING}>Highest rating</Option>
              </Select>
            </Space>
          )
        }}
        data={getFeedbackTable(feedbackData || [])}
        columns={columns}
      />
    </Row>
  );
};
export default connectToRedux(ListReportSupplierComponent);
