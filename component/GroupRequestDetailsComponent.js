import { Button, Row, Space, Typography, Empty, Skeleton, Col } from 'antd';

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
  const { groupName, product } = groupDetailsData;
  const { id: productId } = product || {};
  const GROUP_TABS = [
    {
      title: 'Group',
      key: '0',
      content: (
        <GroupRequestDetailsTabComponent
          group={groupDetailsData}
          groupId={groupId}
        />
      )
    },
    {
      title: 'Suppliers',
      key: '1',
      content: (
        <GroupRequestSuppliersTabComponent
          groupId={groupId}
          productId={productId}
        />
      )
    }
  ];
  return (
    <Fragment>
      <Row justify="space-between">
        <Title level={4}>Group Name: {groupName}</Title>
        <Space>
          <Button
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
            onTabClick={(key) => {
              console.log({ key });
            }}
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
