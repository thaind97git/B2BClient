import { Empty, Row, Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import TabsLayout from '../layouts/TabsLayout';
import {
  getGroupDetails,
  GetGroupDetailsData,
  GetGroupDetailsError
} from '../stores/GroupState';
import BiddingSettingComponent from './BiddingSettingComponent';
import BiddingSupplierReviewComponent from './BiddingSupplierReviewComponent';
import { createStructuredSelector } from 'reselect';
import { useRouter } from 'next/router';
const { Title } = Typography;
const connectToRedux = connect(
  createStructuredSelector({
    groupDetailsData: GetGroupDetailsData,
    groupDetailsError: GetGroupDetailsError
  }),
  (dispatch) => ({
    getGroupDetails: (id) => dispatch(getGroupDetails(id))
  })
);
const AdminBiddingCreateComponent = ({
  getGroupDetails,
  groupDetailsData,
  groupDetailsError
}) => {
  const [defaultTab, setDefaultTab] = useState('0');
  const router = useRouter();
  const { groupId } = router.query;
  const [values, setValues] = useState({});
  useEffect(() => {
    if (groupId) {
      getGroupDetails(groupId);
    }
  }, [groupId, getGroupDetails]);

  const BIDDING = [
    {
      title: 'Overview',
      key: '0',
      content: (
        <BiddingSettingComponent
          groupId={groupId}
          groupDetails={groupDetailsData}
          setDefaultTab={setDefaultTab}
          setValues={setValues}
          values={values}
        />
      )
    },
    {
      title: 'Suppliers',
      key: '1',
      content: (
        <BiddingSupplierReviewComponent
          groupId={groupId}
          values={values}
          setDefaultTab={setDefaultTab}
        />
      )
    }
  ];
  if (!groupDetailsData || groupDetailsError) {
    return <Empty description="Can not find any group!" />;
  }

  return (
    <div>
      <Row>
        <Title level={4}>New Event</Title>
      </Row>
      <div>
        <TabsLayout
          tabs={BIDDING}
          defaultTab={defaultTab}
          setDefaultTab={setDefaultTab}
        />
      </div>
      <style jsx global>
        {`
          .ant-checkbox-group-item {
            display: block;
            margin-right: 0;
          }
        `}
      </style>
    </div>
  );
};

export default connectToRedux(AdminBiddingCreateComponent);
