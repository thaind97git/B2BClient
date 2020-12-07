import { Button, Row, Space, Typography, Empty, Skeleton, Col } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import Router from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  GetGroupDetailsData,
  getGroupDetails,
  GetGroupDetailsResetter,
  GetGroupDetailsError
} from '../stores/GroupState';

import { createLink } from '../libs';
import TabsLayout from '../layouts/TabsLayout';
import GroupRequestDetailsTabComponent from './GroupRequestDetailsTabComponent';
import GroupRequestSuppliersTabComponent from './GroupRequestSuppliersTabComponent';
import { G_NEGOTIATING, G_PENDING } from '../enums/groupStatus';

const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    groupDetailsData: GetGroupDetailsData,
    groupDetailsError: GetGroupDetailsError
  }),
  (dispatch) => ({
    getGroupDetails: (id) => dispatch(getGroupDetails(id)),

    resetData: () => {
      dispatch(GetGroupDetailsResetter);
    }
  })
);

const GroupRequestDetailsComponent = ({
  getGroupDetails,
  groupDetailsData,
  resetData,
  groupDetailsError
}) => {
  const [loading, setLoading] = useState(true);
  const [defaultTab, setDefaultTab] = useState('0');
  const groupId = Router.query.id;

  useEffect(() => {
    if (!!groupId) {
      getGroupDetails(groupId);
    }
  }, [groupId, getGroupDetails]);

  useEffect(() => {
    if (groupDetailsData || groupDetailsError) {
      setLoading(false);
    }
  }, [groupDetailsData, groupDetailsError]);

  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

  if (loading) {
    return <Skeleton active />;
  }

  if (!groupDetailsData || groupDetailsError) {
    return <Empty description="Can not find any group!" />;
  }
  const { groupName, product, groupStatus = {} } = groupDetailsData;
  const { id: productId } = product || {};
  const GROUP_TABS = [
    {
      title: 'Group',
      key: '0',
      content: (
        <GroupRequestDetailsTabComponent
          group={groupDetailsData}
          groupId={groupId}
          getGroupDetails={getGroupDetails}
        />
      )
    },
    {
      title: 'Suppliers',
      key: '1',
      content: (
        <GroupRequestSuppliersTabComponent
          group={groupDetailsData}
          groupId={groupId}
          productId={productId}
        />
      )
    }
  ];
  return (
    <Fragment>
      <Row justify="space-between">
        <Col span={24} style={{ marginBottom: 16 }}>
          <Button
            type="link"
            onClick={() => {
              Router.push(`/aggregator/group`);
            }}
          >
            <LeftOutlined /> Back to group list
          </Button>
        </Col>
        <Title level={4}>Group Name: {groupName}</Title>
        <Space>
          <Button
            disabled={
              groupStatus.id !== G_NEGOTIATING && groupStatus.id !== G_PENDING || groupDetailsData?.quantity === 0
            }
            danger
            type="primary"
            onClick={() =>
              Router.push(
                createLink([
                  'aggregator',
                  'bidding',
                  `create?groupId=${groupId}`
                ])
              )
            }
          >
            Create Reverse Auction
          </Button>
        </Space>
      </Row>
      <Row>
        <Col span={24}>
          <TabsLayout
            defaultTab={defaultTab}
            setDefaultTab={setDefaultTab}
            tabPosition={'top'}
            tabs={GROUP_TABS}
          />
        </Col>
      </Row>
    </Fragment>
  );
};

export default connectToRedux(GroupRequestDetailsComponent);
