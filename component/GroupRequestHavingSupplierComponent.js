import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import { compose } from 'redux';
import {
  Button,
  Typography,
  Row,
  Space,
  Select,
  Modal,
  Input,
  Drawer
} from 'antd';
import ReactTableLayout from '../layouts/ReactTableLayout';
import {
  DATE_TIME_FORMAT,
  DEFAULT_DATE_RANGE,
  getUtcTime,
  openNotification
} from '../utils';
import GroupStatusComponent from './Utils/GroupStatusComponent';
import { createLink } from '../libs';
import { createStructuredSelector } from 'reselect';
import {
  acceptGroup,
  AcceptGroupData,
  AcceptGroupResetter,
  getGroupHavingSupplierPaging,
  GetGroupHavingSupplierPagingData
} from '../stores/GroupState';
import AllCategoryComponent from './AllCategoryComponent';
import Moment from 'react-moment';
import {
  G_BIDDING,
  G_DONE,
  G_FAILED,
  G_NEGOTIATING,
  G_ORDERED,
  G_PENDING,
  G_WAIT_FOR_AUCTION
} from '../enums/groupStatus';
import GroupRequestDrawerDetailsComponent from './GroupRequestDrawerDetailsComponent';

const { Title } = Typography;
const { Option } = Select;

const connectToRedux = connect(
  createStructuredSelector({
    groupPagingData: GetGroupHavingSupplierPagingData,
    acceptGroupData: AcceptGroupData
  }),
  (dispatch) => ({
    getGroupHavingSupplierPaging: (
      pageIndex,
      pageSize,
      searchMessage,
      dateRange,
      categoryId,
      status
    ) =>
      dispatch(
        getGroupHavingSupplierPaging({
          categoryId,
          productName: searchMessage,
          fromDate: dateRange.fromDate,
          toDate: dateRange.toDate,
          pageIndex,
          pageSize,
          status
        })
      ),
    acceptGroup: ({ groupName, groupId, description, callback }) =>
      dispatch(acceptGroup({ groupId, groupName, description, callback })),
    resetAcceptGroup: () => dispatch(AcceptGroupResetter)
  })
);

const enhance = compose(connectToRedux);

const columns = [
  // {
  //   title: 'Group Name',
  //   dataIndex: 'name',
  //   key: 'name'
  // },
  {
    title: 'Product Name',
    dataIndex: 'product',
    key: 'product'
  },
  {
    title: 'Total Quantity',
    dataIndex: 'totalQuantity',
    key: 'totalQuantity'
  },
  // {
  //   title: 'Total Suitable Supplier',
  //   dataIndex: 'totalSupplier',
  //   key: 'totalSupplier'
  // },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: 'Date Created',
    dataIndex: 'dateCreated',
    key: 'dateCreated'
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions'
  }
];

const GroupRequestHavingSupplierComponent = ({
  getGroupHavingSupplierPaging,
  groupPagingData,
  acceptGroup,
  acceptGroupData,
  resetAcceptGroup
}) => {
  const [searchMessage, setSearchMessage] = useState('');
  const [category, setCategory] = useState('all');
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [status, setStatus] = useState('all');
  const [openAcceptGroup, setOpenAcceptGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [currentGroupSelected, setCurrentGroupSelected] = useState(null);

  const [openGroupDetails, setOpenGroupDetails] = useState(false);
  const [desc, setDesc] = useState('');

  useEffect(() => {
    if (!!acceptGroupData) {
      setCurrentGroupSelected(null);
      resetAcceptGroup();
      setOpenAcceptGroup(false);
    }
  }, [acceptGroupData, resetAcceptGroup]);

  const getGroupTable = (groupData = []) => {
    return (
      groupData &&
      groupData.length > 0 &&
      groupData.map((group = {}) => {
        return {
          key: group.id,
          name: group.groupName,
          product: group.product.description,
          dateCreated: (
            <Moment format={DATE_TIME_FORMAT}>
              {getUtcTime(group.dateCreated)}
            </Moment>
          ),
          status: <GroupStatusComponent status={group.groupStatus.id} />,
          totalQuantity: `${group?.totalQuantity} ${group.requests?.[0]?.product?.unitType}`,
          totalSupplier: group?.totalSuppliers,
          actions: (
            <Space>
              <Button
                onClick={() => {
                  setCurrentGroupSelected(group);
                  setOpenAcceptGroup(true);
                }}
                size="small"
                icon={
                  <span>
                    <img
                      width={14}
                      src="/static/images/receive-group.png"
                      alt="receive-group"
                    />
                    <span>&nbsp;&nbsp;</span>
                  </span>
                }
              >
                Receive group
              </Button>
              <Button
                onClick={() => {
                  setOpenGroupDetails(true);
                  setCurrentGroupSelected(group);
                  // Router.push(
                  //   createLink([
                  //     'aggregator',
                  //     'group',
                  //     `details?id=${group.id}`
                  //   ])
                  // );
                }}
                size="small"
                type="link"
              >
                View
              </Button>
            </Space>
          )
        };
      })
    );
  };
  let groupData = [],
    total = 0;
  if (groupPagingData) {
    groupData = groupPagingData.data;
    total = groupPagingData.total;
  }
  return (
    <div>
      {/* <Row justify="space-between" align="middle">
        <Title level={3}>Group Management</Title>
      </Row> */}
      <Modal
        title="Enter the group name to manage this group"
        centered
        visible={openAcceptGroup}
        onOk={() => {
          if (!groupName) {
            openNotification('error', {
              message: 'Please enter the group name'
            });
            return;
          }
          currentGroupSelected &&
            acceptGroup({
              groupName,
              groupId: currentGroupSelected.id,
              description: desc,
              callback: () => {
                getGroupHavingSupplierPaging(
                  0,
                  10,
                  searchMessage,
                  dateRange,
                  null,
                  status
                );
              }
            });
        }}
        onCancel={() => setOpenAcceptGroup(false)}
        width={640}
      >
        <Input
          placeholder="Enter the group name"
          value={groupName}
          onChange={(event) => setGroupName(event.target.value)}
        />
        <br />
        <br />
        <Input.TextArea
          placeholder="Enter the group description"
          value={desc}
          onChange={(event) => setDesc(event.target.value)}
        />
      </Modal>

      <Drawer
        width={640}
        title="Group Details"
        placement={'right'}
        closable={true}
        onClose={() => setOpenGroupDetails(false)}
        visible={openGroupDetails}
        key={'right'}
      >
        {openGroupDetails && currentGroupSelected ? (
          <GroupRequestDrawerDetailsComponent
            groupId={currentGroupSelected?.id}
          />
        ) : null}
      </Drawer>
      <ReactTableLayout
        dispatchAction={getGroupHavingSupplierPaging}
        searchProps={{
          placeholder: 'Search By Product Name',
          searchMessage,
          setSearchMessage,
          exElement: (
            <Space>
              {/* <Select
                size="large"
                placeholder="Filter by status"
                style={{ width: 140 }}
                onChange={(value) => setStatus(value)}
                defaultValue=""
              >
                <Option value="">All Status</Option>
                <Option value={G_PENDING}>Pending</Option>
                <Option value={G_BIDDING}>Bidding</Option>
                <Option value={G_NEGOTIATING}>Negotiating</Option>
                <Option value={G_WAIT_FOR_AUCTION}>Wait for auction</Option>
                <Option value={G_DONE}>Done</Option>
                <Option value={G_ORDERED}>Ordered</Option>
                <Option value={G_FAILED}>Failed</Option>
              </Select> */}
              <AllCategoryComponent
                onGetLastValue={(value) => {
                  setCategory(value);
                }}
                size="large"
                isSearchStyle={false}
              />
            </Space>
          ),
          exCondition: [category, status]
        }}
        dateRangeProps={{
          dateRange,
          setDateRange
        }}
        data={getGroupTable(groupData || [])}
        totalCount={total}
        columns={columns}
      />
    </div>
  );
};
export default enhance(GroupRequestHavingSupplierComponent);
