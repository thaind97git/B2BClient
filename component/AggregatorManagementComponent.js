import {
  Button,
  Drawer,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Typography
} from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import ReactTableLayout from '../layouts/ReactTableLayout';
import { DEFAULT_DATE_RANGE, openNotification } from '../utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { get } from 'lodash/fp';
import {
  getAggregatorPaging,
  GetAggregatorPagingData,
  GetAggregatorPagingError
} from '../stores/BuyerState';
import {
  banUser,
  BanUserData,
  BanUserResetter,
  unBanUser,
  UnBanUserData,
  UnBanUserResetter
} from '../stores/SupplierState';
import UserStatusComponent from './Utils/UserStatusComponent';
import {
  U_ACTIVE,
  U_BANNED,
  U_PENDING,
  U_REJECT
} from '../enums/accountStatus';
import UserProfileComponent from './UserProfileComponent';
import ListRFQCanceledBuyerComponent from './ListRFQCanceledBuyerComponent';
import { MODERATOR } from '../enums/accountRoles';
const { Option } = Select;
const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    aggregatorPagingData: GetAggregatorPagingData,
    aggregatorPagingError: GetAggregatorPagingError,
    banUserData: BanUserData,
    unBanUserData: UnBanUserData
  }),
  (dispatch) => ({
    getAggregatorPaging: (
      pageIndex,
      pageSize,
      searchMessage,
      dateRange,
      status
    ) => {
      dispatch(
        getAggregatorPaging({
          pageSize,
          pageIndex,
          email: searchMessage,
          statusId: status
        })
      );
    },
    banUser: ({ id, description }) =>
      dispatch(banUser({ id, description, isSupplier: false })),
    unBanUser: ({ id }) => dispatch(unBanUser({ id, isSupplier: false })),
    resetBanAndUnBan: () => {
      dispatch(BanUserResetter);
      dispatch(UnBanUserResetter);
    }
  })
);

const columns = [
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: 'Full Name',
    dataIndex: 'fullName',
    key: 'fullName'
  },
  // {
  //   title: 'Company Name',
  //   dataIndex: 'companyName',
  //   key: 'companyName'
  // },
  {
    title: 'Phone Number',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber'
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: 'Details',
    dataIndex: 'actions',
    key: 'actions'
  }
];

const AggregatorManagementComponent = ({
  getAggregatorPaging,
  aggregatorPagingData,
  aggregatorPagingError,
  banUserData,
  unBanUserData,
  resetBanAndUnBan,
  banUser,
  unBanUser
}) => {
  const [searchMessage, setSearchMessage] = useState('');
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [openDetails, setOpenDetails] = useState(false);
  const [currentAggregatorSelected, setCurrentAggregatorSelected] = useState(
    {}
  );
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [banReason, setBanReason] = useState('');
  const [openBan, setOpenBan] = useState(false);

  useEffect(() => {
    if (banUserData) {
      setOpenDetails(false);
      setBanReason('');
      setOpenBan(false);
      resetBanAndUnBan();
      getAggregatorPaging(0, 10, '', {}, status);
    }
  }, [banUserData, resetBanAndUnBan, getAggregatorPaging, status]);

  useEffect(() => {
    if (unBanUserData) {
      setOpenDetails(false);
      setBanReason('');
      resetBanAndUnBan();
      getAggregatorPaging(0, 10, '', {}, status);
    }
  }, [unBanUserData, resetBanAndUnBan, getAggregatorPaging, status]);

  useEffect(() => {
    if (aggregatorPagingError || aggregatorPagingData) {
      setLoading(false);
    }
  }, [aggregatorPagingError, aggregatorPagingData]);

  function handleChange(value) {
    setStatus(value);
  }
  const getAggregatorData = (aggregatorData = []) => {
    return aggregatorData
      ? aggregatorData.map((aggregator = {}) => {
          const aggregatorStatus = get('userStatus.id')(aggregator);
          return {
            key: aggregator.id,
            email: aggregator.email,
            fullName: `${aggregator.firstName} ${aggregator.lastName}`,
            companyName: aggregator.companyName,
            phoneNumber: aggregator.phoneNumber,
            status: <UserStatusComponent status={aggregatorStatus} />,
            actions: (
              <Button
                onClick={() => {
                  setCurrentAggregatorSelected(aggregator);
                  setOpenDetails(true);
                }}
                size="small"
                type="link"
              >
                View
              </Button>
            )
          };
        })
      : [];
  };

  let aggregatorData = [],
    totalCount = 0;
  if (!!aggregatorPagingData) {
    aggregatorData = aggregatorPagingData.data;
    totalCount = aggregatorPagingData.total;
  }
  return (
    <div>
      <Modal
        okText="Ban"
        title="Ban Aggregator"
        visible={openBan}
        onOk={() => {
          const banTrimmed = banReason && banReason.trim();
          if (!banTrimmed) {
            openNotification('error', {
              message: 'Please input the reason to ban account!'
            });
            return;
          }
          console.log({ banReason });
          !!banReason.trim() &&
            banUser({
              id: (currentAggregatorSelected || {}).id,
              description: banReason
            });
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
      <Row justify="space-between">
        <Drawer
          width={840}
          title="Aggregator Details"
          placement={'right'}
          closable={true}
          onClose={() => setOpenDetails(false)}
          visible={openDetails}
          key={'right'}
        >
          {openDetails ? (
            <Fragment>
              <UserProfileComponent
                role={MODERATOR}
                isAdmin={true}
                isDrawer
                userId={(currentAggregatorSelected || {}).id}
              />
              <Row justify="end">
                {get('userStatus.id')(currentAggregatorSelected) ===
                  U_BANNED && (
                  <Button
                    onClick={() => {
                      Modal.confirm({
                        title: 'Are you sure you want to active this account?',
                        icon: <ExclamationCircleOutlined />,
                        okText: 'Active',
                        cancelText: 'Cancel',
                        onOk: () => {
                          unBanUser({
                            id: (currentAggregatorSelected || {}).id
                          });
                        }
                      });
                    }}
                    size="small"
                    type="primary"
                  >
                    Active Aggregator
                  </Button>
                )}
                {get('userStatus.id')(currentAggregatorSelected) ===
                  U_ACTIVE && (
                  <Button
                    onClick={() => {
                      setOpenBan(true);
                    }}
                    danger
                    type="primary"
                    size="small"
                  >
                    Ban Aggregator
                  </Button>
                )}
              </Row>
            </Fragment>
          ) : null}
        </Drawer>
        <Title level={4}>Aggregator Management</Title>
      </Row>
      <ReactTableLayout
        totalCount={totalCount}
        loading={loading}
        dispatchAction={getAggregatorPaging}
        searchProps={{
          placeholder: 'Search by email',
          searchMessage,
          setSearchMessage,
          exElement: (
            <Select
              size="large"
              placeholder="Filter by status"
              style={{ width: 200 }}
              onChange={handleChange}
              defaultValue="all"
            >
              <Option value="all">All Status</Option>
              <Option value={U_PENDING}>Pending</Option>
              <Option value={U_ACTIVE}>Activating</Option>
              <Option value={U_BANNED}>Banned</Option>
              <Option value={U_REJECT}>Rejected</Option>
            </Select>
          ),
          exCondition: [status],
          isDateRange: false
        }}
        dateRangeProps={{
          dateRange,
          setDateRange
        }}
        data={getAggregatorData(aggregatorData || [])}
        columns={columns}
      />
    </div>
  );
};

export default connectToRedux(AggregatorManagementComponent);
