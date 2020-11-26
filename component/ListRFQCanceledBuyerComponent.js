import { Button, Col, Drawer, Input, Modal, Row, Typography } from 'antd';
import { get } from 'lodash/fp';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { U_ACTIVE, U_BANNED, U_PENDING } from '../enums/accountStatus';
import { F_AUCTION, F_ORDER, F_RFQ, F_SYSTEM } from '../enums/feedbackType';
import ReactTableLayout from '../layouts/ReactTableLayout';
import {
  getRequestCanceledByUser,
  GetRequestCanceledByUserData,
  GetRequestCanceledByUserError,
  GetRequestCanceledByUserResetter
} from '../stores/RequestState';
import {
  banUser,
  BanUserData,
  BanUserResetter,
  unBanUser,
  UnBanUserData,
  UnBanUserResetter
} from '../stores/SupplierState';
import { getUser, getUserData } from '../stores/UserState';
import {
  DATE_TIME_FORMAT,
  displayCurrency,
  getUtcTime,
  openNotification
} from '../utils';
import FeedbackTypeComponent from './Utils/FeedbackTypeComponent';
import RequestStatusComponent from './Utils/RequestStatusComponent';
import UserStatusComponent from './Utils/UserStatusComponent';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Moment from 'react-moment';
import RequestDetailsComponent from './RequestDetailsComponent';

const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    requestData: GetRequestCanceledByUserData,
    requestError: GetRequestCanceledByUserError,
    getUserData: getUserData,
    banUserData: BanUserData,
    unBanUserData: UnBanUserData
  }),
  (dispatch) => ({
    getRFQCanceled: (
      pageIndex,
      pageSize,
      searchMessage,
      dateRange,
      buyerId
    ) => {
      dispatch(
        getRequestCanceledByUser({
          pageSize,
          pageIndex,
          buyerId
        })
      );
    },
    resetListRequest: () => dispatch(GetRequestCanceledByUserResetter),
    banUser: ({ id, description }) =>
      dispatch(banUser({ id, description, isSupplier: false })),
    unBanUser: ({ id }) => dispatch(unBanUser({ id, isSupplier: false })),
    resetBanAndUnBan: () => {
      dispatch(BanUserResetter);
      dispatch(UnBanUserResetter);
    },
    getUser: (id) => dispatch(getUser(id))
  })
);
const columns = [
  {
    title: 'Product Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Preferred Unit Price',
    dataIndex: 'price',
    key: 'price'
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity'
  },
  // {
  //   title: 'Due Date',
  //   dataIndex: 'dueDate',
  //   key: 'dueDate'
  // },

  {
    title: 'View Details',
    dataIndex: 'actions',
    key: 'actions'
  }
];
const ListRFQCanceledBuyerComponent = ({
  buyerId,
  getRFQCanceled,
  requestData,
  requestError,
  resetListRequest,
  banUser,
  unBanUser,
  getUserData,
  banUserData,
  unBanUserData,
  resetBanAndUnBan,
  getUser
}) => {
  const [loading, setLoading] = useState(true);
  const [banReason, setBanReason] = useState('');
  const [openBan, setOpenBan] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [currentRequestSelected, setCurrentRequestSelected] = useState({});
  useEffect(() => {
    if (requestData || requestError) {
      setLoading(false);
    }
  }, [requestData, requestError]);

  useEffect(() => {
    if (banUserData) {
      setBanReason('');
      setOpenBan(false);
      resetBanAndUnBan();
      getRFQCanceled(0, 10, '', {}, buyerId);
      getUser(buyerId);
    }
  }, [banUserData, resetBanAndUnBan, getRFQCanceled, buyerId, getUser]);

  useEffect(() => {
    if (unBanUserData) {
      setBanReason('');
      resetBanAndUnBan();
      getRFQCanceled(0, 10, '', {}, buyerId);
      getUser(buyerId);
    }
  }, [unBanUserData, resetBanAndUnBan, buyerId, getRFQCanceled, getUser]);

  useEffect(() => {
    return () => {
      resetListRequest();
    };
  }, [resetListRequest]);

  if (!buyerId) {
    return null;
  }
  if (!getUserData) {
    return null;
  }
  const getRequestTable = (requestData = []) => {
    return (
      requestData &&
      requestData.length > 0 &&
      requestData.map((request = {}) => ({
        productId: get('product.id')(request),
        key: request.id,
        price: displayCurrency(+request.preferredUnitPrice),
        name: get('product.description')(request),
        quantity:
          +request.quantity || 0 + ' ' + get('product.unitType')(request),
        dueDate: (
          <Moment format={DATE_TIME_FORMAT}>
            {getUtcTime(request.dueDate)}
          </Moment>
        ),
        status: <RequestStatusComponent status={request.requestStatus.id} />,
        actions: (
          <Button
            onClick={() => {
              setCurrentRequestSelected(request);
              setOpenDetails(true);
            }}
            size="small"
            type="link"
          >
            View
          </Button>
        )
      }))
    );
  };
  let requestDataTable = [],
    totalCount = 0;
  if (!!requestData) {
    requestDataTable = requestData.data;
    totalCount = requestData.total;
  }
  return (
    <Row>
      <Drawer
        width={640}
        title="RFQ details"
        placement={'right'}
        closable={true}
        onClose={() => setOpenDetails(false)}
        visible={openDetails}
        key={'right'}
      >
        {openDetails ? (
          <RequestDetailsComponent
            setOpenDetails={setOpenDetails}
            requestId={(currentRequestSelected || {}).id}
            isSupplier={false}
          />
        ) : null}
      </Drawer>
      <Modal
        okText="Ban"
        title="Ban Buyer"
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
            banUser({ id: buyerId, description: banReason });
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
          {(get('userStatus.id')(getUserData) === U_PENDING ||
            get('userStatus.id')(getUserData) === U_BANNED) && (
            <Button
              type="primary"
              onClick={() => {
                Modal.confirm({
                  title: 'Are you sure you want to active this account?',
                  icon: <ExclamationCircleOutlined />,
                  okText: 'Active',
                  cancelText: 'Cancel',
                  onOk: () => {
                    unBanUser({ id: buyerId });
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
          <Title level={5}>Buyer RFQ Canceled List</Title>
          <Title level={5}>Total RFQ Canceled: {totalCount}</Title>
        </Row>
      </Col>
      <ReactTableLayout
        totalCount={totalCount}
        loading={loading}
        dispatchAction={getRFQCanceled}
        searchProps={{
          exCondition: [buyerId],
          isDateRange: false,
          isSearch: false
        }}
        data={getRequestTable(requestDataTable || [])}
        columns={columns}
      />
    </Row>
  );
};

export default connectToRedux(ListRFQCanceledBuyerComponent);
