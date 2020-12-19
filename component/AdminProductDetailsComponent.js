import React, { useState, useEffect, Fragment } from 'react';
import {
  Button,
  Col,
  Empty,
  Row,
  Skeleton,
  Space,
  Typography,
  Image,
  Divider,
  Tag,
  message
} from 'antd';
import {
  getProductBySupplier,
  getProductDetails,
  GetProductDetailsData,
  GetProductDetailsError,
  GetProductDetailsResetter,
  getSupplierProductDetails,
  GetSupplierProductDetailsData,
  GetSupplierProductDetailsError,
  GetSupplierProductDetailsResetter
} from '../stores/ProductState';
import { get } from 'lodash/fp';
import { connect } from 'react-redux';
import Router from 'next/router';
import { createStructuredSelector } from 'reselect';
import {
  checkErrorQuotations,
  displayCurrency,
  fallbackImage,
  getProductImage
} from '../utils';
import QuotationDisplayComponent from './Utils/QuotationDisplayComponent';
import Modal from 'antd/lib/modal/Modal';
import SupplierProductOptionComponent from './SupplierProductOptionComponent';
import {
  supplierUpdateQuotation,
  SupplierUpdateQuotationData
} from '../stores/SupplierState';
const { Title } = Typography;
const connectToRedux = connect(
  createStructuredSelector({
    productDetailData: GetProductDetailsData,
    productDetailError: GetProductDetailsError,
    supplierProductDetailData: GetSupplierProductDetailsData,
    supplierProductDetailError: GetSupplierProductDetailsError,
    updateQuotationData: SupplierUpdateQuotationData
  }),
  (dispatch) => ({
    getProduct: (id) => dispatch(getProductDetails(id)),
    getSupplierProductDetails: (id) => dispatch(getSupplierProductDetails(id)),
    supplierUpdateQuotation: ({ productId, description, callback }) =>
      dispatch(supplierUpdateQuotation({ productId, description, callback })),
    resetData: () => {
      dispatch(GetProductDetailsResetter);
      dispatch(GetSupplierProductDetailsResetter);
    },
    getProductBySupplier: ({
      pageIndex,
      pageSize,
      searchMessage,
      dateRange = {},
      category
    }) =>
      dispatch(
        getProductBySupplier({
          pageIndex,
          pageSize,
          productName: searchMessage,
          fromDate: dateRange.fromDate,
          toDate: dateRange.toDate,
          category
        })
      )
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
const AdminProductDetailsComponent = ({
  getProduct,
  productDetailData,
  productDetailError,
  productID,
  resetData,
  isSupplier = false,
  getSupplierProductDetails,
  supplierProductDetailData,
  supplierProductDetailError,
  supplierUpdateQuotation,
  updateQuotationData,
  getProductBySupplier
}) => {
  const [loading, setLoading] = useState(true);
  const [openQuotation, setOpenQuotation] = useState(false);
  const [quotationsUpdate, setQuotationsUpdate] = useState([]);

  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

  useEffect(() => {
    if (updateQuotationData) {
      setQuotationsUpdate([]);
      setOpenQuotation(false);
    }
  }, [updateQuotationData]);

  useEffect(() => {
    if (productID && !isSupplier) {
      getProduct(productID);
    }
  }, [productID, getProduct, isSupplier]);

  useEffect(() => {
    if (productID && isSupplier) {
      getSupplierProductDetails(productID);
    }
  }, [productID, getSupplierProductDetails, isSupplier]);

  useEffect(() => {
    if (productDetailError || productDetailData) {
      setLoading(false);
    }
  }, [productDetailData, productDetailError]);

  useEffect(() => {
    if (supplierProductDetailError || supplierProductDetailData) {
      setLoading(false);
    }
  }, [supplierProductDetailError, supplierProductDetailData]);

  if (loading) {
    return <Skeleton active />;
  }
  if (!productDetailData || !supplierProductDetailData) {
    return (
      <Empty
        style={{ padding: '180px 0px' }}
        description="Can not find any product !"
      />
    );
  }

  const detailsData = !isSupplier
    ? productDetailData
    : supplierProductDetailData.product;

  let quotations = supplierProductDetailData.description || [];
  return (
    <Row style={{ width: '100%' }}>
      <link
        rel="stylesheet"
        type="text/css"
        href="/static/assets/image-gallery.css"
      />
      <Modal
        title="Update Quotations"
        centered
        visible={openQuotation}
        onOk={() => {
          const { error, errorCurrent } = checkErrorQuotations(
            quotationsUpdate
          );
          if (error) {
            message.error(
              `The format for quotations error. Please Check for the record "${
                errorCurrent.quantity
              } : ${displayCurrency(errorCurrent.price)}"`
            );
            return;
          }
          supplierUpdateQuotation({
            productId: productID,
            description: quotationsUpdate,
            callback: () => {
              isSupplier && getProductBySupplier({});
              getSupplierProductDetails(productID);
            }
          });
        }}
        onCancel={() => setOpenQuotation(false)}
        width={1000}
      >
        {openQuotation ? (
          <SupplierProductOptionComponent
            defaultQuotation={quotations}
            unitLabel={get('unitOfMeasure.description')(detailsData)}
            onGetQuotation={(quotations) => {
              setQuotationsUpdate(quotations);
            }}
          />
        ) : null}
      </Modal>
      {!isSupplier && (
        <Col span={24} style={{ marginBottom: 12 }}>
          <Space>
            <Button
              onClick={() => {
                resetData();
                Router.push(`/admin/product/update?id=${productID}`);
              }}
              size="small"
              label="Edit"
            >
              Edit
            </Button>
          </Space>
        </Col>
      )}
      {isSupplier &&
        (quotations.length > 0 ? (
          <Fragment>
            <Col span={24}>
              <Title level={5}>Product Quotation</Title>
              <Button
                onClick={() => {
                  setOpenQuotation(true);
                }}
                size="small"
                type="primary"
                style={{ marginBottom: 16 }}
              >
                Update Quotation
              </Button>
            </Col>
            <DescriptionItem
              title="Quotation"
              content={quotations.map((quotation, index) => (
                <QuotationDisplayComponent
                  key={index}
                  quotation={quotation}
                  unitLabel={get('unitOfMeasure.description')(detailsData)}
                />
              ))}
            />
            <Divider />
          </Fragment>
        ) : (
          <Button
            onClick={() => {
              setOpenQuotation(true);
            }}
            size="small"
            type="primary"
            style={{ marginBottom: 16 }}
          >
            Add new quotation
          </Button>
        ))}
      <Col span={24}>
        <Title level={5}>Product Basic Information</Title>
      </Col>
      <DescriptionItem
        title="Product Name"
        content={(detailsData || {}).productName}
      />
      <DescriptionItem
        title="Unit of measure"
        content={
          <Tag color="processing">
            {get('unitOfMeasure.description')(detailsData)}
          </Tag>
        }
      />
      <DescriptionItem
        title="Description"
        content={
          <div
            dangerouslySetInnerHTML={{
              __html: (detailsData || {}).description
            }}
          />
        }
      />
      <Divider />
      <Col span={24}>
        <Title level={5}>Product Image</Title>
      </Col>
      <Col span={24} justify="space-between">
        {detailsData.images ? (
          detailsData.images.map((image, index) => (
            <Col key={index} span={8}>
              <Image src={getProductImage(image)} fallback={fallbackImage} />
            </Col>
          ))
        ) : (
          <Image
            width={200}
            height={200}
            src="error"
            fallback={fallbackImage}
          />
        )}
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
export default connectToRedux(AdminProductDetailsComponent);
