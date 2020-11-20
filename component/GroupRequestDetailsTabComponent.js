import {
  Button,
  Card,
  Descriptions,
  Drawer,
  Space,
  Typography,
  Modal
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { Fragment, useEffect, useState } from 'react';
import ListingRequestForGroupComponent from './ListingRequestForGroupComponent';
import RequestDetailsComponent from './RequestDetailsComponent';
import GroupStatusComponent from './Utils/GroupStatusComponent';
import {
  DATE_TIME_FORMAT,
  DEFAULT_PAGING_INFO,
  displayCurrency
} from '../utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  removeRequestFromGroup,
  addRequestToGroup,
  AddRequestToGroupData,
  AddRequestToGroupError
} from '../stores/GroupState';
import {
  getRequestByGroupId,
  getRequestByGroupIdData,
  getRequestByGroupIdError
} from '../stores/RequestState';
import Moment from 'react-moment';
import RequestStatusComponent from './Utils/RequestStatusComponent';

import ReactTableLayout from '../layouts/ReactTableLayout';
import { G_NEGOTIATING, G_PENDING } from '../enums/groupStatus';

const { Title } = Typography;
const groupRequestColumns = [
  // { title: "Product Name", dataIndex: "category", key: "category" },
  { title: 'Preferred Unit Price', dataIndex: 'price', key: 'price' },
  { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
  { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate' },
  { title: 'Actions', dataIndex: 'actions', key: 'actions' }
];

const connectToRedux = connect(
  createStructuredSelector({
    requestByGroupIdData: getRequestByGroupIdData,
    requestByGroupIdError: getRequestByGroupIdError,
    addRequestToGroupData: AddRequestToGroupData,
    addRequestToGroupError: AddRequestToGroupError
  }),
  (dispatch) => ({
    getRequestByGroupId: (pageIndex, pageSize, groupId) =>
      dispatch(getRequestByGroupId({ pageIndex, pageSize, groupId })),
    removeRequestFromGroup: ({ groupId, requestId, callback }) =>
      dispatch(removeRequestFromGroup({ groupId, requestId, callback })),
    addRequestToGroup: ({ groupId, requestIds, callback }) =>
      dispatch(addRequestToGroup({ groupId, requestIds, callback }))
  })
);

const getRequestTable = ({
  requestData = [],
  isCanRemove,
  status,
  groupId,
  setCurrentRequestSelected,
  setOpenRequestDetail,
  callbackGetRequestList,
  removeRequestFromGroup
}) => {
  return (
    requestData &&
    requestData.length > 0 &&
    requestData.map((request = {}) => ({
      key: request.id,
      price: displayCurrency(+request.preferredUnitPrice),
      name: request.product.description,
      quantity: +request.quantity || 0,
      dueDate: (
        <Moment format={DATE_TIME_FORMAT}>{new Date(request.dueDate)}</Moment>
      ),
      status: <RequestStatusComponent status={request.requestStatus.id} />,
      actions: (
        <Space>
          {(status === G_PENDING || status === G_NEGOTIATING) && isCanRemove && (
            <Button
              onClick={() => {
                Modal.confirm({
                  title: 'Do you want remove this request?',
                  icon: <ExclamationCircleOutlined />,
                  okText: 'Remove',
                  cancelText: 'Cancel',
                  onOk: () => {
                    removeRequestFromGroup({
                      groupId,
                      requestId: request.id,
                      callback: callbackGetRequestList
                    });
                  }
                });
              }}
              size="small"
              danger
            >
              Remove
            </Button>
          )}
          <Button
            onClick={() => {
              setCurrentRequestSelected(request);
              setOpenRequestDetail(true);
            }}
            size="small"
            type="link"
          >
            View
          </Button>
        </Space>
      )
    }))
  );
};

const GroupRequestDetailsTabComponent = ({
  group,
  getRequestByGroupId,
  requestByGroupIdData,
  removeRequestFromGroup,
  addRequestToGroup,
  addRequestToGroupData,
  groupId,
  getGroupDetails
}) => {
  const [isOpenAddRequest, setIsOpenAddRequest] = useState(false);
  const [openRequestDetail, setOpenRequestDetail] = useState(false);
  const [currentRequestSelected, setCurrentRequestSelected] = useState({});
  const [requestIdSelected, setRequestIdSelected] = useState([]);

  const callbackGetRequestList = () => {
    getRequestByGroupId(
      DEFAULT_PAGING_INFO.page,
      DEFAULT_PAGING_INFO.pageSize,
      groupId
    );
    typeof getGroupDetails === 'function' && getGroupDetails(groupId);
  };
  useEffect(() => {
    if (addRequestToGroupData) {
      setIsOpenAddRequest(false);
    }
  }, [addRequestToGroupData]);

  const {
    dateCreated,
    description,
    groupStatus,
    minPrice,
    maxPrice,
    quantity,
    averagePrice,
    product
  } = group;

  const { id: status } = groupStatus || {};
  const { productName, id: productId, unitOfMeasure } = product || {};
  const { description: unit } = unitOfMeasure || {};

  let requestData = [],
    totalRequest = 0;
  if (requestByGroupIdData) {
    requestData = requestByGroupIdData.data;
    totalRequest = requestByGroupIdData.total;
  }

  const isCanRemove = requestData.length > 1;
  return (
    <Fragment>
      <Drawer
        width={640}
        title="RFQ details"
        placement={'right'}
        closable={true}
        onClose={() => setOpenRequestDetail(false)}
        visible={openRequestDetail}
        key={'rfq-details'}
      >
        <RequestDetailsComponent
          isRemove={isCanRemove ? true : false}
          isSupplier={false}
          requestId={currentRequestSelected.id}
        />
      </Drawer>

      <Space direction="vertical">
        <Card
          title={<Title level={5}>Group Details</Title>}
          style={{ width: '100%' }}
        >
          <Descriptions>
            <Descriptions.Item label="Product Name" span={3}>
              <a
                rel="noreferrer"
                target="_blank"
                href={`/product-details?id=${productId}`}
              >
                <b>{productName}</b>
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <GroupStatusComponent status={status} />
            </Descriptions.Item>
            <Descriptions.Item label="Created date">
              {dateCreated}
            </Descriptions.Item>
            <Descriptions.Item label="Total Quantity">
              <b>
                {quantity} {unit}
              </b>
            </Descriptions.Item>
            <Descriptions.Item label="Average price in unit">
              <b>{displayCurrency(Math.floor(averagePrice))}</b>
            </Descriptions.Item>
            <Descriptions.Item label="Min RFQ price">
              <b>{displayCurrency(minPrice)}</b>
            </Descriptions.Item>
            <Descriptions.Item label="Max RFQ price">
              <b>{displayCurrency(maxPrice)}</b>
            </Descriptions.Item>

            <Descriptions.Item label="Description">
              {description}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card
          title={<Title level={5}>Request List</Title>}
          style={{ width: '100%' }}
        >
          <div>
            <ReactTableLayout
              hasAction={false}
              dispatchAction={getRequestByGroupId}
              searchProps={{
                exCondition: [groupId]
              }}
              data={getRequestTable({
                requestData: requestData || [],
                status,
                isCanRemove,
                setOpenRequestDetail,
                setCurrentRequestSelected,
                groupId,
                callbackGetRequestList,
                removeRequestFromGroup
              })}
              columns={groupRequestColumns}
              totalCount={totalRequest}
              footer={() =>
                status !== G_PENDING && status !== G_NEGOTIATING ? null : (
                  <Button
                    type="primary"
                    onClick={() => setIsOpenAddRequest(true)}
                  >
                    Add Requests
                  </Button>
                )
              }
            />
          </div>
        </Card>
      </Space>
      <Modal
        width={800}
        onCancel={() => setIsOpenAddRequest(false)}
        onOk={() => {
          if (requestIdSelected && requestIdSelected.length > 0) {
            addRequestToGroup({
              groupId,
              requestIds: requestIdSelected,
              callback: callbackGetRequestList
            });
          }
        }}
        title={
          <div>
            Add Requests created inside <i>{productName}</i>
          </div>
        }
        visible={isOpenAddRequest}
        okText="Add"
      >
        {isOpenAddRequest ? (
          <ListingRequestForGroupComponent
            setRequestIdSelected={(arrayId = []) => {
              setRequestIdSelected(arrayId);
            }}
            productId={productId}
          />
        ) : null}
      </Modal>
    </Fragment>
  );
};

export default connectToRedux(GroupRequestDetailsTabComponent);
