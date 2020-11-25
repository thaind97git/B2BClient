import {
  Button,
  Row,
  Typography,
  Tag,
  Col,
  Drawer,
  Modal,
  Tooltip,
  Avatar
} from 'antd';
import {
  ShoppingCartOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  AntDesignOutlined
} from '@ant-design/icons';
import Router from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import ReactTableLayout from '../layouts/ReactTableLayout';
import { DATE_TIME_FORMAT, DEFAULT_DATE_RANGE, getUtcTime } from '../utils';
import AllCategoryComponent from './AllCategoryComponent';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getProductBySupplier,
  GetProductBySupplierData,
  GetProductBySupplierError
} from '../stores/ProductState';
import Moment from 'react-moment';
import { get } from 'lodash/fp';
import AdminProductDetailsComponent from './AdminProductDetailsComponent';
import {
  activeSupplierProduct,
  deleteSupplierProduct,
  DeleteSupplierProductData
} from '../stores/SupplierState';
import QuotationDisplayComponent from './Utils/QuotationDisplayComponent';
const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    productBySupplierData: GetProductBySupplierData,
    productBySupplierError: GetProductBySupplierError,
    deleteSupplierProductData: DeleteSupplierProductData
  }),
  (dispatch) => ({
    getProductBySupplier: (
      pageIndex,
      pageSize,
      searchMessage,
      dateRange,
      category
    ) =>
      dispatch(
        getProductBySupplier({
          pageIndex,
          pageSize,
          productName: searchMessage,
          fromDate: dateRange.fromDate,
          toDate: dateRange.toDate,
          category
        })
      ),
    deleteSupplierProduct: (id) => dispatch(deleteSupplierProduct(id)),
    activeSupplierProduct: (id) => dispatch(activeSupplierProduct(id))
  })
);

const ProductStatus = ({ isDelete }) =>
  isDelete ? (
    <Tag color="error">Not Available</Tag>
  ) : (
    <Tag color="success">Available</Tag>
  );
const SupplierProductListingComponent = ({
  getProductBySupplier,
  productBySupplierData,
  deleteSupplierProduct,
  activeSupplierProduct
}) => {
  const [searchMessage, setSearchMessage] = useState('');
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [category, setCategory] = useState('all');
  const [openDetails, setOpenDetails] = useState(false);
  const [currentProductSelected, setCurrentProductSelected] = useState({});
  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Quotation',
      dataIndex: 'quotation',
      key: 'quotation'
    },
    {
      title: 'Supplying Status',
      dataIndex: 'status',
      key: 'status'
    },

    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action'
    }
  ];

  const getProductTable = (productData = []) => {
    return (
      productData &&
      productData.length > 0 &&
      productData.map((product = {}) => {
        const { description = [] } = product;
        const tooltipFirstQuotation = description.slice(1, description.length);
        const tooltipSecondQuotation = description.slice(2, description.length);
        console.log({
          description,
          slice: description.slice(1, description.length)
        });
        return {
          key: get('product.id')(product),
          productName: (
            <b
              onClick={() => {
                setCurrentProductSelected(product.product);
                setOpenDetails(true);
              }}
            >
              <a>{get('product.description')(product)}</a>
            </b>
          ),
          dateCreated: (
            <Moment format={DATE_TIME_FORMAT}>
              {getUtcTime(product.dateCreated)}
            </Moment>
          ),
          quotation:
            description.length > 0 ? (
              <Avatar.Group
                maxCount={1}
                maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
              >
                <QuotationDisplayComponent quotation={description[0]} />
                {tooltipFirstQuotation.length > 0 && (
                  <Fragment>
                    <Tooltip title="Other Quotation" placement="top">
                      <QuotationDisplayComponent quotation={description[1]} />
                    </Tooltip>
                    {tooltipSecondQuotation.map((quotation, index) => {
                      return (
                        <QuotationDisplayComponent
                          key={index}
                          quotation={quotation}
                        />
                      );
                    })}
                  </Fragment>
                )}
              </Avatar.Group>
            ) : (
              'N/A'
            ),
          status: <ProductStatus isDelete={product.isDeleted} />,
          action: product.isDeleted ? (
            <Button
              onClick={() => {
                Modal.confirm({
                  title: 'Do you want Re-Supply this product?',
                  icon: <ExclamationCircleOutlined />,
                  okText: 'Re-Supply',
                  cancelText: 'Cancel',
                  onOk: () => {
                    activeSupplierProduct((product.product || {}).id);
                  }
                });
              }}
              size="small"
              type="primary"
            >
              Supply
            </Button>
          ) : (
            <Button
              onClick={() => {
                Modal.confirm({
                  title: 'Do you want Un-Supply this product?',
                  icon: <ExclamationCircleOutlined />,
                  okText: 'Un-Supply',
                  cancelText: 'Cancel',
                  onOk: () => {
                    deleteSupplierProduct((product.product || {}).id);
                  }
                });
              }}
              size="small"
              type="primary"
              danger
            >
              UnSupply
            </Button>
          )
        };
      })
    );
  };

  let productData = [],
    totalCount = 0;
  if (productBySupplierData) {
    productData = productBySupplierData.data;
    totalCount = productBySupplierData.total;
  }

  return (
    <Row>
      <Row justify="space-between">
        <Drawer
          width={640}
          title="Product Details"
          placement={'right'}
          closable={true}
          onClose={() => setOpenDetails(false)}
          visible={openDetails}
          key={'product-details'}
        >
          <AdminProductDetailsComponent
            isSupplier
            productID={(currentProductSelected || {}).id}
          />
        </Drawer>
      </Row>
      <Col span={24}>
        <Row justify="space-between">
          <Title level={4}>Registered Product</Title>
          <Button
            icon={<ShoppingCartOutlined />}
            onClick={() => Router.push('/supplier/product/register')}
            type="primary"
          >
            Register other product
          </Button>
        </Row>
      </Col>
      <ReactTableLayout
        dispatchAction={getProductBySupplier}
        searchProps={{
          placeholder: 'Search by product name',
          searchMessage,
          setSearchMessage,
          exElement: (
            <AllCategoryComponent
              changeOnSelect
              onGetLastValue={(value) => setCategory(value)}
              size="large"
              isSearchStyle={false}
            />
          ),
          exCondition: [category]
        }}
        dateRangeProps={{
          dateRange,
          setDateRange
        }}
        data={getProductTable(productData || [])}
        columns={columns}
        totalCount={totalCount}
      />
    </Row>
  );
};

export default connectToRedux(SupplierProductListingComponent);
