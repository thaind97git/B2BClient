import {
  Button,
  Col,
  Divider,
  Empty,
  Modal,
  Row,
  Skeleton,
  Space,
  Tag,
  Typography
} from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import {
  R_CANCELED,
  R_GROUPED,
  R_NEGOTIATING,
  R_PENDING
} from '../enums/requestStatus';
import RequestStatusComponent from './Utils/RequestStatusComponent';
import { DATE_TIME_FORMAT, displayCurrency } from '../utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  CancelRequestData,
  getRequestDetails,
  GetRequestDetailsDataSelector,
  getRequestDetailsResetter,
  RejectRequestData
} from '../stores/RequestState';
import Moment from 'react-moment';
import Router from 'next/router';
import RequestCancelComponent from './RequestCancelComponent';
import RequestRejectComponent from './RequestRejectComponent';
const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    cancelRequestData: CancelRequestData,
    rejectRequestData: RejectRequestData
  }),
  (dispatch) => ({
    resetData: () => {
      dispatch(getRequestDetailsResetter);
    }
  })
);

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

const RequestDetailsForSupplierComponent = ({ requestDetailsData }) => {
  const [loading, setLoading] = useState(true);
  const [openCancel, setOpenCancel] = useState(false);
  const [openReject, setOpenReject] = useState(false);

  useEffect(() => {
    if (!!requestDetailsData) {
      setLoading(false);
    }
  }, [requestDetailsData]);

  if (loading) {
    return <Skeleton active />;
  }
  const {
    product = {},
    shippingMethod = {},
    sourcingType = {},
    sourcingPurpose = {},
    quantity,
    tradeTerm = {},
    preferredUnitPrice,
    dueDate,
    description,
    certifications = [],
    leadTime,
    requestStatus = {},
    district = {},
    ward = {},
    province = {},
    address,
    cancelReason,
    buyer = {},
    otherRequirements,
    group = {}
  } = requestDetailsData || {};

  const leadTimeDisplay = `Ship in ${leadTime} day(s) after supplier receives the initial payment`;
  return (
    <Row style={{ width: '100%' }}>
      <Modal
        onOk={() => setOpenCancel(false)}
        onCancel={() => setOpenCancel(false)}
        title="Cancel RFQ"
        visible={openCancel}
        footer={false}
      >
        {openCancel ? (
          <RequestCancelComponent requestId={(requestDetailsData || {}).id} />
        ) : null}
      </Modal>
      <Modal
        onOk={() => setOpenReject(false)}
        onCancel={() => setOpenReject(false)}
        title="Reject RFQ"
        visible={openReject}
        footer={false}
      >
        {openReject ? (
          <RequestRejectComponent requestId={(requestDetailsData || {}).id} />
        ) : null}
      </Modal>

      <Col style={{ padding: '12px 0px' }} span={24}>
        Status: <RequestStatusComponent status={requestStatus.id} />
      </Col>

      <Col span={24}>
        <Title level={5}>Product Basic Information</Title>
      </Col>
      <DescriptionItem
        title="Product Name"
        content={
          <a
            href={`/product-details?id=${product.id}`}
            target="_blank"
            rel="noreferrer"
          >
            {product.description}
          </a>
        }
      />
      <DescriptionItem
        title="Sourcing Type"
        content={sourcingType.description}
      />
      <DescriptionItem
        title="Sourcing Purpose"
        content={sourcingPurpose.description || 'N/A'}
      />
      <DescriptionItem
        title="Quantity"
        content={`${quantity} ${product.unitType}`}
      />
      <DescriptionItem title="Trade Term" content={tradeTerm.description} />
      <DescriptionItem
        title="Preferred Unit Price"
        content={displayCurrency(preferredUnitPrice)}
      />
      <DescriptionItem
        title="Due Date"
        content={<Moment format={DATE_TIME_FORMAT}>{dueDate}</Moment>}
      />
      <DescriptionItem title="Descriptions" content={description} />
      <Divider />
      <Col span={24}>
        <Title level={5}>Supplier Capability</Title>
      </Col>
      <DescriptionItem
        title="Certifications"
        content={certifications.map((cer, index) => (
          <Tag key={index} color="processing">
            {cer.description}
          </Tag>
        ))}
      />
      <DescriptionItem
        title="Other Requirements"
        content={otherRequirements || 'N/A'}
      />
      <Divider />
      <Col span={24}>
        <Title level={5}>Shipping Capability</Title>
      </Col>
      <DescriptionItem
        title="Shipping Method"
        content={shippingMethod.description}
      />
      <DescriptionItem
        title="Destination"
        content={`${address} - ${(district || {}).description} - ${
          (ward || {}).description
        } - ${(province || {}).description}`}
      />
      <DescriptionItem title="Lead Time" content={leadTimeDisplay} />
      <Fragment>
        <Divider />
        <Col span={24}>
          <Title level={5}>RFQ Owner</Title>
        </Col>
        <DescriptionItem title="Created by" content={(buyer || {}).fullName} />
        <DescriptionItem title="Email" content={(buyer || {}).email} />
        <DescriptionItem title="Phone" content={(buyer || {}).phoneNumber} />
        {/* <DescriptionItem
          title="Company Name"
          content={(buyer || {}).companyName}
        /> */}
      </Fragment>
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

export default connectToRedux(RequestDetailsForSupplierComponent);
