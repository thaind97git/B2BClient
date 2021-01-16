import {
  Avatar,
  Col,
  Descriptions,
  Divider,
  Empty,
  Row,
  Skeleton,
  Table,
  Typography
} from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  getGroupDetails,
  GetGroupDetailsData,
  GetGroupDetailsError,
  GetGroupDetailsResetter
} from '../stores/GroupState';
import { createStructuredSelector } from 'reselect';
import GroupStatusComponent from './Utils/GroupStatusComponent';
import { displayCurrency, getUtcTime } from '../utils';
import {
  getSupplierByGroupId,
  GetSupplierByGroupIdData,
  GetSupplierByGroupIdError
} from '../stores/SupplierState';
import QuotationListDisplayComponent from './Utils/QuotationListDisplayComponent';
const { Title } = Typography;
const connectToRedux = connect(
  createStructuredSelector({
    groupDetailsData: GetGroupDetailsData,
    groupDetailsError: GetGroupDetailsError,
    supplierByGroupIdData: GetSupplierByGroupIdData,
    supplierByGroupIdError: GetSupplierByGroupIdError
  }),
  (dispatch) => ({
    getGroupDetails: (id) => dispatch(getGroupDetails(id)),
    getSupplierByGroupId: (pageIndex, pageSize, groupId) =>
      dispatch(getSupplierByGroupId({ groupId, pageIndex, pageSize })),
    resetData: () => {
      dispatch(GetGroupDetailsResetter);
    }
  })
);

const columns = [
  {
    title: 'Supplier Name',
    dataIndex: 'supplierName',
    key: 'supplierName'
  },
  {
    title: 'Quotations',
    dataIndex: 'quotations',
    key: 'quotations'
  }
];
const DescriptionItem = ({ title, content }) => (
  <Col span={24}>
    <Row className="site-description-item-profile-wrapper">
      <Col span={8}>
        <p className="site-description-item-profile-p-label">{title}:</p>
      </Col>
      <Col span={16}>
        <b>{content}</b>
      </Col>
    </Row>
  </Col>
);
const GroupRequestDrawerDetailsComponent = ({
  groupId,
  getGroupDetails,
  groupDetailsData,
  resetData,
  groupDetailsError,
  getSupplierByGroupId,
  supplierByGroupIdData,
  supplierByGroupIdError
}) => {
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    getSupplierByGroupId(1, 100, groupId);
  }, [getSupplierByGroupId, groupId]);

  if (loading) {
    return <Skeleton active />;
  }

  if (!groupDetailsData || groupDetailsError) {
    return <Empty description="Can not find any group!" />;
  }
  let supplierData = [],
    totalSupplier = 0;
  if (supplierByGroupIdData) {
    supplierData = supplierByGroupIdData.data;
    totalSupplier = supplierByGroupIdData.total;
  }
  console.log({ groupDetailsData });
  const {
    groupName,
    product,
    groupStatus = {},
    quantity,
    averagePrice,
    minPrice,
    maxPrice,
    dateCreated
  } = groupDetailsData;
  const { id: productId } = product || {};
  return (
    <Row span={24}>
      <DescriptionItem
        title="Group Status"
        content={<GroupStatusComponent status={groupStatus.id} />}
      />
      <DescriptionItem title="Product Name" content={product?.productName} />
      <DescriptionItem
        title="Total Quantity"
        content={`${quantity} ${product?.unitOfMeasure?.description}`}
      />
      <DescriptionItem
        title="Average Price"
        content={displayCurrency(averagePrice)}
      />
      <DescriptionItem
        title="Min RFQ Price"
        content={displayCurrency(minPrice)}
      />
      <DescriptionItem
        title="Max RFQ Price"
        content={displayCurrency(maxPrice)}
      />
      <DescriptionItem title="Date Created" content={getUtcTime(dateCreated)} />
      <Divider />
      <Col span={24}>
        <Title level={5}>Suitable Suppliers</Title>
      </Col>
      <Col span={24}>
        <Table
          pagination={false}
          bordered
          columns={columns}
          dataSource={supplierData?.map((item, index) => {
            return {
              key: index,
              supplierName: `${item?.firstName} ${item.lastName}`,
              quotations: (
                <QuotationListDisplayComponent
                  isTooltip
                  quotations={item.description}
                />
              )
            };
          })}
        />
      </Col>
      <style jsx global>{`
        .site-description-item-profile-wrapper {
          margin-bottom: 7px;
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
          line-height: 1.5715;
        }

        [data-theme='compact'] .site-description-item-profile-wrapper {
          font-size: 24px;
          line-height: 1.66667;
        }

        .ant-drawer-body p.site-description-item-profile-p {
          display: block;
          margin-bottom: 16px;
          color: rgba(0, 0, 0, 0.85);
          font-size: 16px;
          line-height: 1.5715;
        }

        [data-theme='compact']
          .ant-drawer-body
          p.site-description-item-profile-p {
          font-size: 14px;
          line-height: 1.66667;
        }

        .site-description-item-profile-p-label {
          display: inline-block;
          margin-right: 8px;
          color: rgba(0, 0, 0, 0.85);
        }
      `}</style>
    </Row>
  );
};

export default connectToRedux(GroupRequestDrawerDetailsComponent);
