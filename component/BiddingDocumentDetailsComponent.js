import {
  Col,
  Row
} from 'antd';
import React  from 'react';
import { DATE_TIME_FORMAT, displayCurrency, getFileAttach } from '../utils';
import Moment from 'react-moment';



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

const BiddingDocumentDetailsComponent = ({
  document
}) => {
  const { bid, dateCreated, description, fileName, id } = document || {};
  
  return (
    <Row style={{ width: '100%' }}>
      <DescriptionItem title="Bid Price" content={displayCurrency(bid)} />
      <DescriptionItem
        title="Date Created"
        content={<Moment format={DATE_TIME_FORMAT}>{dateCreated}</Moment>}
      />
      <DescriptionItem
        title="Description"
        content={description ? description : 'N/A'}
      />
      <DescriptionItem
        title="Files Attachment"
        content={
          fileName ? (
            <a
              href={getFileAttach(id)}
              target="_blank"
              rel="noreferrer"
            >
              {fileName}
            </a>
          ) : (
            'N/A'
          )
        }
      />
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

export default BiddingDocumentDetailsComponent;
